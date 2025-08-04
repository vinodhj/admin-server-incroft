import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { KvQueue } from "./kv-queue";
import { Role } from "generated";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// KV queue
let kvQueuesMap = new WeakMap<KVNamespace, KvQueue>();

export const jwtVerifyToken = async ({
  token,
  secret,
  kvStorage,
  ENVIRONMENT,
}: {
  token: string;
  secret: string;
  kvStorage: KVNamespace;
  ENVIRONMENT: string;
}): Promise<TokenPayload> => {
  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    // Check expiration before Redis lookup
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new GraphQLError("Token expired", {
        extensions: { code: "TOKEN_EXPIRED" },
      });
    }

    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    handleTokenError(error, token, kvStorage, ENVIRONMENT);
  }
};

function handleTokenError(error: unknown, token: string, kvStorage: KVNamespace, environment: string): never {
  // Get or create queue for this KV namespace
  if (!kvQueuesMap.has(kvStorage)) {
    kvQueuesMap.set(kvStorage, new KvQueue(kvStorage));
  }
  const queue = kvQueuesMap.get(kvStorage)!;

  // Queue the KV write
  const logKey = `invalid-token:${environment}:${new Date().toISOString()}`;
  const logValue = JSON.stringify({
    token,
    error: error,
    timestamp: new Date().toISOString(),
  });

  queue.push(logKey, logValue, { expirationTtl: 7 * 24 * 60 * 60 });

  const isGraphQLError = error instanceof GraphQLError;
  throw new GraphQLError(isGraphQLError ? error.message : "Invalid token", {
    extensions: {
      code: isGraphQLError && error.extensions?.code ? error.extensions.code : "UNAUTHORIZED",
      error: isGraphQLError && error.extensions?.error ? error.extensions.error : error,
    },
  });
}
