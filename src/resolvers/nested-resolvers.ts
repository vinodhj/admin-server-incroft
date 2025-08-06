import { APIs } from "@src/services";
import { CategoryType, Department, Designation } from "generated";

export const UserNestedResolvers = {
  profile: async ({ id }: { id: string }, _: unknown, { apis: { userAPI } }: { apis: APIs }) => {
    try {
      console.log("Fetching user profile for ID:", id);
      return await userAPI.userProfileById(id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  },
};

export const ProfileNestedResolvers = {
  department: async ({ department_id }: { department_id: string }, _: unknown, { apis: { categoryAPI } }: { apis: APIs }) => {
    try {
      const category_type = CategoryType.Department;
      const result = await categoryAPI.category(category_type, { id: department_id });
      return {
        ...result[0],
      } as Department;
    } catch (error) {
      console.error("Error fetching user department:", error);
      throw new Error("Failed to fetch user department");
    }
  },
  designation: async ({ designation_id }: { designation_id: string }, _: unknown, { apis: { categoryAPI } }: { apis: APIs }) => {
    try {
      const category_type = CategoryType.Designation;
      const result = await categoryAPI.category(category_type, { id: designation_id });
      return {
        ...result[0],
      } as Designation;
    } catch (error) {
      console.error("Error fetching user designation:", error);
      throw new Error("Failed to fetch user designation");
    }
  },
};
