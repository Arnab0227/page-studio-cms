'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { ErrorBoundary } from '@/components/preview/ErrorBoundary';
import { PreviewRenderer } from '@/components/preview/PreviewRenderer';
import { Button } from '@/components/ui/button';
import type { PageModel } from '@/lib/types';

interface PreviewPageClientProps {
  page: PageModel;
  components: unknown;
  error: string | null;
  isDraft: boolean;
}

export default function PreviewPageClient({
  page,
  components,
  error,
  isDraft,
}: PreviewPageClientProps) {
  return (
    <ErrorBoundary isDraft={isDraft}>
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                title="Back to editor"
                aria-label="Back to editor"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {page.fields.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {page.fields.published ? 'Published' : 'Draft Preview'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDraft && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Draft
                </span>
              )}
              <Link href={`/editor?id=${page.sys.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit3 size={16} />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <main className="w-full">
          {error ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            </div>
          ) : !Array.isArray(components) || components.length === 0 ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
              <p className="text-gray-500 mb-4">No components on this page yet</p>
              <Link href={`/editor?id=${page.sys.id}`}>
                <Button variant="default">Add Components</Button>
              </Link>
            </div>
          ) : (
            <div className="relative w-full py-12 min-h-[400px]">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
                <PreviewRenderer
                  components={components}
                  isDraftMode={isDraft}
                />
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-xs text-gray-600">
              {page.fields.published
                ? 'Published version'
                : 'Draft version - changes are not yet published'}
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
