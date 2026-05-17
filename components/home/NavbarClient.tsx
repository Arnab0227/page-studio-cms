'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { RoleSelector } from '@/components/auth/RoleSelector';
import type { UserRole } from '@/lib/auth/roles';

interface NavbarClientProps {
  initialRole: UserRole;
}

export function NavbarClient({ initialRole }: NavbarClientProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
    window.location.reload();
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Page Studio</div>
          <Link href="/editor">
            <Button>
              Open Editor
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">Page Studio</div>
        <div className="flex items-center gap-4">
          <RoleSelector currentRole={role} onRoleChange={handleRoleChange} />
          <Link href="/editor">
            <Button>
              Open Editor
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
