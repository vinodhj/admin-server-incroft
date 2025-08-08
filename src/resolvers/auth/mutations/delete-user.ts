import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { DeleteUserInput } from "generated";
import { GraphQLError } from "graphql";

export const deleteUser = async (
  _: unknown,
  { input }: { input: DeleteUserInput },
  {
    apis: { userAPI },
  }: {
    apis: APIs;
  },
): Promise<boolean> => {
  try {
    return await userAPI.deleteUser(input);
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
    throw new GraphQLError("Failed to delete user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
