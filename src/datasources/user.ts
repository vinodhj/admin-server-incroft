import { DrizzleD1Database } from "drizzle-orm/d1";
import {
  DeleteUserInput,
  DisableUserInput,
  EditUserInput,
  PaginatedUsersInputs,
  Sort,
  Sort_By,
  UserByEmailInput,
  UserByFieldInput,
} from "generated";
import { asc, desc, eq, inArray, like, SQLWrapper, gt, lt, sql, SQL, and, or } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { Role, user } from "db/schema/user";
import { SessionUserType } from "@src/services";
import DataLoader from "dataloader";
import { userProfile } from "db/schema";
import { nanoid } from "nanoid";
import { R2StorageService } from "./r2-storage-service";
import { StorageConfig, StorageFactory } from "./storage-factory";

export class UserDataSource {
  private readonly db: DrizzleD1Database;
  private readonly sessionUser: SessionUserType;
  private readonly r2Storage: R2StorageService;

  private readonly userLoader: DataLoader<string, typeof user.$inferSelect | null>;
  private readonly userProfileLoader: DataLoader<string, typeof userProfile.$inferSelect | null>;

  // Constants for pagination and batching
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly MAX_PAGE_SIZE = 100; // Set maximum page size
  private readonly BATCH_SIZE = 50; // Maximum number of IDs to fetch in a single batch

  constructor({ db, sessionUser, storageConfig }: { db: DrizzleD1Database; sessionUser?: SessionUserType; storageConfig: StorageConfig }) {
    this.db = db;
    this.sessionUser = sessionUser ?? null;
    this.r2Storage = StorageFactory.getR2Storage(storageConfig);

    // User loader - batches user queries by ID
    this.userLoader = new DataLoader(
      async (ids: readonly string[]) => {
        try {
          const users = await this.db
            .select()
            .from(user)
            .where(inArray(user.id, ids as string[]))
            .execute();

          const userMap = new Map(users.map((u) => [u.id, u]));
          return ids.map((id) => userMap.get(id) || null);
        } catch (error) {
          console.error("Error batch loading users:", error);
          return ids.map(() => null);
        }
      },
      { maxBatchSize: this.BATCH_SIZE },
    );

    // Profile loader - batches profile queries by user_id
    this.userProfileLoader = new DataLoader(
      async (userIds: readonly string[]) => {
        try {
          const profiles = await this.db
            .select()
            .from(userProfile)
            .where(inArray(userProfile.user_id, userIds as string[]))
            .execute();

          const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
          return userIds.map((userId) => profileMap.get(userId) || null);
        } catch (error) {
          console.error("Error batch loading profiles:", error);
          return userIds.map(() => null);
        }
      },
      { maxBatchSize: this.BATCH_SIZE },
    );
  }

  /**
   * Create audit fields using auto-generated User type
   */
  private UpdateAuditFields() {
    return {
      updated_at: new Date(),
      updated_by: this.sessionUser?.name ?? "SYSTEM",
    };
  }

  private createAuditFields() {
    const timestamp = new Date();
    const user = this.sessionUser?.name ?? "SYSTEM";

    return {
      created_at: timestamp,
      created_by: user,
      updated_at: timestamp,
      updated_by: user,
    };
  }

  // Helper method to map role from GraphQL enum to Drizzle enum
  private mapRole(roleString?: string): Role {
    switch (roleString) {
      case "ADMIN":
        return Role.Admin;
      case "MANAGER":
        return Role.Manager;
      default:
        return Role.Viewer;
    }
  }

  // Expose DataLoaders for use in nested resolvers
  getUserProfileLoader() {
    return this.userProfileLoader;
  }

  // Expose DataLoaders for service layer
  getUserLoader() {
    return this.userLoader;
  }

  // Convenience methods using DataLoaders
  async getUserById(id: string): Promise<typeof user.$inferSelect | null> {
    return this.userLoader.load(id);
  }

  async getProfileByUserId(userId: string): Promise<typeof userProfile.$inferSelect | null> {
    return this.userProfileLoader.load(userId);
  }

