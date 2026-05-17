'use client';

import { User, UserRole, canUserAction } from '@/lib/auth/roles';

interface RoleProtectionProps {
  user: User;
  action: 'edit' | 'preview' | 'publish';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleProtection({
  user,
  action,
  children,
  fallback,
}: RoleProtectionProps) {
  const hasPermission = canUserAction(user, action);

  if (!hasPermission) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">
          Access Denied
        </p>
        <p className="text-sm text-red-700 mt-1">
          Your role ({user.role}) does not have permission to {action}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

interface RoleGateProps {
  user: User;
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({
  user,
  allowedRoles,
  children,
  fallback,
}: RoleGateProps) {
  const isAllowed = allowedRoles.includes(user.role);

  if (!isAllowed) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">
          Access Denied
        </p>
        <p className="text-sm text-red-700 mt-1">
          This feature is only available to: {allowedRoles.join(', ')}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
