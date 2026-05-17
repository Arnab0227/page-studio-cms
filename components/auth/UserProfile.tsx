'use client';

import { useState } from 'react';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { User, UserRole, formatRole, ROLE_PERMISSIONS } from '@/lib/auth/roles';

interface UserProfileProps {
  user: User;
  onRoleChange?: (role: UserRole) => void;
}

export function UserProfile({ user, onRoleChange }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const roles: UserRole[] = ['viewer', 'editor', 'publisher'];

  const getRoleBadgeColor = (role: UserRole) => {
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className={`text-xs font-medium px-2 py-0.5 rounded ${getRoleBadgeColor(user.role)}`}>
            {formatRole(user.role)}
          </p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>

          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Switch Role
            </p>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange?.(role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                    user.role === role
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{formatRole(role)}</span>
                    {user.role === role && <span className="text-blue-600">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Current Permissions
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              {Object.entries(ROLE_PERMISSIONS[user.role]).map(([action, allowed]) => (
                <p key={action} className="flex items-center gap-2">
                  <span className={allowed ? 'text-green-600' : 'text-gray-400'}>
                    {allowed ? '✓' : '✗'}
                  </span>
                  <span className="capitalize">{action}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
              <Settings size={16} />
              Settings
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
