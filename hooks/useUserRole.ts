'use client';

import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/auth/roles';


export function useUserRole(defaultRole: UserRole): UserRole {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  if (!mounted) {
    return defaultRole;
  }

  return role;
}
