import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  JSON: { input: any; output: any };
};

export type AdminKvAsset = {
  __typename?: "AdminKvAsset";
  kv_key: Scalars["String"]["output"];
  kv_value?: Maybe<Scalars["JSON"]["output"]>;
};

export type AdminKvAssetInput = {
  kv_key: Scalars["String"]["input"];
};

export type Category = {
  __typename?: "Category";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type CategoryFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type CategoryResponse = {
  __typename?: "CategoryResponse";
  category?: Maybe<CategorySuccessResponse>;
  success: Scalars["Boolean"]["output"];
};

export type CategorySuccessResponse = {
  __typename?: "CategorySuccessResponse";
  category_type: CategoryType;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export enum CategoryType {
  Department = "DEPARTMENT",
  Designation = "DESIGNATION",
}

export type ChangePasswordInput = {
  confirm_password: Scalars["String"]["input"];
  current_password: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  new_password: Scalars["String"]["input"];
};

export enum ColumnName {
  Address = "address",
  City = "city",
  Country = "country",
  Email = "email",
  EmpCode = "emp_code",
  Id = "id",
  IsDisabled = "is_disabled",
  IsVerified = "is_verified",
  Name = "name",
  Phone = "phone",
  Role = "role",
  State = "state",
  Zipcode = "zipcode",
}

export type CreateCategoryInput = {
  category_type: CategoryType;
  name: Scalars["String"]["input"];
};

export type DeleteCategoryInput = {
  category_type: CategoryType;
  id: Scalars["ID"]["input"];
};

export type DeleteUserInput = {
  id: Scalars["ID"]["input"];
};

export type Department = {
  __typename?: "Department";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type Designation = {
  __typename?: "Designation";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type EditUserInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  date_of_joining?: InputMaybe<Scalars["DateTime"]["input"]>;
  date_of_leaving?: InputMaybe<Scalars["DateTime"]["input"]>;
  department_id?: InputMaybe<Scalars["String"]["input"]>;
  designation_id?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  emp_code?: InputMaybe<Scalars["String"]["input"]>;
  force_password_change?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["ID"]["input"];
  is_disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_verified?: InputMaybe<Scalars["Boolean"]["input"]>;
  name: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  role?: InputMaybe<Role>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  zipcode?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditUserResponse = {
  __typename?: "EditUserResponse";
  success: Scalars["Boolean"]["output"];
  user?: Maybe<UserSuccessResponse>;
};

export type GenericCategoryResponse = {
  __typename?: "GenericCategoryResponse";
  category_type: CategoryType;
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  success: Scalars["Boolean"]["output"];
  token?: Maybe<Scalars["String"]["output"]>;
  user?: Maybe<UserSuccessResponse>;
};

export type LogoutResponse = {
  __typename?: "LogoutResponse";
  success: Scalars["Boolean"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  changePassword: Scalars["Boolean"]["output"];
  createCategory: CategoryResponse;
  deleteCategory: Scalars["Boolean"]["output"];
  deleteUser: Scalars["Boolean"]["output"];
  editUser: EditUserResponse;
  login: LoginResponse;
  logout: LogoutResponse;
  signUp: SignUpResponse;
  updateCategory: CategoryResponse;
};

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};

export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};

export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};

export type MutationEditUserArgs = {
  input: EditUserInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type PaginatedUsersInputs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  include_disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Sort>;
  sort_by?: InputMaybe<Sort_By>;
};

export type Query = {
  __typename?: "Query";
  adminKvAsset?: Maybe<AdminKvAsset>;
  departments?: Maybe<Array<Maybe<Category>>>;
  designations?: Maybe<Array<Maybe<Category>>>;
  paginatedUsers?: Maybe<UsersConnection>;
  userByEmail?: Maybe<UserResponse>;
  userByfield?: Maybe<Array<Maybe<UserResponse>>>;
  users?: Maybe<Array<Maybe<UserResponse>>>;
};

export type QueryAdminKvAssetArgs = {
  input: AdminKvAssetInput;
};

export type QueryDepartmentsArgs = {
  input?: InputMaybe<CategoryFilter>;
};

export type QueryDesignationsArgs = {
  input?: InputMaybe<CategoryFilter>;
};

export type QueryPaginatedUsersArgs = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  input?: InputMaybe<PaginatedUsersInputs>;
};

export type QueryUserByEmailArgs = {
  input: UserByEmailInput;
};

export type QueryUserByfieldArgs = {
  input: UserByFieldInput;
};

export enum Role {
  Admin = "ADMIN",
  Manager = "MANAGER",
  Viewer = "VIEWER",
}

export enum Sort_By {
  CreatedAt = "CREATED_AT",
  DateOfJoining = "DATE_OF_JOINING",
  LastLoginAt = "LAST_LOGIN_AT",
  UpdatedAt = "UPDATED_AT",
}

export type SignUpInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  date_of_joining?: InputMaybe<Scalars["DateTime"]["input"]>;
  department_id: Scalars["String"]["input"];
  designation_id: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  role: Role;
  state?: InputMaybe<Scalars["String"]["input"]>;
  zipcode?: InputMaybe<Scalars["String"]["input"]>;
};

