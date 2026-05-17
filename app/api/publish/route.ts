import { NextRequest, NextResponse } from 'next/server';
import { getPageById, savePage } from '@/lib/contentful';
import {
  saveRelease,
  getLatestRelease,
  findReleaseByContentHash,
} from '@/lib/publishing/releaseStorage';
import {
  calculateContentHash,
  calculateNextVersion,
} from '@/lib/publishing/semverDiff';
import { checkActionAccess } from '@/lib/auth/middleware';
import type { PageModel, BuilderComponent } from '@/lib/schema';


interface PublishRequest {
  pageId: string;
  page?: PageModel;
  changelog?: string[];
}


interface PublishResponse {
  success: boolean;
  version?: string;
  slug?: string;
  message?: string;
  error?: string;
}


export async function POST(req: NextRequest): Promise<NextResponse<PublishResponse>> {
  try {
    // Check authorization
    const authCheck = await checkActionAccess('publish');
    if (!authCheck.allowed) {
      return NextResponse.json(
        { success: false, error: authCheck.error || 'Unauthorized' },
        { status: 403 }
      );
    }

    let body: PublishRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { pageId, page: pageFromRequest, changelog = [] } = body;

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: 'pageId is required' },
        { status: 400 }
      );
    }

    let page: PageModel;
    
    if (pageFromRequest) {
      console.log('[v0] Using page data from request body');
      page = pageFromRequest;
    } else {
      try {
        const loadedPage = await getPageById(pageId);
        if (!loadedPage) {
          if (pageId === 'demo-page') {
            console.log('[v0] Demo page not found in Contentful, creating fallback');
            page = {
              sys: {
                id: pageId,
                type: 'Entry',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                locale: 'en-US',
                revision: 1,
                space: { sys: { id: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '', type: 'Link', linkType: 'Space' } },
                contentType: { sys: { id: 'page', type: 'Link', linkType: 'ContentType' } },
              },
              fields: {
                title: 'Demo Page',
                slug: 'demo',
                components: [],
                published: false,
              },
            };
          } else {
            return NextResponse.json(
              { success: false, error: 'Page not found' },
              { status: 404 }
            );
          }
        } else {
          page = loadedPage;
        }
      } catch (error) {
        console.error('[v0] Error loading page:', error);
        if (pageId === 'demo-page') {
          console.log('[v0] Error loading demo page, using fallback');
          page = {
            sys: {
              id: pageId,
              type: 'Entry',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              locale: 'en-US',
              revision: 1,
              space: { sys: { id: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '', type: 'Link', linkType: 'Space' } },
              contentType: { sys: { id: 'page', type: 'Link', linkType: 'ContentType' } },
            },
            fields: {
              title: 'Demo Page',
              slug: 'demo',
              components: [],
              published: false,
            },
          };
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to load page' },
            { status: 500 }
          );
        }
      }
    }

    const components = (page.fields.components || []) as BuilderComponent[];
    const slug = page.fields.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Page slug is required' },
        { status: 400 }
      );
    }

    const contentHash = calculateContentHash(page, components);

    const existingRelease = await findReleaseByContentHash(slug, contentHash);
    if (existingRelease) {
      return NextResponse.json({
        success: true,
        version: existingRelease.metadata.version,
        slug: existingRelease.metadata.slug,
        message: 'This content has already been published',
      });
    }

    const latestRelease = await getLatestRelease(slug);
    const currentVersion = latestRelease?.metadata.version || '0.0.0';
    const nextVersion = calculateNextVersion(
      currentVersion,
      latestRelease?.components,
      components
    );

    const updatedPage: PageModel = {
      ...page,
      fields: {
        ...page.fields,
        published: true,
      },
    };

    try {
      await savePage(updatedPage);
    } catch (error) {
      console.error('[v0] Error saving published page to Contentful:', error);
    }

    try {
      const release = await saveRelease(
        slug,
        nextVersion,
        page,
        components,
        changelog,
        contentHash
      );

      return NextResponse.json({
        success: true,
        version: release.metadata.version,
        slug: release.metadata.slug,
        message: `Page published as version ${release.metadata.version}`,
      });
    } catch (error) {
      console.error('[v0] Error saving release:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save release' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[v0] Unexpected error in publish endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, { status: 200 });
}
