import { SessionUserType } from ".";
import { AuthorizationService, AuthorizationError } from "@src/auth/authorization-service";

export abstract class BaseService {
  protected readonly sessionUser: SessionUserType;

  constructor(sessionUser: SessionUserType) {
    this.sessionUser = sessionUser;
  }

  // Helper methods for common authorization patterns
  protected requireAuth(): void {
    AuthorizationService.requireAuthentication(this.sessionUser?.role);
  }

  protected requirePermission(resource: string, action: string): void {
    AuthorizationService.requirePermission(this.sessionUser?.role, resource, action);
  }

  protected hasPermission(resource: string, action: string): boolean {
    return AuthorizationService.hasPermission(this.sessionUser?.role, resource, action);
  }

  protected requireAnyPermission(permissions: Array<{ resource: string; action: string }>): void {
    AuthorizationService.requireAnyPermission(this.sessionUser?.role, permissions);
  }

  // Helper for resource ownership checks
  protected requireOwnershipOrPermission(resourceOwnerId: string, resource: string, action: string): void {
    const isOwner = this.sessionUser?.id === resourceOwnerId;
    const hasPermission = this.hasPermission(resource, action);

    if (!isOwner && !hasPermission) {
      throw new AuthorizationError(
        `Access denied: You can only ${action} your own ${resource} or need ${action} permission`,
        this.sessionUser?.role,
        resource,
        action,
      );
    }
  }
}
