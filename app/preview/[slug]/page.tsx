import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { getPublishedPageBySlug } from '@/lib/publishing/getPublishedPage';
import { PreviewRenderer } from '@/components/preview/PreviewRenderer';
import { Button } from '@/components/ui/button';
import PreviewPageClient from './PreviewPageClient';

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  
  let publishedContent = null;
  let error: string | null = null;

  try {
    publishedContent = await getPublishedPageBySlug(slug);
  } catch (err) {
    console.error('[v0] Error loading published page for preview:', err);
    error = 'Failed to load page';
  }

  const page = publishedContent?.page || null;
  const components = publishedContent?.components || [];

  if (!page) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page &quot;{slug}&quot; doesn&apos;t exist yet.
          </p>
          <Link href="/editor">
            <Button variant="default">Go to Editor</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PreviewPageClient
      page={page}
      components={components}
      error={error}
      isDraft={!page.fields.published}
    />
  );
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<any> {
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
      title: `${page.fields.title} - Preview`,
      description: `Preview of ${page.fields.title}`,
    };
  } catch {
    return {
      title: 'Error Loading Page',
      description: 'An error occurred while loading the page.',
    };
  }
}
