import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';
import type { PageModel } from '@/lib/schema';

interface PublishedPageInfo {
  id: string;
  title: string;
  slug: string;
  description?: string;
  publishedAt: string;
  version: string;
  author?: string;
}

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;

let deliveryClient: ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'> | null = null;

function getDeliveryClient() {
  if (deliveryClient) {
    return deliveryClient;
  }

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error('[v0] Contentful credentials missing for getPublishedPages');
    throw new Error('Contentful credentials are missing');
  }

  deliveryClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
    environment: 'master',
  });

  return deliveryClient;
}

interface ReleaseEntry {
  fields: {
    version: string;
    slug: string;
    pageId: string;
    pageTitle: string;
    publishedAt: string;
    releaseData?: string;
  };
  sys: {
    createdAt: string;
  };
}

export async function getPublishedPages(): Promise<PublishedPageInfo[]> {
  try {
    const client = getDeliveryClient();
    
    // Get all unique slugs from releases
    const entries = await client.getEntries({
      content_type: 'release',
      limit: 1000,
      order: '-sys.createdAt',
    });

    if (!entries.items || entries.items.length === 0) {
      console.log('[v0] No published pages found in Contentful');
      return [];
    }

    // Group releases by slug and get the latest version for each
    const releasesBySlug = new Map<string, ReleaseEntry>();

    for (const item of entries.items) {
      const entry = item as ReleaseEntry;
      const slug = entry.fields.slug;
      
      // Keep only the first (latest) version for each slug since results are ordered by createdAt
      if (!releasesBySlug.has(slug)) {
        releasesBySlug.set(slug, entry);
      }
    }

    const publishedPages: PublishedPageInfo[] = [];

    for (const [slug, entry] of releasesBySlug.entries()) {
      try {
        const releaseDataStr = entry.fields.releaseData;
        
        if (releaseDataStr) {
          const releaseData = JSON.parse(releaseDataStr);
          const page: PageModel = releaseData.page;
          
          publishedPages.push({
            id: entry.fields.pageId,
            title: entry.fields.pageTitle || page.fields.title,
            slug: slug,
            description: page.fields.description,
            publishedAt: entry.fields.publishedAt,
            version: entry.fields.version,
            author: 'System',
          });
        }
      } catch (error) {
        console.error(`Error parsing release for ${slug}:`, error);
      }
    }

    return publishedPages.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('[v0] Error getting published pages from Contentful:', error);
    return [];
  }
}
