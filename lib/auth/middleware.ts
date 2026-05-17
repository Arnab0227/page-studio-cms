
import { getCurrentUser, requireRole, canUserAction } from './roles';
import type { UserRole, User } from './roles';

export async function checkRouteAccess(requiredRole: UserRole): Promise<{
  allowed: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const user = await getCurrentUser();

    if (requiredRole === 'viewer') {
      return { allowed: true, user };
    }

    if (!requireRole(user, requiredRole)) {
      return {
        allowed: false,
        error: `This page requires ${requiredRole} role. Your role is ${user.role}.`,
      };
    }

    return { allowed: true, user };
  } catch (error) {
    console.error('[v0] Auth middleware error:', error);
    return {
      allowed: false,
      error: 'Authentication failed',
    };
  }
}


export async function checkActionAccess(
  action: 'preview' | 'edit' | 'publish'
): Promise<{
  allowed: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const user = await getCurrentUser();

    if (!canUserAction(user, action)) {
      return {
        allowed: false,
        error: `Your role (${user.role}) does not have permission to ${action}`,
      };
    }

    return { allowed: true, user };
  } catch (error) {
    console.error('[v0] Action auth check failed:', error);
    return {
      allowed: false,
      error: 'Authorization check failed',
    };
  }
}
