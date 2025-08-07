import {
  Category,
  CategoryFilter,
  CategoryResponse,
  CategoryType,
  CreateCategoryInput,
  DeleteCategoryInput,
  UpdateCategoryInput,
} from "generated";
import { SessionUserType } from ".";
import { CategoryDataSource } from "@src/datasources/category-datasources";
import { categoryCache } from "@src/cache/in-memory-cache";
import DataLoader from "dataloader";

export class CategoryServiceAPI {
  private readonly categoryDataSource: CategoryDataSource;
  private readonly sessionUser: SessionUserType;
  // DataLoaders for departments and designations
  private readonly departmentByIdLoader: DataLoader<string, Category | null>;
  private readonly designationByIdLoader: DataLoader<string, Category | null>;

  constructor({ categoryDataSource, sessionUser }: { categoryDataSource: CategoryDataSource; sessionUser: SessionUserType }) {
    this.categoryDataSource = categoryDataSource;
    this.sessionUser = sessionUser;

    // Department loader
    this.departmentByIdLoader = new DataLoader(
      async (ids: readonly string[]) => {
        try {
          // Batch fetch departments by IDs
          const departments = await this.categoryDataSource.categoryBatchByIds(CategoryType.Department, ids as string[]);

          const departmentMap = new Map(departments.map((d) => [d.id, d]));
          return ids.map((id) => departmentMap.get(id) || null);
        } catch (error) {
          console.error("Error batch loading departments:", error);
          return ids.map(() => null);
        }
      },
      { maxBatchSize: 50 },
    );

    // Designation loader
    this.designationByIdLoader = new DataLoader(
      async (ids: readonly string[]) => {
        try {
          const designations = await this.categoryDataSource.categoryBatchByIds(CategoryType.Designation, ids as string[]);

          const designationMap = new Map(designations.map((d) => [d.id, d]));
          return ids.map((id) => designationMap.get(id) || null);
        } catch (error) {
          console.error("Error batch loading designations:", error);
          return ids.map(() => null);
        }
      },
      { maxBatchSize: 50 },
    );
  }

  // Expose loaders for nested resolvers
  getDepartmentByIdLoader() {
    return this.departmentByIdLoader;
  }

  getDesignationByIdLoader() {
    return this.designationByIdLoader;
  }

  // Create a more robust cache key generation method
  private generateCacheKey(category_type: CategoryType, input?: CategoryFilter): string {
    // Ensure meaningful cache keys by omitting empty strings
    const searchPart = input?.search ? `:${input.search}` : "";
    const idPart = input?.id ? `:${input.id}` : "";
    return `category:${category_type}${searchPart}${idPart}`;
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryResponse> {
    // Clear cache for this category type when creating a new category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, name, description } = input;
    return await this.categoryDataSource.createCategory({ category_type, name, description });
  }

  async updateCategory(input: UpdateCategoryInput): Promise<CategoryResponse> {
    // Clear cache for this category type when updating a category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, id, name, description } = input;
    return await this.categoryDataSource.updateCategory({ category_type, name, id, description });
  }

  async deleteCategory(input: DeleteCategoryInput): Promise<boolean> {
    // Clear cache for this category type when deleting a category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, id } = input;
    return await this.categoryDataSource.deleteCategory(category_type, id);
  }

  async category(category_type: CategoryType, input?: CategoryFilter): Promise<Array<Category>> {
    const search = input?.search ?? "";
    const id = input?.id ?? "";

    // Generate a more robust cache key
    const cacheKey = this.generateCacheKey(category_type, input);

    // Try to get from cache first
    const cachedResult = categoryCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.categoryDataSource.category({ category_type, search, id });

    // Store result in cache
    categoryCache.set(cacheKey, result);

    return result;
  }
}
