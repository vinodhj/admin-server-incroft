import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { UserByEmailInput, UserResponse } from "generated";
import { GraphQLError } from "graphql";

export const userByEmail = async (
  _: unknown,
  { input }: { input: UserByEmailInput },
  { apis: { userAPI } }: { apis: APIs },
): Promise<UserResponse> => {
  try {
    return await userAPI.userByEmail(input);
  } catch (error) {
    console.error("Unexpected error:", error);
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    } else if (error instanceof AuthorizationError) {
      throw new GraphQLError(`Unauthorized: ${error.message}`, {
        extensions: {
          code: "UNAUTHORIZED-RBAC",
          error,
        },
      });
    }
    throw new GraphQLError("Failed to get user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
