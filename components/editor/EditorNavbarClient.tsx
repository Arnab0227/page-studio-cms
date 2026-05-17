'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleSelector } from '@/components/auth/RoleSelector';
import type { UserRole } from '@/lib/auth/roles';

interface EditorNavbarClientProps {
  pageTitle?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  initialRole: UserRole;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'viewer':
      return 'bg-gray-100 text-gray-800';
    case 'editor':
      return 'bg-blue-100 text-blue-800';
    case 'publisher':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function EditorNavbarClient({
  pageTitle = 'Untitled',
  isDraft = false,
  isPublished = false,
  initialRole,
}: EditorNavbarClientProps) {
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

  const canPublish = role === 'publisher';

  if (!mounted) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                title="Back to home"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
              <div className="flex items-center gap-2 mt-1">
                {isDraft && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Draft
                  </span>
                )}
                {isPublished && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Demo User</p>
              <RoleSelector currentRole={role} onRoleChange={handleRoleChange} />
            </div>
            {!canPublish && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200">
                <AlertCircle size={16} className="text-orange-600" />
                <span className="text-xs font-medium text-orange-800">Can&apos;t publish with {role} role</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
