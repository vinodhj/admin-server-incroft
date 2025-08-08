import { Role } from "generated";
import { RBAC_CONFIG } from "./rbac-config";

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public userRole?: Role,
    public resource?: string,
    public action?: string,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class AuthorizationService {
  private static readonly permissionCache = new Map<Role, Set<string>>();
  private static initialized = false;

  static init() {
    if (this.initialized) return;

    console.log("Initializing RBAC system...");

    // Build permission cache from config
    for (const [roleKey, roleConfig] of Object.entries(RBAC_CONFIG.roles)) {
      const role = roleKey as Role;
      const permissions = new Set<string>();

      // Add inherited permissions recursively
      this.addInheritedPermissions(role, permissions, new Set());

      this.permissionCache.set(role, permissions);
    }

    this.initialized = true;
    console.log("RBAC system initialized successfully");
  }

  private static addInheritedPermissions(role: Role, permissions: Set<string>, visited: Set<Role>): void {
    if (visited.has(role)) return; // Prevent circular inheritance
    visited.add(role);

    const roleConfig = RBAC_CONFIG.roles[role];
    if (!roleConfig) return;

    // Add direct permissions
    roleConfig.permissions.forEach((p) => permissions.add(p));

    // Add inherited permissions recursively
    roleConfig.inherits.forEach((inheritedRole) => {
      this.addInheritedPermissions(inheritedRole, permissions, visited);
    });
  }

  static hasPermission(userRole: Role | null | undefined, resource: string, action: string): boolean {
    // 🛡️ Auto-initialize if not already done (safety net)
    if (!this.initialized) {
      this.init();
    }

    if (!userRole) return false;

    this.init(); // Ensure initialized

    const permissions = this.permissionCache.get(userRole);
    if (!permissions) return false;

    const permissionKey = `${resource}:${action}`;
    return permissions.has(permissionKey) || permissions.has(`${resource}:*`) || permissions.has("*:*");
  }

  static requirePermission(userRole: Role | null | undefined, resource: string, action: string): void {
    if (!this.hasPermission(userRole, resource, action)) {
      throw new AuthorizationError(`Access denied: ${action} on ${resource}`, userRole || undefined, resource, action);
    }
  }

  static requireAuthentication(userRole: Role | null | undefined): void {
    if (!userRole) {
      throw new AuthorizationError("Authentication required");
    }
  }

  // Utility method to check multiple permissions (useful for complex operations)
  static hasAnyPermission(userRole: Role | null | undefined, permissions: Array<{ resource: string; action: string }>): boolean {
    return permissions.some(({ resource, action }) => this.hasPermission(userRole, resource, action));
  }

  static requireAnyPermission(userRole: Role | null | undefined, permissions: Array<{ resource: string; action: string }>): void {
    if (!this.hasAnyPermission(userRole, permissions)) {
      const permissionStrings = permissions.map(({ resource, action }) => `${action} on ${resource}`);
      throw new AuthorizationError(`Access denied. Required one of: ${permissionStrings.join(", ")}`);
    }
  }

  // Debug method - useful in development
  static getUserPermissions(userRole: Role): string[] {
    this.init();
    const permissions = this.permissionCache.get(userRole);
    return permissions ? Array.from(permissions) : [];
  }

  // 💡 Debug method to get all role permissions
  static getRolePermissions(): Record<Role, string[]> {
    this.init(); // Ensure initialized
    const result: Record<string, string[]> = {};

    this.permissionCache.forEach((permissions, role) => {
      result[role] = Array.from(permissions);
    });

    return result as Record<Role, string[]>;
  }
}
