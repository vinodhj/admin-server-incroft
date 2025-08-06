import { DrizzleD1Database } from "drizzle-orm/d1";
import { ChangePasswordInput, LoginInput, SignUpInput } from "generated";
import { and, count, eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { nanoid } from "nanoid";
import { Role, user } from "db/schema/user";
import bcrypt from "bcryptjs";
import { handleError, validateCurrentPassword } from "./utils";
import { SessionUserType } from "@src/services";
import { KvStorageDataSource } from "./kv-storage";

export class AuthDataSource {
  private readonly db: DrizzleD1Database;
  private readonly kvStorageDataSource: KvStorageDataSource;
  private readonly sessionUser: SessionUserType;

  constructor({
    db,
    kvStorageDataSource,
    sessionUser,
  }: {
    db: DrizzleD1Database;
    kvStorageDataSource: KvStorageDataSource;
    sessionUser?: SessionUserType;
  }) {
    this.db = db;
    this.kvStorageDataSource = kvStorageDataSource;
    this.sessionUser = sessionUser ?? null;
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

  async signUp(input: SignUpInput) {
    try {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      let role = Role.Viewer;
      if (input.role === "ADMIN") {
        role = Role.Admin;
      } else if (input.role === "MANAGER") {
        role = Role.Manager;
      }

      // Ensure required fields are not undefined
      if (!input.first_name || !input.last_name || !input.email || !input.phone || !input.emp_code) {
        throw new GraphQLError("Missing required user fields", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const result = await this.db
        .insert(user)
        .values({
          id: nanoid(),
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          phone: input.phone,
          password: hashedPassword,
          emp_code: input.emp_code,
          role,
          last_login_at: null,
          force_password_change: input.force_password_change ?? false,
          is_verified: false,
          is_disabled: false,
          ...this.createAuditFields(),
        })
        .returning()
        .get();

      if (!result) {
        throw new GraphQLError("Failed to create user", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }

      const { password, ...userWithoutPassword } = result;

      return {
        success: true,
        user: {
          ...userWithoutPassword,
        },
      };
    } catch (error) {
      console.log("error", error);
      if (error instanceof GraphQLError || error instanceof Error) {
        //to throw GraphQLError/original error
        throw new GraphQLError(`Failed to sign up ${error.message ? "- " + error.message : ""}`, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
      throw new GraphQLError("Failed to sign up due to an unexpected error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  async login(input: LoginInput) {
    try {
      const result = await this.db.select().from(user).where(eq(user.email, input.email)).get();
      if (!result) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      const isPasswordMatch = await bcrypt.compare(input.password, result.password);
      if (!isPasswordMatch) {
        throw new GraphQLError("Invalid password", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // Update last login time
      await this.db
        .update(user)
        .set({
          last_login_at: new Date(),
          ...this.UpdateAuditFields(),
        })
        .where(eq(user.id, result.id))
        .returning()
        .get();

      const { password, ...userWithoutPassword } = result;

      return {
        success: true,
        user: {
          ...userWithoutPassword,
        },
        token_version: -1, // token version is not used in login, it will be future enhancement
      };
    } catch (error) {
      console.error("error", error);
      if (error instanceof GraphQLError || error instanceof Error) {
        //to throw GraphQLError/original error
        throw new GraphQLError(`Failed to login ${error.message ? "- " + error.message : ""}`, {
          extensions: {
            code: error instanceof GraphQLError ? error.extensions.code : "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
      throw new GraphQLError("Failed to login due to an unexpected error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  async changePassword(input: ChangePasswordInput) {
    try {
      const result_user = await this.getUserById(input.id);
      await validateCurrentPassword(input.current_password, result_user.password);
      return await this.updatePassword(input.id, input.new_password);
    } catch (error) {
      handleError(error, "Failed to change password");
    }
  }

  // need to call from another service
  private async getUserById(id: string) {
    try {
      const result_user = await this.db.select().from(user).where(eq(user.id, id)).get();
      if (!result_user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      return result_user;
    } catch (error) {
      console.error("error", error);
      if (error instanceof GraphQLError || error instanceof Error) {
        //to throw GraphQLError/original error
        throw new GraphQLError(`Failed to get user ${error.message ? "- " + error.message : ""}`, {
          extensions: {
            code: error instanceof GraphQLError ? error.extensions.code : "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
      throw new GraphQLError("Failed to get user due to an unexpected error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  private async updatePassword(id: string, newPassword: string) {
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const result = await this.db
        .update(user)
        .set({
          password: hashedNewPassword,
          ...this.UpdateAuditFields(),
        })
        .where(and(eq(user.id, id)))
        .returning()
        .get();

      if (result) return true;
      console.warn("Password update failed - no rows affected");
      return false;
    } catch (error) {
      console.error(`Error updating password for user ${id}:`, error);
      return false;
    }
  }

  async getTotalEmployeeCount(): Promise<number> {
    try {
      const result = await this.db.select({ count: count() }).from(user).execute();

      if (!result || result.length === 0) {
        return 0;
      }

      return result[0].count;
    } catch (error) {
      console.error("Error getting total employee count:", error);
      throw new GraphQLError("Failed to get total employee count", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
