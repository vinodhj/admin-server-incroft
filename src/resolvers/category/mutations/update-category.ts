import { GraphQLError } from "graphql";
import { APIs } from "@src/services";
import { CategoryResponse, UpdateCategoryInput } from "generated";
import { AuthorizationError } from "@src/auth/authorization-service";

export const updateCategory = async (
  _: unknown,
  { input }: { input: UpdateCategoryInput },
  { apis: { categoryAPI } }: { apis: APIs },
): Promise<CategoryResponse> => {
  try {
    return await categoryAPI.updateCategory(input);
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    } else if (error instanceof AuthorizationError) {
      throw new GraphQLError(`Unauthorized: ${error.message}`, {
        extensions: {
          code: "UNAUTHORIZED",
          error,
        },
      });
    }
    console.error("Unexpected error:", error);
    throw new GraphQLError("Failed to update category", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
