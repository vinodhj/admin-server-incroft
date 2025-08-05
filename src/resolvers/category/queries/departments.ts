import { APIs } from "@src/services";
import { Category, CategoryType, QueryDepartmentsArgs } from "generated";
import { GraphQLError } from "graphql";

export const departments = async (
  _: unknown,
  { input = {} }: Partial<QueryDepartmentsArgs>,
  { apis: { categoryAPI } }: { apis: APIs },
): Promise<Array<Category>> => {
  try {
    const category_type = CategoryType.Department;
    const filteredInput = input ?? {};
    return await categoryAPI.category(category_type, filteredInput);
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    }
    console.error("Unexpected error:", error);
    throw new GraphQLError("Failed to get Departments", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
