'use client';

import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User, formatRole } from '@/lib/auth/roles';

interface EditorHeaderProps {
  pageTitle?: string;
  user: User;
  isDraft?: boolean;
  isPublished?: boolean;
}

export function EditorHeader({
  pageTitle = 'Untitled',
  user,
  isDraft = false,
  isPublished = false,
}: EditorHeaderProps) {
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

  const canPublish = user.role === 'publisher';

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
              <h1 className="text-xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {isDraft && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Draft
                  </span>
                )}
                {isPublished && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!canPublish && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle size={16} className="text-orange-600" />
                <span className="text-xs font-medium text-orange-800">
                  Can't publish with {user.role} role
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600">{user.name}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${getRoleBadgeColor(user.role)}`}>
                  {formatRole(user.role as any)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
