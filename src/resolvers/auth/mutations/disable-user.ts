import { APIs } from "@src/services";
import { DisableUserInput } from "generated";
import { GraphQLError } from "graphql";

export const disableUser = async (
  _: unknown,
  { input }: { input: DisableUserInput },
  {
    apis: { userAPI },
  }: {
    apis: APIs;
  },
): Promise<boolean> => {
  try {
    return await userAPI.disableUser(input);
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    }
    console.error("Unexpected error:", error);
    throw new GraphQLError("Failed to disable/enable user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
