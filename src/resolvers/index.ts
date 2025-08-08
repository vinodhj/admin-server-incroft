import { Resolvers } from "generated";
import { AuthMutation } from "./auth/mutations";
import { AuthQuery } from "./auth/queries";
import { CategoryQuery } from "./category/queries";
import { CategoryMutation } from "./category/mutations";
import { ProfileNestedResolvers, UserNestedResolvers } from "./nested-resolvers";

const Query = {
  // Root resolvers
  health: () => "OK",
  version: () => "1.0.0",
  serverTime: () => new Date().toISOString(),
  ...AuthQuery,
  ...CategoryQuery,
};
const Mutation = {
  healthCheck: () => ({
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    services: [{ name: "GraphQL", status: "HEALTHY", responseTime: 1 }],
  }),
  ...AuthMutation,
  ...CategoryMutation,
};

export const resolvers: Resolvers = {
  Query,
  Mutation,
  User: UserNestedResolvers,
  UserResponse: UserNestedResolvers,
  UserProfile: ProfileNestedResolvers,
};
