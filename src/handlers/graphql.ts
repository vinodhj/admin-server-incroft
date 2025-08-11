import { YogaSchemaDefinition, createYoga } from "graphql-yoga";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "@src/schemas";
import { addCORSHeaders } from "@src/cors-headers";
import { APIs, createAPIs, SessionUserType } from "@src/services";
import { SecurityMiddleware } from "./security-middleware";
import { mapRole } from "@src/datasources/utils";
import { AuthorizationService } from "@src/auth/authorization-service";
import { StorageConfig } from "@src/datasources/StorageFactory";

export interface YogaInitialContext {
  jwtSecret: string;
  accessToken: string | null;
  sessionUser: SessionUserType;
  apis: APIs;
}

const GRAPHQL_PATH = "/graphql";

// 🚀 INITIALIZE RBAC SYSTEM ONCE AT MODULE LEVEL
AuthorizationService.init();

const getAccessToken = (authorizationHeader: string | null): string | null => {
  if (!authorizationHeader) return null;
  return authorizationHeader.replace(/bearer\s+/i, "").trim();
};

export const getHeader = (headers: Headers, key: string): string | null => headers.get(key) ?? headers.get(key.toLowerCase());

export default async function handleGraphQL(request: Request, env: Env): Promise<Response> {
  const db = drizzle(env.DB);
  const isDev = env.ENVIRONMENT === "DEV";

  // Initialize storage configuration
  const storageConfig: StorageConfig = {
    R2_BUCKET: env.R2_BUCKET,
    PUBLIC_DOMAIN: env.R2_CUSTOM_DOMAIN,
  };

  // 💡 Logging RBAC initialization in dev mode
  if (isDev) {
    console.log("RBAC System initialized");
    console.log("Available roles:", Object.keys(AuthorizationService.getRolePermissions()));
  }

  // Instantiate security middleware
  const securityMiddleware = new SecurityMiddleware();

  const yoga = createYoga({
    schema: schema as YogaSchemaDefinition<object, YogaInitialContext>,
    cors: false, // manually added CORS headers in addCORSHeaders
    landingPage: false,
    graphqlEndpoint: GRAPHQL_PATH,
    // Nonce plugins is only active in the production and is controlled through environment variables.
    context: async ({ request }) => {
      const headers = request.headers;

      const projectToken = getHeader(headers, "X-Project-Token");
      const authorization = getHeader(headers, "Authorization");

      // Validate project token
      securityMiddleware.validateProjectToken(projectToken, env.PROJECT_TOKEN);

      // Extract access token from Authorization header
      const accessToken = getAccessToken(authorization);
      let sessionUser: SessionUserType = null;
      // If access token is provided, verify it
      if (accessToken) {
        // Validate JWT token
        const jwtVerifiedUser = await securityMiddleware.verifyJwtToken(accessToken, env.JWT_SECRET, env);

        // Create session user if all required fields are present
        if (jwtVerifiedUser) {
          sessionUser = {
            id: jwtVerifiedUser.id,
            role: mapRole(jwtVerifiedUser.role),
            email: jwtVerifiedUser.email,
            name: jwtVerifiedUser.name,
          };
        }
      }

      // Create service APIs
      const { authAPI, userAPI, kvStorageAPI, categoryAPI } = createAPIs({ db, env, sessionUser, storageConfig });

      return {
        jwtSecret: env.JWT_SECRET,
        accessToken,
        sessionUser,
        apis: {
          authAPI,
          userAPI,
          kvStorageAPI,
          categoryAPI,
        },
      };
    },
  });
  // ✅ Ensure CORS Headers Are Set on the Response
  const response = await yoga.fetch(request);
  return addCORSHeaders(request, response, env);
}
