export type UserRole = 'viewer' | 'editor' | 'publisher';

export const ROLE_PERMISSIONS = {
  viewer: {
    preview: true,
    edit: false,
    publish: false,
  },
  editor: {
    preview: true,
    edit: true,
    publish: false,
  },
  publisher: {
    preview: true,
    edit: true,
    publish: true,
  },
} as const;


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}


export function canUserAction(user: User, action: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean {
  const permissions = ROLE_PERMISSIONS[user.role];
  return (permissions[action] as boolean) || false;
}


export async function getCurrentUser(): Promise<User> {
  return {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'publisher', 
  };
}


export function requireRole(user: User, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    editor: 2,
    publisher: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}


export function formatRole(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    viewer: 'Viewer',
    editor: 'Editor',
    publisher: 'Publisher',
  };
  return labels[role];
}
