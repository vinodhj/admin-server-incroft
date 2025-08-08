import { UserDataSource } from "@src/datasources/user";
import { Role } from "db/schema/user";
import {
  ColumnName,
  DeleteUserInput,
  DisableUserInput,
  EditUserInput,
  EditUserResponse,
  InputMaybe,
  PaginatedUsersInputs,
  Sort,
  Sort_By,
  UserByEmailInput,
  UserByFieldInput,
  UserProfile,
  UserResponse,
  UsersConnection,
} from "generated";
import { GraphQLError } from "graphql";
import { SessionUserType } from ".";
import { userCache } from "@src/cache/in-memory-cache";
import { BaseService } from "./base-service";

export class UserServiceAPI extends BaseService {
  private readonly userDataSource: UserDataSource;

  constructor({ userDataSource, sessionUser }: { userDataSource: UserDataSource; sessionUser: SessionUserType }) {
    super(sessionUser);
    this.userDataSource = userDataSource;
  }

  // Delegate DataLoader access to datasource
  getUserLoader() {
    return this.userDataSource.getUserLoader();
  }

  getUserProfileLoader() {
    return this.userDataSource.getUserProfileLoader();
  }

  // Create a more robust cache key generation method
  private generateCacheKey(method: string, params?: any): string {
    if (method === "paginatedUsers") {
      const { ids, input } = params;
      return ids && ids.length > 0 ? `users:ids:${ids.join(",")}` : `users:paginated:${JSON.stringify(input)}`;
    }
    if (method === "userByEmail") {
      return `user:email:${params.email}`;
    }
    if (method === "userByField") {
      return `users:field:${params.field}:${params.value}`;
    }
    if (method === "userById") {
      return `user:id:${params.id}`;
    }
    return `users:${method}`;
  }

  async paginatedUsers(
    ids: InputMaybe<string[]> | undefined,
    input: InputMaybe<PaginatedUsersInputs> | undefined,
  ): Promise<UsersConnection> {
    // 🔐 Authorization check
    this.requireAnyPermission([
      { resource: "user", action: "read" },
      { resource: "user", action: "list" },
    ]);

    const processedInput = input ?? {
      first: 10,
      sort: Sort.Desc,
      sort_by: Sort_By.CreatedAt,
    };

    // Create a unique cache key for the request
    const cacheKey = this.generateCacheKey("paginatedUsers", { ids, input });

    // Check cache first
    const cachedResult = userCache.get(cacheKey);
    if (cachedResult) {
      console.log("hit cache: paginatedUsers");
      return cachedResult;
    }

    // If input params have ids, we will retrieve users using their ids, if not, we will retrieve users using pagination.
    let result: UsersConnection;
    if (ids && ids.length > 0) {
      result = await this.userDataSource.userByIds(ids);
      userCache.set(cacheKey, result);
      return result;
    }
    result = await this.userDataSource.paginatedUsers(processedInput);

    // Cache the result
    userCache.set(cacheKey, result);
    return result;
  }

  async users(): Promise<Array<UserResponse>> {
    // 🔐 Authorization check
    this.requireAnyPermission([
      { resource: "user", action: "read" },
      { resource: "user", action: "list" },
    ]);

    // Check cache first
    const cacheKey = "users:all";
    const cachedUsers = userCache.get(cacheKey);
    if (cachedUsers) {
      console.log("hit cache: users");
      return cachedUsers;
    }

    const users = await this.userDataSource.users();

    // Cache the users
    userCache.set(cacheKey, users);

    return users;
  }

  async userProfileById(id: string): Promise<UserProfile | null> {
    // 🔐 Authorization check
    const isOwnProfile = this.sessionUser?.id === id;

    if (isOwnProfile) {
      // Reading own profile - check for self permission
      this.requirePermission("user", "read_self");
    } else {
      // Reading someone else's profile - need general read permission
      this.requirePermission("user", "read");
    }
    try {
      // Use DataLoader through datasource
      const profile = await this.userDataSource.getProfileByUserId(id);

      if (!profile) return null;

      // Ensure department and designation are present for nested resolution
      return {
        ...profile,
        // These will be resolved by nested resolvers using CategoryAPI DataLoaders
        department: null as any,
        designation: null as any,
      };
    } catch (error) {
      console.error("Error loading user profile:", error);
      throw new Error("Failed to load user profile");
    }
  }

