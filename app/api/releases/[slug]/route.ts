import { NextRequest, NextResponse } from 'next/server';
import { getLatestRelease } from '@/lib/publishing/releaseStorage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const release = await getLatestRelease(slug);
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(release);
  } catch (error) {
    console.error('[v0] Error fetching release:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release' },
      { status: 500 }
    );
  }
}
