import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPages } from '@/lib/publishing/getPublishedPages';

interface PublishedPagesResponse {
  success: boolean;
  pages?: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string;
    publishedAt: string;
    version: string;
    author?: string;
  }>;
  error?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<PublishedPagesResponse>> {
  try {
    const pages = await getPublishedPages();

    return NextResponse.json(
      {
        success: true,
        pages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching published pages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch published pages',
      },
      { status: 500 }
    );
  }
}
