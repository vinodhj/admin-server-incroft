import { EditUserInput, EditUserResponse } from "generated";
import { GraphQLError } from "graphql";
import { APIs } from "@src/services";
import { AuthorizationError } from "@src/auth/authorization-service";

export const editUser = async (
  _: unknown,
  { input }: { input: EditUserInput },
  { apis: { userAPI } }: { apis: APIs },
): Promise<EditUserResponse> => {
  try {
    return await userAPI.editUser(input);
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
    throw new GraphQLError("Failed to edit user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
