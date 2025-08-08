import { createSchema } from "graphql-yoga";
import { typeDefs } from "@src/types/index";
import { resolvers } from "@src/resolvers";
import { GraphQLSchema } from "graphql";

export const schema: GraphQLSchema = createSchema({
  typeDefs,
  resolvers,
});
