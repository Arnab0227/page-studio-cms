import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { PageModel } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('[v0] API: Loading page with ID:', id);

    try {
      const releasesDir = path.join(process.cwd(), 'releases');
      
      const items = await fs.readdir(releasesDir);
      
      for (const slug of items) {
        const slugDir = path.join(releasesDir, slug);
        const stats = await fs.stat(slugDir);
        
        if (!stats.isDirectory()) continue;
        
        const indexPath = path.join(slugDir, '_index.json');
        try {
          const indexContent = await fs.readFile(indexPath, 'utf-8');
          const index = JSON.parse(indexContent);
          
          if (index.versions && index.versions.length > 0) {
            const latestVersion = index.versions[index.versions.length - 1];
            const releasePath = path.join(slugDir, `${latestVersion.version}.json`);
            const releaseContent = await fs.readFile(releasePath, 'utf-8');
            const release = JSON.parse(releaseContent);
            
            if (release.page?.sys?.id === id) {
              console.log('[v0] API: Found page in releases:', id);
              return NextResponse.json({
                success: true,
                page: release.page,
                source: 'releases',
              });
            }
          }
        } catch (error) {
          continue;
        }
      }
    } catch (releasesErr) {
      console.log('[v0] API: Could not search releases directory:', releasesErr);
    }

    try {
      const { getPageById } = await import('@/lib/contentful');
      const page = await getPageById(id);
      
      if (page) {
        console.log('[v0] API: Found page in Contentful:', id);
        return NextResponse.json({
          success: true,
          page,
          source: 'contentful',
        });
      }
    } catch (contentfulErr) {
      console.log('[v0] API: Could not load from Contentful:', contentfulErr);
    }

    console.log('[v0] API: Page not found:', id);
    return NextResponse.json(
      { success: false, error: 'Page not found', page: null },
      { status: 404 }
    );
  } catch (error) {
    console.error('[v0] API Error loading page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load page', page: null },
      { status: 500 }
    );
  }
}
