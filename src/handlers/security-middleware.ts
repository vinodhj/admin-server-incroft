import { GraphQLError } from "graphql";
import { jwtVerifyToken } from "./jwt";
import { SessionUserType } from "@src/services";

export class SecurityMiddleware {
  validateProjectToken(projectToken: string | null, expectedToken: string): void {
    if (!projectToken || projectToken !== expectedToken) {
      console.warn("Unauthorized access attempt: Invalid project token");
      throw new GraphQLError("Unauthorized access", {
        extensions: { code: "UNAUTHORIZED", status: 401 },
      });
    }
  }

  // Constant-time string comparison to prevent timing attacks
  constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  // Verify JWT token and extract user information
  async verifyJwtToken(token: string | null, secret: string, env: Env): Promise<SessionUserType> {
    if (!token) {
      console.warn("Unauthorized access attempt: Missing JWT token");
      throw new GraphQLError("Unauthorized access", {
        extensions: { code: "UNAUTHORIZED", status: 401 },
      });
    }

    try {
      // Verify token
      const jwtToken = await jwtVerifyToken({
        token: token.replace(/bearer\s+/i, "").trim(),
        secret: secret,
        kvStorage: env.KV_INCROFT_JWT_AUTH,
        ENVIRONMENT: env.ENVIRONMENT,
      });
      return {
        id: jwtToken.id,
        role: jwtToken.role,
        email: jwtToken.email,
        name: jwtToken.name,
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      const isGraphQLError = error instanceof GraphQLError;
      throw new GraphQLError(isGraphQLError ? error.message : "Invalid token", {
        extensions: {
          status: 401,
          code: isGraphQLError ? error.extensions.code : "UNAUTHORIZED",
          error: isGraphQLError && error.extensions?.error ? error.extensions.error : error,
        },
      });
    }
  }
}
