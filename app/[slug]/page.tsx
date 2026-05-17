import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { getPublishedPageBySlug } from '@/lib/publishing/getPublishedPage';
import { PreviewRenderer } from '@/components/preview/PreviewRenderer';
import { Button } from '@/components/ui/button';

interface PublishedPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublishedPage({ params }: PublishedPageProps) {
  const { slug } = await params;
  
  let publishedContent = null;
  let error: string | null = null;

  try {
    publishedContent = await getPublishedPageBySlug(slug);
  } catch (err) {
    console.error('[v0] Error loading published page:', err);
    error = 'Failed to load page';
  }

  const page = publishedContent?.page || null;
  const components = publishedContent?.components || [];

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || 'The published page you are looking for does not exist.'}
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {page.fields.title}
              </h1>
              <p className="text-xs text-gray-500">
                Published • v{publishedContent?.version || '1.0.0'}
              </p>
            </div>
          </div>
          <Link href={`/preview/${slug}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit3 size={16} />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-white">
        <PreviewRenderer
          page={page}
          components={components}
          isDraft={false}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PublishedPageProps): Promise<any> {
  const { slug } = await params;

  try {
    const publishedContent = await getPublishedPageBySlug(slug);
    if (!publishedContent) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }

    const { page } = publishedContent;
    return {
      title: page.fields.title,
      description: page.fields.description || `Published page: ${page.fields.title}`,
      openGraph: {
        title: page.fields.title,
        description: page.fields.description,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Error Loading Page',
      description: 'An error occurred while loading the page.',
    };
  }
}
