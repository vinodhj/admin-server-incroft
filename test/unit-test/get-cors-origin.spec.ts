import { getCorsOrigin } from "@src/cors-headers";
import { describe, expect, it } from "vitest";

describe("getCorsOrigin", () => {
  const allowedOrigins = ["https://localhost:7787", "https://*.subdomain.dev"];

  const env = {
    ALLOWED_ORIGINS: allowedOrigins.join(","),
    KV_INCROFT_JWT_AUTH: {} as any,
    JWT_SECRET: "dummy-secret",
    PROJECT_TOKEN: "dummy-token",
    KV_SYNC_TOKEN: {} as any,
    ENVIRONMENT: "DEV",
    DB: {} as any,
  };

  it("should return the origin for an exact match", () => {
    const request = new Request("https://api.testserver.com", {
      headers: { Origin: "https://localhost:7787" },
    });
    expect(getCorsOrigin(request, env)).toBe("https://localhost:7787");
  });

  it("should return the origin for a wildcard match", () => {
    const request = new Request("https://3d080804.subdomain.dev", {
      headers: { Origin: "https://3d080804.subdomain.dev" },
    });
    expect(getCorsOrigin(request, env)).toBe("https://3d080804.subdomain.dev");
  });

  it("should return null for a non-allowed origin", () => {
    const request = new Request("https://malicious.com", {
      headers: { Origin: "https://malicious.com" },
    });
    expect(getCorsOrigin(request, env)).toBeNull();
  });

  it("should return null if no Origin header is present", () => {
    const request = new Request("https://api.testserver.com");
    expect(getCorsOrigin(request, env)).toBeNull();
  });
});
