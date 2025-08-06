declare module "cloudflare:test" {
  // ...or if you have an existing `Env` type...
  interface ProvidedEnv extends Env {
    DB: D1Database;
    KV_INCROFT_JWT_AUTH: KVNamespace;
    JWT_SECRET: string;
    PROJECT_TOKEN: string;
    KV_SYNC_TOKEN: string;
    ALLOWED_ORIGINS: string;
    ENVIRONMENT: string;
    EMP_CODE_PREFIX: string;
    EMP_CODE_INCLUDE_YEAR: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
