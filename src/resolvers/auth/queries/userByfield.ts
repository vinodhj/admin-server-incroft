import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { UserByFieldInput, UserResponse } from "generated";
import { GraphQLError } from "graphql";

export const userByfield = async (
  _: unknown,
  { input }: { input: UserByFieldInput },
  { apis: { userAPI } }: { apis: APIs },
): Promise<Array<UserResponse>> => {
  try {
    return await userAPI.userByField(input);
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
    throw new GraphQLError("Failed to get user by field", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
