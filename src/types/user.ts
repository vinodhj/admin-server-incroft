import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  enum Role {
    ADMIN
    MANAGER
    VIEWER
  }

  enum EmploymentType {
    FULL_TIME
    PART_TIME
    CONTRACT
    INTERN
  }

  enum WorkLocation {
    OFFICE
    REMOTE
    HYBRID
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
    PREFER_NOT_TO_SAY
  }

  enum MaritalStatus {
    SINGLE
    MARRIED
    DIVORCED
    WIDOWED
  }

  enum ColumnName {
    id
    emp_code
    first_name
    last_name
    email
    phone
    role
    is_verified
    is_disabled
  }

  type EmergencyContactDetails {
    name: String
    phone: String
    email: String
    relationship: String
  }

  type HRAndCompliance {
    pan_number: String
    aadhar_number: String
    passport_number: String
    visa_status: String
  }

  type PayrollDetails {
    bank_account_number: String
    bank_name: String
    ifsc_code: String
    pf_number: String
  }

  type UserProfile {
    id: ID!
    user_id: String!
    # Address Information
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    # Personal Information
    employee_photo_url: String
    personal_email: String
    date_of_birth: DateTime
    gender: Gender
    marital_status: MaritalStatus
    # Employment Information
    designation_id: String!
    department_id: String!
    designation: Designation
    department: Department
    employment_type: EmploymentType!
    work_location: WorkLocation!
    date_of_joining: DateTime
    date_of_leaving: DateTime
    # JSON Fields
    emergency_contact_details: EmergencyContactDetails
    hr_and_compliance: HRAndCompliance
    payroll_details: PayrollDetails
    # Audit Fields
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
  }

  type User {
    id: ID!
    emp_code: String!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
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

  # Input types
  input SignUpInput {
    first_name: String!
    last_name: String!
    email: String!
    emp_code: String
    password: String!
    phone: String!
    role: Role!
    is_verified: Boolean
    force_password_change: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EditUserInput {
    id: ID!
    # User fields
    emp_code: String
    first_name: String!
    last_name: String!
    email: String!
    phone: String!
    role: Role!
    is_verified: Boolean
    is_disabled: Boolean
    force_password_change: Boolean
    # Profile fields - Address Information
    address: String
    city: String
    state: String
    country: String
    zipcode: String
    # Profile fields - Personal Information
    employee_photo_url: String
    personal_email: String
    date_of_birth: DateTime
    gender: Gender
    marital_status: MaritalStatus
    # Profile fields - Employment Information
    designation_id: String
    department_id: String
    employment_type: EmploymentType
    work_location: WorkLocation
    date_of_joining: DateTime
    date_of_leaving: DateTime
    # Profile fields - JSON Fields
    emergency_contact_details: EmergencyContactDetailsInput
    hr_and_compliance: HRAndComplianceInput
    payroll_details: PayrollDetailsInput
  }

  input EmergencyContactDetailsInput {
    name: String
    phone: String
    email: String
    relationship: String
  }

  input HRAndComplianceInput {
    pan_number: String
    aadhar_number: String
    passport_number: String
    visa_status: String
  }

  input PayrollDetailsInput {
    bank_account_number: String
    bank_name: String
    ifsc_code: String
    pf_number: String
  }

  input PaginatedUsersInputs {
    emp_code: String
    name: String
    email: String
    phone: String
    role: Role
    include_disabled: Boolean = false
    first: Int = 10
    after: String
    sort: Sort = DESC
    sort_by: SORT_BY = CREATED_AT
  }

  input DisableUserInput {
    ids: [ID!]!
    is_disabled: Boolean!
  }

  input ChangePasswordInput {
    id: ID!
    current_password: String!
    new_password: String!
    confirm_password: String!
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

  # Response types
  type SignUpResponse {
    success: Boolean!
    user: UserSuccessResponse
  }

  type LoginResponse {
    success: Boolean!
    token: String
    user: UserResponse
  }

  type UserSuccessResponse {
    id: ID!
    emp_code: String!
    first_name: String!
    last_name: String!
    email: String!
    phone: String!
    role: Role!
    force_password_change: Boolean!
    is_verified: Boolean!
    is_disabled: Boolean!
  }

  type UserResponse {
    id: ID!
    emp_code: String!
    first_name: String!
    last_name: String!
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

  type EditUserResponse {
    success: Boolean!
    user: UserResponse
  }

  type LogoutResponse {
    success: Boolean!
  }

  type UserEdge {
    node: UserResponse!
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

  extend type Query {
    userByEmail(input: UserByEmailInput!): UserResponse
    userByfield(input: UserByFieldInput!): [UserResponse]
    users: [UserResponse]
    paginatedUsers(ids: [ID!], input: PaginatedUsersInputs): UsersConnection
  }

  extend type Mutation {
    signUp(input: SignUpInput!): SignUpResponse!
    login(input: LoginInput!): LoginResponse!
    editUser(input: EditUserInput!): EditUserResponse!
    deleteUser(input: DeleteUserInput!): Boolean!
    disableUser(input: DisableUserInput!): Boolean!
    changePassword(input: ChangePasswordInput!): Boolean!
    logout: LogoutResponse!
  }
`;
