import { DrizzleD1Database } from "drizzle-orm/d1";
import { DeleteUserInput, EditUserInput, PaginatedUsersInputs, Sort, Sort_By, UserByEmailInput, UserByFieldInput } from "generated";
import { asc, desc, eq, inArray, like, SQLWrapper, gt, lt } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { Role, user } from "db/schema/user";
import { SessionUserType } from "@src/services";
import DataLoader from "dataloader";
import { userProfile } from "db/schema";
import { nanoid } from "nanoid";

export class UserDataSource {
  private readonly db: DrizzleD1Database;
  private readonly sessionUser: SessionUserType;
  private readonly userLoader: DataLoader<string, typeof user.$inferSelect | Error>;

  // Constants for pagination and batching
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly MAX_PAGE_SIZE = 100; // Set maximum page size
  private readonly BATCH_SIZE = 50; // Maximum number of IDs to fetch in a single batch

  constructor({ db, sessionUser }: { db: DrizzleD1Database; sessionUser?: SessionUserType }) {
    this.db = db;
    this.sessionUser = sessionUser ?? null;

    this.userLoader = new DataLoader(
      async (ids: readonly string[]) => {
        // batch fetch
        return this.userByBatchIds(ids as string[]);
      },
      {
        maxBatchSize: this.BATCH_SIZE, // Set maximum batch size
      },
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

  async userByIds(ids: string[]) {
    try {
      const results = await this.userLoader.loadMany(ids);
      // Filter out errors and handle them
      const users: (typeof user.$inferSelect)[] = [];
      const errors: Error[] = [];

      results.forEach((result) => {
        if (result instanceof Error) {
          errors.push(result);
        } else {
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
          totalCount: users.length, // Todo: add total count
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

  async userByBatchIds(ids: string[]) {
    try {
      const result = await this.db.select().from(user).where(inArray(user.id, ids)).execute();
      if (!result) {
        return [];
      }

      // Map results to ensure order matches the requested IDs
      const userMap = new Map(result.map((u) => [u.id, u]));
      return ids.map((id) => userMap.get(id) || new Error(`User with ID ${id} not found`));
    } catch (error) {
      console.log(error);
      throw new GraphQLError("Failed to fetch user by batch ids", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  async paginatedUsers(input: PaginatedUsersInputs) {
    const { after, sort_by = Sort_By.UpdatedAt } = input;
    const sort = input.sort === Sort.Asc ? Sort.Asc : Sort.Desc;

    // Apply default and maximum page size limits from class constants
    const requestedLimit = input.first ?? this.DEFAULT_PAGE_SIZE;
    const first = Math.min(requestedLimit, this.MAX_PAGE_SIZE);
    const sortField = sort_by === Sort_By.CreatedAt ? user.created_at : user.updated_at;

    try {
      // Use the helper function to parse the cursor date safely
      const afterDate = this.parseCursorDate(after);

      // Fetch all the user with pagination
      const result = await this.db
        .select()
        .from(user)
        .orderBy(this.sorter(sortField, sort))
        .where(sort === Sort.Asc ? gt(sortField, afterDate || new Date(0)) : lt(sortField, afterDate || new Date()))
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
          totalCount: items.length, // Todo: add total count
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

  // Helper method to build personal information
  private buildPersonalData(
    input: EditUserInput,
  ): Partial<
    Pick<typeof userProfile.$inferInsert, "employee_photo_url" | "personal_email" | "date_of_birth" | "gender" | "marital_status">
  > {
    const result: Partial<
      Pick<typeof userProfile.$inferInsert, "employee_photo_url" | "personal_email" | "date_of_birth" | "gender" | "marital_status">
    > = {};

    // TODO: Upload employee photo URL to a R2 bucket
    if (this.isDefined(input.employee_photo_url)) result.employee_photo_url = input.employee_photo_url;
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
  private buildProfileData(input: EditUserInput): Partial<typeof userProfile.$inferInsert> {
    return {
      user_id: input.id,
      ...this.buildAddressData(input),
      ...this.buildPersonalData(input),
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
      const isProfileExists = profileResult?.[0] || null;

      const profileData = this.buildProfileData(input);

      if (isProfileExists) {
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

  async userProfileById(id: string) {
    try {
      const result = await this.db.select().from(userProfile).where(eq(userProfile.user_id, id)).get();
      return result;
    } catch (error: any) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to get user profile", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message ? error.message : error,
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
