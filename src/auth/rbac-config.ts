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

        // User permissions
        "user:read",
        "user:disable", // Can disable/enable users
        "user:list", // Can list all users (users query)
        "user:search", // Can search users by field

        // Profile permissions
        "profile:read", // Can read all profiles
        "profile:update", // Can update all profiles

        // KV Storage permissions
        "kv:read",
        "kv:write",
        "kv:admin", // Can manage KV assets
        "company_profile:update", // Can update company profile
      ],
    },
    [Role.Viewer]: {
      inherits: [],
      permissions: [
        // Read-only permissions
        "category:read",

        // User permissions - limited
        "user:read_self", // Can only read own profile
        "user:update_self", // Can only update own profile

        // Profile permissions - self only
        "profile:read_self", // Can only read own profile
        "profile:update_self", // Can only update own profile

        // Auth permissions - self-service
        "auth:change_password_self", // Can only change own password
        "auth:login", // Can login
        "auth:logout", // Can logout

        // KV Storage read-only
        "kv:read",
      ],
    },
  },
};
