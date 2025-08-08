import { gql } from "graphql-tag";

export const categoryTypeDefs = gql`
  # Department and Designation types are now in base.ts

  type Category {
    id: ID!
    name: String!
    description: String
    created_at: DateTime!
    updated_at: DateTime!
    created_by: String!
    updated_by: String!
    is_disabled: Boolean!
  }

  type CategorySuccessResponse {
    id: ID!
    name: String!
    description: String
    category_type: CategoryType!
  }

  type CategoryResponse {
    success: Boolean!
    category: CategorySuccessResponse
  }

  input CreateCategoryInput {
    category_type: CategoryType!
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    id: ID!
    category_type: CategoryType!
    name: String!
    description: String
    is_disabled: Boolean
  }

  input DeleteCategoryInput {
    id: ID!
    category_type: CategoryType!
  }

  input CategoryFilter {
    id: ID
    search: String
  }

  extend type Query {
    departments(input: CategoryFilter): [Category]
    designations(input: CategoryFilter): [Category]
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): CategoryResponse!
    updateCategory(input: UpdateCategoryInput!): CategoryResponse!
    deleteCategory(input: DeleteCategoryInput!): Boolean!
  }
`;
