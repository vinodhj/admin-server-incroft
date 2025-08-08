import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { QueryPaginatedUsersArgs, UsersConnection } from "generated";
import { GraphQLError } from "graphql";

export const paginatedUsers = async (
  _: unknown,
  args: QueryPaginatedUsersArgs,
  { apis: { userAPI } }: { apis: APIs },
): Promise<UsersConnection> => {
  try {
    const { ids, input } = args;
    return await userAPI.paginatedUsers(ids, input);
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
    throw new GraphQLError("Failed to get users", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
