import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { CompanyProfile } from "generated";
import { GraphQLError } from "graphql";

export const companyProfile = async (
  __: unknown,
  _: unknown,
  { apis: { kvStorageAPI } }: { apis: APIs },
): Promise<CompanyProfile | null> => {
  try {
    return await kvStorageAPI.getCompanyProfile();
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQL-specific errors
      throw error;
    } else if (error instanceof AuthorizationError) {
      throw new GraphQLError(`Unauthorized: ${error.message}`, {
        extensions: {
          code: "UNAUTHORIZED-RBAC",
          error,
        },
      });
    }
    console.error("Unexpected error:", error);
    throw new GraphQLError("Failed to get company profile", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
