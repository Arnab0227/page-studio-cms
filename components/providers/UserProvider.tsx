'use client';

import { useState, useEffect, ReactNode } from 'react';
import { User, UserRole, getCurrentUser } from '@/lib/auth/roles';
import { UserContext } from '@/lib/context/UserContext';

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const changeRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, changeRole }}>
      {children}
    </UserContext.Provider>
  );
}
