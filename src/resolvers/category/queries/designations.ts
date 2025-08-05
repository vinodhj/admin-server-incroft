import { APIs } from "@src/services";
import { Category, CategoryType, QueryDesignationsArgs } from "generated";
import { GraphQLError } from "graphql";

export const designations = async (
  _: unknown,
  { input = {} }: Partial<QueryDesignationsArgs>,
  { apis: { categoryAPI } }: { apis: APIs },
): Promise<Array<Category>> => {
  try {
    const category_type = CategoryType.Designation;
    const filteredInput = input ?? {};
    return await categoryAPI.category(category_type, filteredInput);
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    }
    console.error("Unexpected error:", error);
    throw new GraphQLError("Failed to get Designations", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
