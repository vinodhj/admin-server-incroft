import { Role } from "generated";

export const RBAC_CONFIG = {
  roles: {
    [Role.Admin]: {
      inherits: [],
      permissions: ["*:*"], // Admin has all permissions
    },
    [Role.Manager]: {
      inherits: [Role.Viewer],
      permissions: [
        // Category permissions
        "category:create",
        "category:update",
        "category:delete",

        // KV Storage permissions
        "kv:read",
        "kv:write",
      ],
    },
    [Role.Viewer]: {
      inherits: [],
      permissions: [
        // Read-only permissions
        "category:read",
        "kv:read",
      ],
    },
  },
};
