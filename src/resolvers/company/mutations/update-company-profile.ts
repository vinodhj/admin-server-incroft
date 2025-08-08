import { AuthorizationError } from "@src/auth/authorization-service";
import { APIs } from "@src/services";
import { CompanyProfileResponse, UpdateCompanyProfileInput } from "generated";
import { GraphQLError } from "graphql";

export const updateCompanyProfile = async (
  __: unknown,
  { input }: { input: UpdateCompanyProfileInput },
  { apis: { kvStorageAPI } }: { apis: APIs },
): Promise<CompanyProfileResponse> => {
  try {
    return await kvStorageAPI.updateCompanyProfile(input);
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
    throw new GraphQLError("Failed to update company profile", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
