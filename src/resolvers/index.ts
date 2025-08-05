import { Resolvers } from "generated";
import { AuthMutation } from "./auth/mutations";
import { AuthQuery } from "./auth/queries";
import { CategoryQuery } from "./category/queries";
import { CategoryMutation } from "./category/mutations";

const Query = {
  ...AuthQuery,
  ...CategoryQuery,
};
const Mutation = {
  ...AuthMutation,
  ...CategoryMutation,
};

export const resolvers: Resolvers = { Query, Mutation };
