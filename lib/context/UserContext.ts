import { createContext, useContext } from 'react';
import { User, UserRole } from '@/lib/auth/roles';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  changeRole: (role: UserRole) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
