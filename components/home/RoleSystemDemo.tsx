'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

const roles = [
  {
    name: 'Viewer',
    color: 'gray',
    description: 'View published pages and drafts',
    permissions: [
      { action: 'Preview pages', allowed: true },
      { action: 'Edit pages', allowed: false },
      { action: 'Publish pages', allowed: false },
    ],
  },
  {
    name: 'Editor',
    color: 'blue',
    description: 'Create and edit pages',
    permissions: [
      { action: 'Preview pages', allowed: true },
      { action: 'Edit pages', allowed: true },
      { action: 'Publish pages', allowed: false },
    ],
  },
  {
    name: 'Publisher',
    color: 'purple',
    description: 'Full control - edit and publish',
    permissions: [
      { action: 'Preview pages', allowed: true },
      { action: 'Edit pages', allowed: true },
      { action: 'Publish pages', allowed: true },
    ],
  },
  {
    name: 'Admin',
    color: 'red',
    description: 'System administrator',
    permissions: [
      { action: 'Preview pages', allowed: true },
      { action: 'Edit pages', allowed: true },
      { action: 'Publish pages', allowed: true },
    ],
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };
  return colors[color] || colors.gray;
};

const getBadgeClasses = (color: string) => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
  };
  return colors[color] || colors.gray;
};

export function RoleSystemDemo() {
  return (
    <section className="py-20 sm:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Role-Based Access Control
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four roles with different permission levels to manage content creation and publishing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.name}
              className={`rounded-lg border-2 p-6 ${getColorClasses(role.color)}`}
            >
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(role.color)}`}>
                  {role.name}
                </span>
              </div>

              <p className="text-sm mb-6 opacity-90">{role.description}</p>

              <div className="space-y-3">
                {role.permissions.map((perm) => (
                  <div key={perm.action} className="flex items-center gap-2">
                    {perm.allowed ? (
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${perm.allowed ? 'font-medium' : 'opacity-60'}`}>
                      {perm.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-blue-50 border-2 border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to Test Roles
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            To test different roles, modify <code className="bg-blue-100 px-2 py-1 rounded">lib/auth/roles.ts</code> and change the <code className="bg-blue-100 px-2 py-1 rounded">role</code> field in <code className="bg-blue-100 px-2 py-1 rounded">getCurrentUser()</code>:
          </p>
          <div className="bg-gray-900 rounded p-4 text-gray-100 text-sm font-mono overflow-x-auto">
            <pre>{`export async function getCurrentUser(): Promise<User> {
  return {
    role: 'publisher', // Change to: 'viewer', 'editor', 'publisher', 'admin'
  };
}`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
