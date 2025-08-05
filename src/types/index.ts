import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  # ADMIN, MANAGER, VIEWER
  enum Role {
    ADMIN
    MANAGER
    VIEWER
  }

  enum Sort {
    ASC
    DESC
  }

  enum SORT_BY {
    CREATED_AT
    UPDATED_AT
    LAST_LOGIN_AT
    DATE_OF_JOINING
  }

  type Department {
    id: ID!
    name: String!
    description: String
    is_disabled: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  type Designation {
    id: ID!
    name: String!
    description: String
    is_disabled: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  type UserProfile {
    id: ID!
    user_id: String!
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    designation_id: String!
    department_id: String!
    designation: Designation!
    department: Department!
    date_of_joining: DateTime
    date_of_leaving: DateTime
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  type User {
    id: ID! #nano_id
    emp_code: String! # auto-generated unique employee code
    name: String!
    email: String!
    password: String! # hashed
    role: Role!
    phone: String!
    last_login_at: DateTime
    force_password_change: Boolean!
    is_verified: Boolean!
    is_disabled: Boolean!
    profile: UserProfile
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    role: Role!
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    designation_id: String!
    department_id: String!
    date_of_joining: DateTime
  }

  type SignUpResponse {
    success: Boolean!
    user: UserSuccessResponse
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    success: Boolean!
    token: String
    user: UserSuccessResponse
  }

  type UserSuccessResponse {
    id: ID!
    emp_code: String!
    name: String!
    email: String!
    phone: String!
    role: Role!
    is_verified: Boolean!
    is_disabled: Boolean!
    profile: UserProfileResponse
  }

  type UserProfileResponse {
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    designation: Designation!
    department: Department!
    date_of_joining: DateTime
    date_of_leaving: DateTime
  }

  type UserResponse {
    id: ID!
    emp_code: String!
    name: String!
    email: String!
    role: Role!
    phone: String!
    last_login_at: DateTime
    force_password_change: Boolean!
    is_verified: Boolean!
    is_disabled: Boolean!
    profile: UserProfile
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  input UserByEmailInput {
    email: String!
  }

  input UserByFieldInput {
    field: ColumnName!
    value: String!
  }

  input DeleteUserInput {
    id: ID!
  }

  input EditUserInput {
    id: ID!
    emp_code: String
    name: String!
    email: String!
    phone: String!
    role: Role
    is_verified: Boolean
    is_disabled: Boolean
    force_password_change: Boolean
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    designation_id: String
    department_id: String
    date_of_joining: DateTime
    date_of_leaving: DateTime
  }

  type EditUserResponse {
    success: Boolean!
    user: UserSuccessResponse
  }

  input ChangePasswordInput {
    id: ID!
    current_password: String!
    new_password: String!
    confirm_password: String!
  }

  input CreateDepartmentInput {
    name: String!
    description: String
  }

  input EditDepartmentInput {
    id: ID!
    name: String!
    description: String
    is_disabled: Boolean
  }

  input DeleteDepartmentInput {
    id: ID!
  }

  input CreateDesignationInput {
    name: String!
    description: String
  }

  input EditDesignationInput {
    id: ID!
    name: String!
    description: String
    is_disabled: Boolean
  }

  input DeleteDesignationInput {
    id: ID!
  }

  enum ColumnName {
    id
    emp_code
    name
    email
    phone
    role
    is_verified
    is_disabled
    address
    city
    state
    country
    zipcode
  }

  type LogoutResponse {
    success: Boolean!
  }

  type AdminKvAsset {
    kv_key: String!
    kv_value: JSON
  }

  input AdminKvAssetInput {
    kv_key: String!
  }

  input PaginatedUsersInputs {
    first: Int = 10
    after: String
    sort: Sort = DESC
    sort_by: SORT_BY = CREATED_AT
    include_disabled: Boolean = false
  }

  input PaginatedDepartmentsInputs {
    first: Int = 10
    after: String
    sort: Sort = DESC
    sort_by: SORT_BY = CREATED_AT
    include_disabled: Boolean = false
  }

  input PaginatedDesignationsInputs {
    first: Int = 10
    after: String
    sort: Sort = DESC
    sort_by: SORT_BY = CREATED_AT
    include_disabled: Boolean = false
  }

  type UserEdge {
    node: UserResponse!
    cursor: String!
  }

  type DepartmentEdge {
    node: Department!
    cursor: String!
  }

  type DesignationEdge {
    node: Designation!
    cursor: String!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    totalCount: Int!
  }

  type UsersConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }

  type DepartmentsConnection {
    edges: [DepartmentEdge!]!
    pageInfo: PageInfo!
  }

  type DesignationsConnection {
    edges: [DesignationEdge!]!
    pageInfo: PageInfo!
  }

  type Query {
    userByEmail(input: UserByEmailInput!): UserResponse
    userByfield(input: UserByFieldInput!): [UserResponse]

    users: [UserResponse]
    paginatedUsers(ids: [ID!], input: PaginatedUsersInputs): UsersConnection

    departments: [Department]
    paginatedDepartments(ids: [ID!], input: PaginatedDepartmentsInputs): DepartmentsConnection

    designations: [Designation]
    paginatedDesignations(ids: [ID!], input: PaginatedDesignationsInputs): DesignationsConnection

    adminKvAsset(input: AdminKvAssetInput!): AdminKvAsset
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpResponse!
    login(input: LoginInput!): LoginResponse!
    editUser(input: EditUserInput!): EditUserResponse!
    deleteUser(input: DeleteUserInput!): Boolean!
    changePassword(input: ChangePasswordInput!): Boolean!
    logout: LogoutResponse!

    createDepartment(input: CreateDepartmentInput!): Department!
    editDepartment(input: EditDepartmentInput!): Department!
    deleteDepartment(input: DeleteDepartmentInput!): Boolean!

    createDesignation(input: CreateDesignationInput!): Designation!
    editDesignation(input: EditDesignationInput!): Designation!
    deleteDesignation(input: DeleteDesignationInput!): Boolean!
  }
`;
