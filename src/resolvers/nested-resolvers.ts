import { APIs } from "@src/services";
import { Department, Designation } from "generated";

export const UserNestedResolvers = {
  profile: async ({ id }: { id: string }, _: unknown, { apis: { userAPI } }: { apis: APIs }) => {
    try {
      if (!id) return null;
      // Use DataLoader through UserAPI
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
      if (!department_id) return null;

      // Use DataLoader through CategoryAPI
      return (await categoryAPI.getDepartmentById(department_id)) as Department;
    } catch (error) {
      console.error("Error fetching user department:", error);
      throw new Error("Failed to fetch user department");
    }
  },
  designation: async ({ designation_id }: { designation_id: string }, _: unknown, { apis: { categoryAPI } }: { apis: APIs }) => {
    try {
      if (!designation_id) return null;

      // Use DataLoader through CategoryAPI
      return (await categoryAPI.getDesignationById(designation_id)) as Designation;
    } catch (error) {
      console.error("Error fetching user designation:", error);
      throw new Error("Failed to fetch user designation");
    }
  },
};
