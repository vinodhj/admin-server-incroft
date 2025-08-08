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
import { BaseService } from "./base-service";

export class CategoryServiceAP extends BaseService {
  private readonly categoryDataSource: CategoryDataSource;

  constructor({ categoryDataSource, sessionUser }: { categoryDataSource: CategoryDataSource; sessionUser: SessionUserType }) {
    super(sessionUser);
    this.categoryDataSource = categoryDataSource;
  }

  // Delegate DataLoader access to datasource
  getDepartmentByIdLoader() {
    return this.categoryDataSource.getDepartmentByIdLoader();
  }

  getDesignationByIdLoader() {
    return this.categoryDataSource.getDesignationByIdLoader();
  }

  // Create a more robust cache key generation method
  private generateCacheKey(category_type: CategoryType, input?: CategoryFilter): string {
    // Ensure meaningful cache keys by omitting empty strings
    const searchPart = input?.search ? `:${input.search}` : "";
    const idPart = input?.id ? `:${input.id}` : "";
    return `category:${category_type}${searchPart}${idPart}`;
  }
  async createCategory(input: CreateCategoryInput): Promise<CategoryResponse> {
    // 🔐 Authorization check
    this.requirePermission("category", "create");

    // Clear cache for this category type when creating a new category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, name, description } = input;
    return await this.categoryDataSource.createCategory({ category_type, name, description });
  }

  async updateCategory(input: UpdateCategoryInput): Promise<CategoryResponse> {
    // 🔐 Authorization check
    this.requirePermission("category", "update");

    // Clear cache for this category type when updating a category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, id, name, description } = input;
    return await this.categoryDataSource.updateCategory({ category_type, name, id, description });
  }

  async deleteCategory(input: DeleteCategoryInput): Promise<boolean> {
    // 🔐 Authorization check
    this.requirePermission("category", "delete");

    // Clear cache for this category type when deleting a category
    categoryCache.invalidateByPattern(`category:${input.category_type}`);

    const { category_type, id } = input;
    return await this.categoryDataSource.deleteCategory(category_type, id);
  }

  async category(category_type: CategoryType, input?: CategoryFilter): Promise<Array<Category>> {
    // 🔐 Authorization check
    this.requirePermission("category", "read");

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

  // Business logic methods that use DataLoader internally
  async getDepartmentById(id: string): Promise<Category | null> {
    // 🔐 Authorization check
    this.requirePermission("category", "read");

    return this.categoryDataSource.getDepartmentById(id);
  }

  async getDesignationById(id: string): Promise<Category | null> {
    // 🔐 Authorization check
    this.requirePermission("category", "read");

    return this.categoryDataSource.getDesignationById(id);
  }
}
