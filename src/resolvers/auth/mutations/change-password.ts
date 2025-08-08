import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { ChangePasswordInput } from "generated";
import { GraphQLError } from "graphql";

export const changePassword = async (
  _: unknown,
  { input }: { input: ChangePasswordInput },
  { apis: { authAPI } }: { apis: APIs },
): Promise<boolean> => {
  try {
    return await authAPI.changePassword(input);
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
    throw new GraphQLError("Failed to change password", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
