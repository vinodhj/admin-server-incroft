import { createSchema } from "graphql-yoga";
import { typeDefs } from "@src/types";
import { resolvers } from "@src/resolvers";
import { GraphQLSchema } from "graphql";

export const schema: GraphQLSchema = createSchema({
  typeDefs,
  resolvers,
});
