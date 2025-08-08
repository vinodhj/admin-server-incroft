import { LoginInput, LoginResponse } from "generated";
import { GraphQLError } from "graphql";
import { APIs } from "@src/services";

export const login = async (
  _: unknown,
  { input }: { input: LoginInput },
  { apis: { authAPI } }: { apis: APIs },
): Promise<LoginResponse> => {
  try {
    return await authAPI.login(input);
  } catch (error) {
    console.error("Unexpected error:", error);
    if (error instanceof GraphQLError || error instanceof Error) {
      // Re-throw GraphQL-specific errors
      throw error;
    }
    throw new GraphQLError("Failed to login", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
