'use client';

import Link from 'next/link';
import { ExternalLink, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublishedPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  publishedAt: string;
  version: string;
  author?: string;
}

interface PublishedPagesProps {
  pages: PublishedPage[];
}

export function PublishedPages({ pages }: PublishedPagesProps) {
  if (pages.length === 0) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
            Published Pages
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No published pages yet.</p>
            <p className="text-sm text-gray-500">
              Create and publish pages using the editor to see them here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
          Published Pages
        </h2>
        <p className="text-center text-gray-600 mb-16">
          View and manage all published pages in production
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                </div>
                <p className="text-sm text-gray-600">v{page.version}</p>
              </div>

              <div className="px-6 py-4 space-y-4">
                {page.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{page.description}</p>
                )}

                <div className="space-y-2 text-xs text-gray-600">
                  {page.author && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Author:</span>
                      <span>{page.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(page.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded px-3 py-2">
                  <p className="text-xs text-gray-600 font-mono text-gray-700">
                    /{page.slug}
                  </p>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                <Link href={`/preview/${page.slug}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </Button>
                </Link>
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full gap-2"
                  >
                    View
                    <ExternalLink size={16} />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
