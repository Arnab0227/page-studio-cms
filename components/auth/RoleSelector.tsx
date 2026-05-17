'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { UserRole } from '@/lib/auth/roles';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'viewer', label: 'Viewer', color: 'bg-gray-200 text-gray-800' },
  { value: 'editor', label: 'Editor', color: 'bg-blue-200 text-blue-800' },
  { value: 'publisher', label: 'Publisher', color: 'bg-purple-200 text-purple-800' },
];

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentRoleConfig = ROLES.find(r => r.value === currentRole);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
          currentRoleConfig?.color || 'bg-gray-200 text-gray-800'
        } hover:opacity-90`}
      >
        <span className="capitalize">{currentRole}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {ROLES.map(role => (
            <button
              key={role.value}
              onClick={() => {
                onRoleChange(role.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                currentRole === role.value
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mr-2 ${role.color}`}>
                {role.label}
              </span>
              {currentRole === role.value && <span className="text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
