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
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
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
  description?: Maybe<Scalars["String"]["output"]>;
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
  Email = "email",
  EmpCode = "emp_code",
  FirstName = "first_name",
  Id = "id",
  IsDisabled = "is_disabled",
  IsVerified = "is_verified",
  LastName = "last_name",
  Phone = "phone",
  Role = "role",
}

export type CreateCategoryInput = {
  category_type: CategoryType;
  description?: InputMaybe<Scalars["String"]["input"]>;
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

export type DisableUserInput = {
  ids: Array<Scalars["ID"]["input"]>;
  is_disabled: Scalars["Boolean"]["input"];
};

export type EditUserInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["DateTime"]["input"]>;
  date_of_joining?: InputMaybe<Scalars["DateTime"]["input"]>;
  date_of_leaving?: InputMaybe<Scalars["DateTime"]["input"]>;
  department_id?: InputMaybe<Scalars["String"]["input"]>;
  designation_id?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  emergency_contact_details?: InputMaybe<EmergencyContactDetailsInput>;
  emp_code?: InputMaybe<Scalars["String"]["input"]>;
  employee_photo_url?: InputMaybe<Scalars["String"]["input"]>;
  employment_type?: InputMaybe<EmploymentType>;
  first_name: Scalars["String"]["input"];
  force_password_change?: InputMaybe<Scalars["Boolean"]["input"]>;
  gender?: InputMaybe<Gender>;
  hr_and_compliance?: InputMaybe<HrAndComplianceInput>;
  id: Scalars["ID"]["input"];
  is_disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_verified?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_name: Scalars["String"]["input"];
  marital_status?: InputMaybe<MaritalStatus>;
  payroll_details?: InputMaybe<PayrollDetailsInput>;
  personal_email?: InputMaybe<Scalars["String"]["input"]>;
  phone: Scalars["String"]["input"];
  role: Role;
  state?: InputMaybe<Scalars["String"]["input"]>;
  work_location?: InputMaybe<WorkLocation>;
  zipcode?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditUserResponse = {
  __typename?: "EditUserResponse";
  success: Scalars["Boolean"]["output"];
  user?: Maybe<UserResponse>;
};

export type EmergencyContactDetails = {
  __typename?: "EmergencyContactDetails";
  email?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  relationship?: Maybe<Scalars["String"]["output"]>;
};

export type EmergencyContactDetailsInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  relationship?: InputMaybe<Scalars["String"]["input"]>;
};

export enum EmploymentType {
  Contract = "CONTRACT",
  FullTime = "FULL_TIME",
  Intern = "INTERN",
  PartTime = "PART_TIME",
}

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
  Other = "OTHER",
  PreferNotToSay = "PREFER_NOT_TO_SAY",
}

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

export type HrAndCompliance = {
  __typename?: "HRAndCompliance";
  aadhar_number?: Maybe<Scalars["String"]["output"]>;
  pan_number?: Maybe<Scalars["String"]["output"]>;
  passport_number?: Maybe<Scalars["String"]["output"]>;
  visa_status?: Maybe<Scalars["String"]["output"]>;
};

export type HrAndComplianceInput = {
  aadhar_number?: InputMaybe<Scalars["String"]["input"]>;
  pan_number?: InputMaybe<Scalars["String"]["input"]>;
  passport_number?: InputMaybe<Scalars["String"]["input"]>;
  visa_status?: InputMaybe<Scalars["String"]["input"]>;
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  success: Scalars["Boolean"]["output"];
  token?: Maybe<Scalars["String"]["output"]>;
  user?: Maybe<UserResponse>;
};

export type LogoutResponse = {
  __typename?: "LogoutResponse";
  success: Scalars["Boolean"]["output"];
};

export enum MaritalStatus {
  Divorced = "DIVORCED",
  Married = "MARRIED",
  Single = "SINGLE",
  Widowed = "WIDOWED",
}