export type SignUpResponse = {
  __typename?: "SignUpResponse";
  success: Scalars["Boolean"]["output"];
  user?: Maybe<UserSuccessResponse>;
};

export enum Sort {
  Asc = "ASC",
  Desc = "DESC",
}

export type UpdateCategoryInput = {
  category_type: CategoryType;
  id: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  emp_code: Scalars["String"]["output"];
  force_password_change: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_login_at?: Maybe<Scalars["DateTime"]["output"]>;
  name: Scalars["String"]["output"];
  password: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  profile?: Maybe<UserProfile>;
  role: Role;
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type UserByEmailInput = {
  email: Scalars["String"]["input"];
};

export type UserByFieldInput = {
  field: ColumnName;
  value: Scalars["String"]["input"];
};

export type UserEdge = {
  __typename?: "UserEdge";
  cursor: Scalars["String"]["output"];
  node: UserResponse;
};

export type UserProfile = {
  __typename?: "UserProfile";
  address?: Maybe<Scalars["String"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  date_of_joining?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_leaving?: Maybe<Scalars["DateTime"]["output"]>;
  department: Department;
  department_id: Scalars["String"]["output"];
  designation: Designation;
  designation_id: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  state?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
  user_id: Scalars["String"]["output"];
  zipcode?: Maybe<Scalars["String"]["output"]>;
};

export type UserProfileResponse = {
  __typename?: "UserProfileResponse";
  address?: Maybe<Scalars["String"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  date_of_joining?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_leaving?: Maybe<Scalars["DateTime"]["output"]>;
  department: Department;
  designation: Designation;
  state?: Maybe<Scalars["String"]["output"]>;
  zipcode?: Maybe<Scalars["String"]["output"]>;
};

export type UserResponse = {
  __typename?: "UserResponse";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  emp_code: Scalars["String"]["output"];
  force_password_change: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_login_at?: Maybe<Scalars["DateTime"]["output"]>;
  name: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  profile?: Maybe<UserProfile>;
  role: Role;
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
};

export type UserSuccessResponse = {
  __typename?: "UserSuccessResponse";
  email: Scalars["String"]["output"];
  emp_code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  profile?: Maybe<UserProfileResponse>;
  role: Role;
};

export type UsersConnection = {
  __typename?: "UsersConnection";
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AdminKvAsset: ResolverTypeWrapper<AdminKvAsset>;
  AdminKvAssetInput: AdminKvAssetInput;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Category: ResolverTypeWrapper<Category>;
  CategoryFilter: CategoryFilter;
  CategoryResponse: ResolverTypeWrapper<CategoryResponse>;
  CategorySuccessResponse: ResolverTypeWrapper<CategorySuccessResponse>;
  CategoryType: CategoryType;
  ChangePasswordInput: ChangePasswordInput;
  ColumnName: ColumnName;
  CreateCategoryInput: CreateCategoryInput;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  DeleteCategoryInput: DeleteCategoryInput;
  DeleteUserInput: DeleteUserInput;
  Department: ResolverTypeWrapper<Department>;
  Designation: ResolverTypeWrapper<Designation>;
  EditUserInput: EditUserInput;
  EditUserResponse: ResolverTypeWrapper<EditUserResponse>;
  GenericCategoryResponse: ResolverTypeWrapper<GenericCategoryResponse>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  LoginInput: LoginInput;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  LogoutResponse: ResolverTypeWrapper<LogoutResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginatedUsersInputs: PaginatedUsersInputs;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  SORT_BY: Sort_By;
  SignUpInput: SignUpInput;
  SignUpResponse: ResolverTypeWrapper<SignUpResponse>;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  UpdateCategoryInput: UpdateCategoryInput;
  User: ResolverTypeWrapper<User>;
  UserByEmailInput: UserByEmailInput;
  UserByFieldInput: UserByFieldInput;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  UserProfileResponse: ResolverTypeWrapper<UserProfileResponse>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  UserSuccessResponse: ResolverTypeWrapper<UserSuccessResponse>;
  UsersConnection: ResolverTypeWrapper<UsersConnection>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdminKvAsset: AdminKvAsset;
  AdminKvAssetInput: AdminKvAssetInput;
  Boolean: Scalars["Boolean"]["output"];
  Category: Category;
  CategoryFilter: CategoryFilter;
  CategoryResponse: CategoryResponse;
  CategorySuccessResponse: CategorySuccessResponse;
  ChangePasswordInput: ChangePasswordInput;
  CreateCategoryInput: CreateCategoryInput;
  DateTime: Scalars["DateTime"]["output"];
  DeleteCategoryInput: DeleteCategoryInput;
  DeleteUserInput: DeleteUserInput;
  Department: Department;
  Designation: Designation;
  EditUserInput: EditUserInput;
  EditUserResponse: EditUserResponse;
  GenericCategoryResponse: GenericCategoryResponse;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  JSON: Scalars["JSON"]["output"];
  LoginInput: LoginInput;
  LoginResponse: LoginResponse;
  LogoutResponse: LogoutResponse;
  Mutation: {};
  PageInfo: PageInfo;
  PaginatedUsersInputs: PaginatedUsersInputs;
  Query: {};
  SignUpInput: SignUpInput;
  SignUpResponse: SignUpResponse;
  String: Scalars["String"]["output"];
  UpdateCategoryInput: UpdateCategoryInput;
  User: User;
  UserByEmailInput: UserByEmailInput;
  UserByFieldInput: UserByFieldInput;
  UserEdge: UserEdge;
  UserProfile: UserProfile;
  UserProfileResponse: UserProfileResponse;
  UserResponse: UserResponse;
  UserSuccessResponse: UserSuccessResponse;
  UsersConnection: UsersConnection;
};

export type AdminKvAssetResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AdminKvAsset"] = ResolversParentTypes["AdminKvAsset"],
> = {
  kv_key?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  kv_value?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes["Category"] = ResolversParentTypes["Category"]> = {
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CategoryResponse"] = ResolversParentTypes["CategoryResponse"],
> = {
  category?: Resolver<Maybe<ResolversTypes["CategorySuccessResponse"]>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategorySuccessResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CategorySuccessResponse"] = ResolversParentTypes["CategorySuccessResponse"],
> = {
  category_type?: Resolver<ResolversTypes["CategoryType"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type DepartmentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Department"] = ResolversParentTypes["Department"],
> = {
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DesignationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Designation"] = ResolversParentTypes["Designation"],
> = {
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditUserResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["EditUserResponse"] = ResolversParentTypes["EditUserResponse"],
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["UserSuccessResponse"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenericCategoryResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GenericCategoryResponse"] = ResolversParentTypes["GenericCategoryResponse"],
> = {
  category_type?: Resolver<ResolversTypes["CategoryType"], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"],
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["UserSuccessResponse"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogoutResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["LogoutResponse"] = ResolversParentTypes["LogoutResponse"],
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]> = {
  changePassword?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, "input">>;
  createCategory?: Resolver<
    ResolversTypes["CategoryResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCategoryArgs, "input">
  >;
  deleteCategory?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, "input">>;
  deleteUser?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, "input">>;
  editUser?: Resolver<ResolversTypes["EditUserResponse"], ParentType, ContextType, RequireFields<MutationEditUserArgs, "input">>;
  login?: Resolver<ResolversTypes["LoginResponse"], ParentType, ContextType, RequireFields<MutationLoginArgs, "input">>;
  logout?: Resolver<ResolversTypes["LogoutResponse"], ParentType, ContextType>;
  signUp?: Resolver<ResolversTypes["SignUpResponse"], ParentType, ContextType, RequireFields<MutationSignUpArgs, "input">>;
  updateCategory?: Resolver<
    ResolversTypes["CategoryResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCategoryArgs, "input">
  >;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes["PageInfo"] = ResolversParentTypes["PageInfo"]> = {
  endCursor?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]> = {
  adminKvAsset?: Resolver<Maybe<ResolversTypes["AdminKvAsset"]>, ParentType, ContextType, RequireFields<QueryAdminKvAssetArgs, "input">>;
  departments?: Resolver<Maybe<Array<Maybe<ResolversTypes["Category"]>>>, ParentType, ContextType, Partial<QueryDepartmentsArgs>>;
  designations?: Resolver<Maybe<Array<Maybe<ResolversTypes["Category"]>>>, ParentType, ContextType, Partial<QueryDesignationsArgs>>;
  paginatedUsers?: Resolver<Maybe<ResolversTypes["UsersConnection"]>, ParentType, ContextType, Partial<QueryPaginatedUsersArgs>>;
  userByEmail?: Resolver<Maybe<ResolversTypes["UserResponse"]>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, "input">>;
  userByfield?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["UserResponse"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryUserByfieldArgs, "input">
  >;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes["UserResponse"]>>>, ParentType, ContextType>;
};

export type SignUpResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["SignUpResponse"] = ResolversParentTypes["SignUpResponse"],
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["UserSuccessResponse"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]> = {
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  emp_code?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  force_password_change?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  last_login_at?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  password?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes["UserProfile"]>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes["Role"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes["UserEdge"] = ResolversParentTypes["UserEdge"]> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<ResolversTypes["UserResponse"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UserProfile"] = ResolversParentTypes["UserProfile"],
> = {
  address?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  date_of_joining?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_leaving?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  department?: Resolver<ResolversTypes["Department"], ParentType, ContextType>;
  department_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  designation?: Resolver<ResolversTypes["Designation"], ParentType, ContextType>;
  designation_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UserProfileResponse"] = ResolversParentTypes["UserProfileResponse"],
> = {
  address?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  date_of_joining?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_leaving?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  department?: Resolver<ResolversTypes["Department"], ParentType, ContextType>;
  designation?: Resolver<ResolversTypes["Designation"], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UserResponse"] = ResolversParentTypes["UserResponse"],
> = {
  created_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  created_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  emp_code?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  force_password_change?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  last_login_at?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes["UserProfile"]>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes["Role"], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSuccessResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UserSuccessResponse"] = ResolversParentTypes["UserSuccessResponse"],
> = {
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  emp_code?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes["UserProfileResponse"]>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes["Role"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["UsersConnection"] = ResolversParentTypes["UsersConnection"],
> = {
  edges?: Resolver<Array<ResolversTypes["UserEdge"]>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AdminKvAsset?: AdminKvAssetResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategoryResponse?: CategoryResponseResolvers<ContextType>;
  CategorySuccessResponse?: CategorySuccessResponseResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Department?: DepartmentResolvers<ContextType>;
  Designation?: DesignationResolvers<ContextType>;
  EditUserResponse?: EditUserResponseResolvers<ContextType>;
  GenericCategoryResponse?: GenericCategoryResponseResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  LogoutResponse?: LogoutResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUpResponse?: SignUpResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  UserProfileResponse?: UserProfileResponseResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  UserSuccessResponse?: UserSuccessResponseResolvers<ContextType>;
  UsersConnection?: UsersConnectionResolvers<ContextType>;
};
