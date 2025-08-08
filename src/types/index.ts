import { baseTypeDefs } from "./base";
import { userTypeDefs } from "./user";
import { categoryTypeDefs } from "./category";
import { companyTypeDefs } from "./company";
import { gql } from "graphql-tag";

// Base Query and Mutation types (REQUIRED for extend to work)
const rootTypeDefs = gql`
  type Query {
    health: String
    version: String
    serverTime: String
  }

  type HealthStatus {
    status: String!
    timestamp: String!
    services: [ServiceStatus!]!
  }

  type ServiceStatus {
    name: String!
    status: String!
    responseTime: Int
  }

  type Mutation {
    healthCheck: HealthStatus
  }
`;

// Export all typeDefs
export const typeDefs = [
  rootTypeDefs, // THIS IS REQUIRED - don't remove!
  baseTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  companyTypeDefs,
];