  async userByEmail(input: UserByEmailInput): Promise<UserResponse> {
    // 🔐 Authorization check - for email lookups, we need read permission
    const isOwnEmail = this.sessionUser?.email === input.email;

    if (isOwnEmail) {
      this.requireOwnershipOrPermission(input.email, "user", "read_self");
    } else {
      this.requirePermission("user", "read");
    }

    // Create cache key
    const cacheKey = `user:email:${input.email}`;

    // Check cache first
    const cachedUser = userCache.get(cacheKey);
    if (cachedUser) {
      console.log("hit cache: userByEmail");
      return cachedUser;
    }

    const result = await this.userDataSource.userByEmail(input);
    if (!result) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    // Cache the user
    userCache.set(cacheKey, result);
    // Also cache by ID for flexibility
    userCache.set(`user:id:${result.id}`, result);

    return result;
  }

  async userByField(input: UserByFieldInput): Promise<Array<UserResponse>> {
    // 🔐 Authorization check - different permissions based on field
    if (input.field === ColumnName.Id || input.field === ColumnName.Email) {
      // For sensitive fields, check ownership or admin permissions
      const isLookingUpSelf = this.sessionUser?.id === input.value || this.sessionUser?.email === input.value;
      if (!isLookingUpSelf) {
        this.requireOwnershipOrPermission(input.value, "user", "read_self");
      }
    } else {
      this.requirePermission("user", "read");
    }

    // Create cache key
    const cacheKey = `users:field:${input.field}:${input.value}`;

    // Check cache first
    const cachedUsers = userCache.get(cacheKey);
    if (cachedUsers) {
      console.log("hit cache: userByField");
      return cachedUsers;
    }

    let value = input.value;

    if (input.field === ColumnName.Role) {
      let role = Role.Viewer;
      if (input.value === "ADMIN") {
        role = Role.Admin;
      } else if (input.value === "MANAGER") {
        role = Role.Manager;
      }

      value = role;
    } else if (input.field === ColumnName.FirstName || input.field === ColumnName.LastName) {
      // Concatenate a wildcard % with the user_id
      value = `${input.value}%`;
    }
    const users = await this.userDataSource.userByfield({
      field: input.field,
      value,
    });

    // Cache the users
    userCache.set(cacheKey, users);

    // cache individual users by ID
    users.forEach((u) => {
      userCache.set(`user:id:${u.id}`, u);
    });

    return users;
  }

  async editUser(input: EditUserInput): Promise<EditUserResponse> {
    // 🔐 Authorization check - can edit own profile or need update permission
    this.requireOwnershipOrPermission(input.id, "user", "update");

    const result = await this.userDataSource.editUser(input);

    // Invalidate relevant cache entries
    userCache.delete(`user:id:${input.id}`);
    userCache.delete(`user:email:${result.user.email}`);
    userCache.invalidateByPattern("users:.*");

    return result;
  }

  async deleteUser(input: DeleteUserInput): Promise<boolean> {
    // 🔐 Authorization check - only specific roles can delete users
    this.requirePermission("user", "delete");

    const isRoleAdmin = this.sessionUser?.role === Role.Admin;

    // If the user is not an admin, return an empty object
    if (!isRoleAdmin) {
      throw new GraphQLError("Only admin can delete users", {
        extensions: {
          code: "UNAUTHORIZED_ROLE",
        },
      });
    }
    const deleteResult = await this.userDataSource.deleteUser(input);
    if (deleteResult) {
      // Invalidate cache entries
      userCache.delete(`user:id:${input.id}`);
      userCache.invalidateByPattern("users:.*");
    }
    return deleteResult;
  }

  async disableUser(input: DisableUserInput): Promise<boolean> {
    // 🔐 Authorization check - only specific roles can disable users
    this.requirePermission("user", "disable");

    // Validate access rights
    const isRoleAdmin = this.sessionUser?.role === Role.Admin;

    // If the user is not an admin, return an empty object
    if (!isRoleAdmin) {
      throw new GraphQLError("Only admin can disable/enable users", {
        extensions: {
          code: "UNAUTHORIZED_ROLE",
        },
      });
    }
    const disableResult = await this.userDataSource.disableUser(input);
    if (disableResult) {
      // Invalidate cache entries
      userCache.clear();
    }
    return disableResult;
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const isOwnProfile = this.sessionUser?.id === id;

    if (isOwnProfile) {
      // Reading own profile - check for self permission
      this.requirePermission("user", "read_self");
    } else {
      // Reading someone else's profile - need general read permission
      this.requirePermission("user", "read");
    }

    return this.userDataSource.getUserById(id);
  }
}