export type Mutation = {
  __typename?: "Mutation";
  changePassword: Scalars["Boolean"]["output"];
  createCategory: CategoryResponse;
  deleteCategory: Scalars["Boolean"]["output"];
  deleteUser: Scalars["Boolean"]["output"];
  disableUser: Scalars["Boolean"]["output"];
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

export type MutationDisableUserArgs = {
  input: DisableUserInput;
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
  email?: InputMaybe<Scalars["String"]["input"]>;
  emp_code?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  include_disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
  sort?: InputMaybe<Sort>;
  sort_by?: InputMaybe<Sort_By>;
};

export type PayrollDetails = {
  __typename?: "PayrollDetails";
  bank_account_number?: Maybe<Scalars["String"]["output"]>;
  bank_name?: Maybe<Scalars["String"]["output"]>;
  ifsc_code?: Maybe<Scalars["String"]["output"]>;
  pf_number?: Maybe<Scalars["String"]["output"]>;
};

export type PayrollDetailsInput = {
  bank_account_number?: InputMaybe<Scalars["String"]["input"]>;
  bank_name?: InputMaybe<Scalars["String"]["input"]>;
  ifsc_code?: InputMaybe<Scalars["String"]["input"]>;
  pf_number?: InputMaybe<Scalars["String"]["input"]>;
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
  email: Scalars["String"]["input"];
  emp_code?: InputMaybe<Scalars["String"]["input"]>;
  first_name: Scalars["String"]["input"];
  force_password_change: Scalars["Boolean"]["input"];
  is_verified?: InputMaybe<Scalars["Boolean"]["input"]>;
  last_name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  role: Role;
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
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  is_disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  name: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  emp_code: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  force_password_change: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_login_at?: Maybe<Scalars["DateTime"]["output"]>;
  last_name: Scalars["String"]["output"];
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
  date_of_birth?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_joining?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_leaving?: Maybe<Scalars["DateTime"]["output"]>;
  department: Department;
  department_id: Scalars["String"]["output"];
  designation: Designation;
  designation_id: Scalars["String"]["output"];
  emergency_contact_details?: Maybe<EmergencyContactDetails>;
  employee_photo_url?: Maybe<Scalars["String"]["output"]>;
  employment_type: EmploymentType;
  gender?: Maybe<Gender>;
  hr_and_compliance?: Maybe<HrAndCompliance>;
  id: Scalars["ID"]["output"];
  marital_status?: Maybe<MaritalStatus>;
  payroll_details?: Maybe<PayrollDetails>;
  personal_email?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["DateTime"]["output"];
  updated_by: Scalars["String"]["output"];
  user_id: Scalars["String"]["output"];
  work_location: WorkLocation;
  zipcode?: Maybe<Scalars["String"]["output"]>;
};

export type UserProfileResponse = {
  __typename?: "UserProfileResponse";
  address?: Maybe<Scalars["String"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  date_of_birth?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_joining?: Maybe<Scalars["DateTime"]["output"]>;
  date_of_leaving?: Maybe<Scalars["DateTime"]["output"]>;
  department?: Maybe<Department>;
  designation?: Maybe<Designation>;
  emergency_contact_details?: Maybe<EmergencyContactDetails>;
  employee_photo_url?: Maybe<Scalars["String"]["output"]>;
  employment_type?: Maybe<EmploymentType>;
  gender?: Maybe<Gender>;
  hr_and_compliance?: Maybe<HrAndCompliance>;
  marital_status?: Maybe<MaritalStatus>;
  payroll_details?: Maybe<PayrollDetails>;
  personal_email?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  work_location?: Maybe<WorkLocation>;
  zipcode?: Maybe<Scalars["String"]["output"]>;
};

export type UserResponse = {
  __typename?: "UserResponse";
  created_at: Scalars["DateTime"]["output"];
  created_by: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  emp_code: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  force_password_change: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_login_at?: Maybe<Scalars["DateTime"]["output"]>;
  last_name: Scalars["String"]["output"];
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
  first_name: Scalars["String"]["output"];
  force_password_change: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  is_disabled: Scalars["Boolean"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_name: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  role: Role;
};

export type UsersConnection = {
  __typename?: "UsersConnection";
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export enum WorkLocation {
  Hybrid = "HYBRID",
  Office = "OFFICE",
  Remote = "REMOTE",
}

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
  DisableUserInput: DisableUserInput;
  EditUserInput: EditUserInput;
  EditUserResponse: ResolverTypeWrapper<EditUserResponse>;
  EmergencyContactDetails: ResolverTypeWrapper<EmergencyContactDetails>;
  EmergencyContactDetailsInput: EmergencyContactDetailsInput;
  EmploymentType: EmploymentType;
  Gender: Gender;
  GenericCategoryResponse: ResolverTypeWrapper<GenericCategoryResponse>;
  HRAndCompliance: ResolverTypeWrapper<HrAndCompliance>;
  HRAndComplianceInput: HrAndComplianceInput;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  LoginInput: LoginInput;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  LogoutResponse: ResolverTypeWrapper<LogoutResponse>;
  MaritalStatus: MaritalStatus;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginatedUsersInputs: PaginatedUsersInputs;
  PayrollDetails: ResolverTypeWrapper<PayrollDetails>;
  PayrollDetailsInput: PayrollDetailsInput;
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
  WorkLocation: WorkLocation;
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
  DisableUserInput: DisableUserInput;
  EditUserInput: EditUserInput;
  EditUserResponse: EditUserResponse;
  EmergencyContactDetails: EmergencyContactDetails;
  EmergencyContactDetailsInput: EmergencyContactDetailsInput;
  GenericCategoryResponse: GenericCategoryResponse;
  HRAndCompliance: HrAndCompliance;
  HRAndComplianceInput: HrAndComplianceInput;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  JSON: Scalars["JSON"]["output"];
  LoginInput: LoginInput;
  LoginResponse: LoginResponse;
  LogoutResponse: LogoutResponse;
  Mutation: {};
  PageInfo: PageInfo;
  PaginatedUsersInputs: PaginatedUsersInputs;
  PayrollDetails: PayrollDetails;
  PayrollDetailsInput: PayrollDetailsInput;
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
  description?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
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
  description?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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
  user?: Resolver<Maybe<ResolversTypes["UserResponse"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmergencyContactDetailsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["EmergencyContactDetails"] = ResolversParentTypes["EmergencyContactDetails"],
> = {
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  relationship?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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

export type HrAndComplianceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["HRAndCompliance"] = ResolversParentTypes["HRAndCompliance"],
> = {
  aadhar_number?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pan_number?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  passport_number?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  visa_status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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
  user?: Resolver<Maybe<ResolversTypes["UserResponse"]>, ParentType, ContextType>;
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
  disableUser?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationDisableUserArgs, "input">>;
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

export type PayrollDetailsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PayrollDetails"] = ResolversParentTypes["PayrollDetails"],
> = {
  bank_account_number?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  bank_name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ifsc_code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pf_number?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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
  first_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  force_password_change?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  last_login_at?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
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
  date_of_birth?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_joining?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_leaving?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  department?: Resolver<ResolversTypes["Department"], ParentType, ContextType>;
  department_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  designation?: Resolver<ResolversTypes["Designation"], ParentType, ContextType>;
  designation_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  emergency_contact_details?: Resolver<Maybe<ResolversTypes["EmergencyContactDetails"]>, ParentType, ContextType>;
  employee_photo_url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  employment_type?: Resolver<ResolversTypes["EmploymentType"], ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes["Gender"]>, ParentType, ContextType>;
  hr_and_compliance?: Resolver<Maybe<ResolversTypes["HRAndCompliance"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  marital_status?: Resolver<Maybe<ResolversTypes["MaritalStatus"]>, ParentType, ContextType>;
  payroll_details?: Resolver<Maybe<ResolversTypes["PayrollDetails"]>, ParentType, ContextType>;
  personal_email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updated_by?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  work_location?: Resolver<ResolversTypes["WorkLocation"], ParentType, ContextType>;
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
  date_of_birth?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_joining?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  date_of_leaving?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes["Department"]>, ParentType, ContextType>;
  designation?: Resolver<Maybe<ResolversTypes["Designation"]>, ParentType, ContextType>;
  emergency_contact_details?: Resolver<Maybe<ResolversTypes["EmergencyContactDetails"]>, ParentType, ContextType>;
  employee_photo_url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  employment_type?: Resolver<Maybe<ResolversTypes["EmploymentType"]>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes["Gender"]>, ParentType, ContextType>;
  hr_and_compliance?: Resolver<Maybe<ResolversTypes["HRAndCompliance"]>, ParentType, ContextType>;
  marital_status?: Resolver<Maybe<ResolversTypes["MaritalStatus"]>, ParentType, ContextType>;
  payroll_details?: Resolver<Maybe<ResolversTypes["PayrollDetails"]>, ParentType, ContextType>;
  personal_email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  work_location?: Resolver<Maybe<ResolversTypes["WorkLocation"]>, ParentType, ContextType>;
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
  first_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  force_password_change?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  last_login_at?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
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
  first_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  force_password_change?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  is_disabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  is_verified?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
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
  EmergencyContactDetails?: EmergencyContactDetailsResolvers<ContextType>;
  GenericCategoryResponse?: GenericCategoryResponseResolvers<ContextType>;
  HRAndCompliance?: HrAndComplianceResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  LogoutResponse?: LogoutResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PayrollDetails?: PayrollDetailsResolvers<ContextType>;
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