  async userByIds(ids: string[]) {
    try {
      const results = await this.userLoader.loadMany(ids);
      // Filter out errors and handle them
      const users: (typeof user.$inferSelect)[] = [];
      const errors: Error[] = [];

      results.forEach((result) => {
        if (result instanceof Error) {
          errors.push(result);
        } else if (result !== null) {
          users.push(result);
        }
      });

      if (errors.length > 0) {
        console.error("Errors loading some users:", errors);
      }

      // Convert services to edges
      const edges = users.map((item) => ({
        cursor: item.created_at.toISOString(),
        node: item,
      }));
      return {
        edges,
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          totalCount: users.length,
        },
      };
    } catch (error) {
      console.error("Failed to load users by ids:", error);
      throw new GraphQLError("Failed to fetch users", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  async paginatedUsers(input: PaginatedUsersInputs) {
    const { sort_by = Sort_By.UpdatedAt } = input;
    const sort = input.sort === Sort.Asc ? Sort.Asc : Sort.Desc;

    // Apply default and maximum page size limits from class constants
    const requestedLimit = input.first ?? this.DEFAULT_PAGE_SIZE;
    const first = Math.min(requestedLimit, this.MAX_PAGE_SIZE);
    const sortField = sort_by === Sort_By.CreatedAt ? user.created_at : user.updated_at;

    try {
      // Get where conditions based on input filters
      const whereCondition = this.buildExpenseWhereCondition(input, sortField, sort);

      // Get total count of users
      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(whereCondition)
        .get();

      const totalCount = totalCountResult ? totalCountResult.count : 0;

      // Fetch all the user with pagination
      const result = await this.db
        .select()
        .from(user)
        .orderBy(this.sorter(sortField, sort))
        .where(whereCondition)
        .limit(first + 1) // Fetch one extra to determine if there are more pages
        .execute();

      // Check if there's a next page and trim the extra result
      const hasNextPage = result.length > first;
      const items = hasNextPage ? result.slice(0, first) : result;

      // Convert services to edges
      const edges = items.map((item) => ({
        cursor: (sort_by === Sort_By.CreatedAt ? item.created_at : item.updated_at).toISOString(),
        node: item as typeof user.$inferSelect,
      }));

      return {
        edges,
        pageInfo: {
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage,
          totalCount,
        },
      };
    } catch (error: any) {
      console.error("Error in paginatedUsers:", error);
      throw new GraphQLError("Failed to get paginated users", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  // Helper to build WHERE conditions for user pagination filtering
  private buildExpenseWhereCondition(input: PaginatedUsersInputs, sortField: any, sort: Sort): SQL | undefined {
    const conditions: SQL[] = [];

    const afterDate = this.parseCursorDate(input.after);
    conditions.push(eq(user.is_disabled, input.include_disabled ?? false));
    if (sort === Sort.Asc) {
      conditions.push(gt(sortField, afterDate || new Date(0)));
    } else {
      conditions.push(lt(sortField, afterDate || new Date()));
    }

    // Add filters for scalar fields
    this.addScalarFilters(conditions, input);

    // Combine all conditions with AND
    return conditions.length > 1 ? and(...conditions) : conditions[0];
  }

  // Helper to add scalar filters
  private addScalarFilters(conditions: SQL[], input: PaginatedUsersInputs): void {
    const { emp_code, name, email, phone, role } = input;

    // Filter by employee code
    if (emp_code !== undefined && emp_code !== null) {
      conditions.push(eq(user.emp_code, emp_code));
    }

    // Filter by name (first or last)
    if (name !== undefined && name !== null) {
      const nameCondition = or(like(user.first_name, `%${name}%`), like(user.last_name, `%${name}%`));
      if (nameCondition) {
        conditions.push(nameCondition);
      }
    }

    // Filter by email
    if (email !== undefined && email !== null) {
      conditions.push(eq(user.email, email));
    }

    // Filter by phone
    if (phone !== undefined && phone !== null) {
      conditions.push(eq(user.phone, phone));
    }

    // Filter by role
    if (role !== undefined && role !== null) {
      const mappedRole = this.mapRole(role);
      conditions.push(eq(user.role, mappedRole));
    }
    // Add any other scalar filters as needed
  }

  async users() {
    try {
      return this.db.select().from(user).execute();
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to get users", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  async userByEmail(input: UserByEmailInput) {
    try {
      return this.db.select().from(user).where(eq(user.email, input.email)).get();
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to get user", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  async userByfield(input: UserByFieldInput) {
    try {
      const condition =
        input.field === "first_name" || input.field === "last_name"
          ? like(user[input.field], input.value)
          : eq(user[input.field], input.value);
      return this.db.select().from(user).where(condition).execute();
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to get user", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  // Helper method to build user update data
  private buildUserUpdateData(input: EditUserInput): Partial<typeof user.$inferInsert> {
    const role = this.mapRole(input.role);
    const isRoleAdmin = this.sessionUser?.role === Role.Admin;

    return {
      ...(isRoleAdmin && { email: input.email }), // Only admin can update email
      ...(isRoleAdmin && { role }), // Only admin can update role
      first_name: input.first_name,
      last_name: input.last_name,
      phone: input.phone,
      ...(this.isDefined(input.is_verified) && { is_verified: input.is_verified }),
      ...(this.isDefined(input.is_disabled) && { is_disabled: input.is_disabled }),
      ...(this.isDefined(input.force_password_change) && { force_password_change: input.force_password_change }),
      ...this.UpdateAuditFields(),
    };
  }

  // Helper method to build address information
  private buildAddressData(
    input: EditUserInput,
  ): Partial<Pick<typeof userProfile.$inferInsert, "address" | "city" | "state" | "country" | "zipcode">> {
    const result: Partial<Pick<typeof userProfile.$inferInsert, "address" | "city" | "state" | "country" | "zipcode">> = {};

    if (this.isDefined(input.address)) result.address = input.address;
    if (this.isDefined(input.city)) result.city = input.city;
    if (this.isDefined(input.state)) result.state = input.state;
    if (this.isDefined(input.country)) result.country = input.country;
    if (this.isDefined(input.zipcode)) result.zipcode = input.zipcode;

    return result;
  }

  // Helper method to build employment information
  private buildEmploymentData(
    input: EditUserInput,
  ): Partial<
    Pick<
      typeof userProfile.$inferInsert,
      "designation_id" | "department_id" | "employment_type" | "work_location" | "date_of_joining" | "date_of_leaving"
    >
  > {
    const isRoleAdmin = this.sessionUser?.role === Role.Admin;

    // If the user is not an admin, return an empty object
    if (!isRoleAdmin) {
      return {};
    }

    const result: Partial<
      Pick<
        typeof userProfile.$inferInsert,
        "designation_id" | "department_id" | "employment_type" | "work_location" | "date_of_joining" | "date_of_leaving"
      >
    > = {};

    if (this.isDefined(input.designation_id)) result.designation_id = input.designation_id;
    if (this.isDefined(input.department_id)) result.department_id = input.department_id;
    if (this.isDefined(input.employment_type)) result.employment_type = input.employment_type;
    if (this.isDefined(input.work_location)) result.work_location = input.work_location;
    if (this.isDefined(input.date_of_joining)) result.date_of_joining = new Date(input.date_of_joining);
    if (this.isDefined(input.date_of_leaving)) result.date_of_leaving = new Date(input.date_of_leaving);

    return result;
  }

  /**
   * Upload employee photo to R2 and return the public URL
   */
  async uploadEmployeePhoto(file: File | ArrayBuffer | Uint8Array, employeeId: string): Promise<string> {
    // Validate file if it's a File object
    if (file instanceof File) {
      if (!R2StorageService.isValidImageType(file.type)) {
        throw new GraphQLError("Invalid image type. Only JPEG, PNG, WebP, and GIF are allowed.", {
          extensions: { code: "INVALID_FILE_TYPE" },
        });
      }

      if (!R2StorageService.isValidFileSize(file.size, 5)) {
        throw new GraphQLError("File size exceeds 5MB limit.", {
          extensions: { code: "FILE_SIZE_EXCEEDED" },
        });
      }
    }

    const uploadResult = await this.r2Storage.uploadEmployeePhoto(file, employeeId);

    if (!uploadResult.success) {
      throw new GraphQLError(`Failed to upload employee photo: ${uploadResult.error}`, {
        extensions: { code: "UPLOAD_FAILED" },
      });
    }

    return uploadResult.url!;
  }

  /**
   * Delete employee photo from R2
   */
  async deleteEmployeePhoto(photoUrl: string): Promise<void> {
    try {
      // Extract the key from the full URL
      const url = new URL(photoUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const deleted = await this.r2Storage.deleteFile(key);
      if (!deleted) {
        console.warn(`Failed to delete old photo: ${key}`);
      }
    } catch (error) {
      console.error(`Error deleting photo ${photoUrl}:`, error);
      // Don't throw error as this is cleanup - main operation should succeed
    }
  }

  // Helper method to build personal information
  private async buildPersonalData(
    input: EditUserInput,
    existingProfile?: typeof userProfile.$inferSelect | null,
  ): Promise<
    Partial<Pick<typeof userProfile.$inferInsert, "employee_photo_url" | "personal_email" | "date_of_birth" | "gender" | "marital_status">>
  > {
    const result: Partial<
      Pick<typeof userProfile.$inferInsert, "employee_photo_url" | "personal_email" | "date_of_birth" | "gender" | "marital_status">
    > = {};

    // Handle employee photo upload
    if (input.employee_photo_file) {
      try {
        // Delete old photo
        if (existingProfile?.employee_photo_url) {
          await this.deleteEmployeePhoto(existingProfile.employee_photo_url);
        }

        // Upload new photo
        const uploadResult = await this.uploadEmployeePhoto(input.employee_photo_file, input.id);
        result.employee_photo_url = uploadResult;
      } catch (error) {
        console.error("Error uploading employee photo:", error);
      }
    }

    // if (this.isDefined(input.employee_photo_url)) result.employee_photo_url = input.employee_photo_url;
    if (this.isDefined(input.personal_email)) result.personal_email = input.personal_email;
    if (this.isDefined(input.date_of_birth)) result.date_of_birth = new Date(input.date_of_birth);
    if (this.isDefined(input.gender)) result.gender = input.gender;
    if (this.isDefined(input.marital_status)) result.marital_status = input.marital_status;

    return result;
  }

  // Helper method to build JSON fields data
  private buildJSONFields(
    input: EditUserInput,
  ): Partial<Pick<typeof userProfile.$inferInsert, "emergency_contact_details" | "hr_and_compliance" | "payroll_details">> {
    const result: Partial<Pick<typeof userProfile.$inferInsert, "emergency_contact_details" | "hr_and_compliance" | "payroll_details">> =
      {};

    if (this.isDefined(input.emergency_contact_details)) {
      result.emergency_contact_details = input.emergency_contact_details
        ? {
            name: input.emergency_contact_details.name ?? undefined,
            phone: input.emergency_contact_details.phone ?? undefined,
            relationship: input.emergency_contact_details.relationship ?? undefined,
            email: this.isDefined(input.emergency_contact_details.email) ? input.emergency_contact_details.email : undefined,
          }
        : null;
    }

    if (this.isDefined(input.hr_and_compliance)) {
      result.hr_and_compliance = input.hr_and_compliance
        ? {
            aadhar_number: input.hr_and_compliance.aadhar_number ?? undefined,
            pan_number: input.hr_and_compliance.pan_number ?? undefined,
            passport_number: input.hr_and_compliance.passport_number ?? undefined,
            visa_status: input.hr_and_compliance.visa_status ?? undefined,
          }
        : null;
    }

    if (this.isDefined(input.payroll_details)) {
      result.payroll_details = input.payroll_details
        ? {
            bank_account_number: input.payroll_details.bank_account_number ?? undefined,
            bank_name: input.payroll_details.bank_name ?? undefined,
            ifsc_code: input.payroll_details.ifsc_code ?? undefined,
            pf_number: input.payroll_details.pf_number ?? undefined,
          }
        : null;
    }

    return result;
  }

  // Helper method to build complete profile data
  private async buildProfileData(
    input: EditUserInput,
    existingProfile?: typeof userProfile.$inferSelect | null,
  ): Promise<Partial<typeof userProfile.$inferInsert>> {
    const personalData = await this.buildPersonalData(input, existingProfile);
    return {
      user_id: input.id,
      ...this.buildAddressData(input),
      ...personalData,
      ...this.buildEmploymentData(input),
      ...this.buildJSONFields(input),
      ...this.UpdateAuditFields(),
    };
  }

  // Helper method to create new profile data
  private buildNewProfileData(
    input: EditUserInput,
    profileData: Partial<typeof userProfile.$inferInsert>,
  ): typeof userProfile.$inferInsert {
    return {
      id: nanoid(),
      user_id: input.id,
      designation_id: input.designation_id!,
      department_id: input.department_id!,
      employment_type: input.employment_type!,
      work_location: input.work_location!,
      ...profileData,
      ...this.createAuditFields(),
    };
  }

  async editUser(input: EditUserInput) {
    try {
      const userUpdateData = this.buildUserUpdateData(input);

      // batch user update and fetch user profile data
      const batchResponse = await this.db.batch([
        this.db.update(user).set(userUpdateData).where(eq(user.id, input.id)).returning(),
        this.db.select().from(userProfile).where(eq(userProfile.user_id, input.id)),
      ]);

      const [userResult, profileResult]: [Array<typeof user.$inferSelect>, Array<typeof userProfile.$inferSelect>] = batchResponse;

      // Validate results
      if (!userResult?.length) {
        throw new Error("User not found or update failed");
      }

      const updatedUser = userResult[0];
      const existingProfile = profileResult?.[0] || null;

      const profileData = await this.buildProfileData(input, existingProfile);

      if (existingProfile) {
        // Update existing profile
        const updatedProfile = await this.db
          .update(userProfile)
          .set(profileData)
          .where(eq(userProfile.user_id, input.id))
          .returning()
          .get();
        if (!updatedProfile) {
          throw new Error("Failed to update user profile");
        }
      } else if (input.designation_id && input.department_id && input.employment_type && input.work_location) {
        // Create new profile
        const newProfileData = this.buildNewProfileData(input, profileData);
        const createdProfile = await this.db.insert(userProfile).values(newProfileData).execute();
        if (!createdProfile) {
          throw new Error("Failed to create user profile");
        }
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return {
        success: true,
        user: {
          ...userWithoutPassword,
        },
      };
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to edit user profile", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  async deleteUser(input: DeleteUserInput) {
    try {
      const isRoleAdmin = this.sessionUser?.role === Role.Admin;

      // If the user is not an admin, return an empty object
      if (!isRoleAdmin) {
        throw new GraphQLError("Only admin can delete users", {
          extensions: {
            code: "UNAUTHORIZED_ROLE",
          },
        });
      }

      const deleted = await this.db.delete(user).where(eq(user.id, input.id)).execute();
      if (deleted && deleted.success) {
        if (deleted.meta.changed_db) {
          return true;
        } else {
          console.warn(`User not deleted. Changes: ${deleted.meta.changes}`);
          return false;
        }
      } else {
        console.error("Delete operation failed:", deleted);
        return false;
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to delete user", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
        },
      });
    }
  }

  async disableUser(input: DisableUserInput) {
    try {
      const updateData = {
        is_disabled: input.is_disabled,
        ...this.UpdateAuditFields(),
      };
      const result = await this.db
        .update(user)
        .set(updateData)
        .where(
          inArray(
            user.id,
            input.ids.map((id) => id.trim()),
          ),
        )
        .returning()
        .execute();

      if (!result || result.length === 0) {
        throw new GraphQLError("No users found to disable/enable", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }

      return true;
    } catch (error) {
      console.log("error", error);
      if (error instanceof GraphQLError || error instanceof Error) {
        //to throw GraphQLError/original error
        throw new GraphQLError(`Failed to disable/enable user: ${error.message ? "- " + error.message : ""}`, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
      throw new GraphQLError("Failed to disable/enable user due to an unexpected error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  private sorter(field: SQLWrapper, sort: Sort) {
    if (sort === Sort.Asc) {
      return asc(field);
    }
    return desc(field);
  }
  private parseCursorDate(cursor: string | null | undefined): Date | undefined {
    if (!cursor) return undefined;

    try {
      const date = new Date(cursor);
      if (isNaN(date.getTime())) {
        throw new GraphQLError("Invalid cursor date", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return date;
    } catch (error) {
      throw new GraphQLError("Invalid cursor format", {
        extensions: {
          code: "BAD_USER_INPUT",
          error,
        },
      });
    }
  }

  // Helper method to check if value is defined (not undefined and not null)
  private isDefined<T>(value: T | undefined | null): value is T {
    return value !== undefined && value !== null;
  }
}
