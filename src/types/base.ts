// Common scalars, enums, and shared types
import { gql } from "graphql-tag";

export const baseTypeDefs = gql`
  scalar DateTime
  scalar JSON

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

  enum CategoryType {
    DEPARTMENT
    DESIGNATION
  }

  # Shared types that are referenced across modules
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
`;
