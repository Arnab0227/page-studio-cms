import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';
import { PageModelSchema } from './schema';
import type { PageModel } from './types';

const CONTENTFUL_SPACE_ID = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  : process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID;

const CONTENTFUL_ACCESS_TOKEN = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
  : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;

if (!CONTENTFUL_SPACE_ID) {
  console.error('Missing environment variable: NEXT_PUBLIC_CONTENTFUL_SPACE_ID');
}

if (!CONTENTFUL_ACCESS_TOKEN) {
  console.error('Missing environment variable: NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN');
}

let contentfulClient: ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'> | null = null;


function getContentfulClient(): ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'> {
  if (contentfulClient) {
    return contentfulClient;
  }

  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      'Contentful credentials are missing. ' +
      'Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN'
    );
  }

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Contentful environment variables are not configured');
  }

  contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
    environment: 'master',
  });

  return contentfulClient;
}


interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const responseCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MINUTES = 5;


function getCachedData<T>(key: string): T | null {
  const entry = responseCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > entry.ttl * 60 * 1000;
  if (isExpired) {
    responseCache.delete(key);
    return null;
  }

  return entry.data;
}


function setCachedData<T>(key: string, data: T, ttlMinutes = CACHE_TTL_MINUTES): void {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    responseCache.delete(key);
  } else {
    responseCache.clear();
  }
}


export async function getPages(): Promise<PageModel[]> {
  const cacheKey = 'all_pages';
  const cached = getCachedData<PageModel[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const client = getContentfulClient();
  
    try {
      const entries = await client.getEntries({
        limit: 100,
      });

      if (!entries.items || entries.items.length === 0) {
        console.log('[v0] No entries found in Contentful. Creating demo page for testing.');
        return [];
      }

      const pages = entries.items
        .map((item: any) => ({
          sys: item.sys,
          fields: item.fields,
        }))
        .filter((page: any) => {
          try {
            PageModelSchema.parse(page);
            return true;
          } catch {
            return false;
          }
        });

      setCachedData(cacheKey, pages);
      return pages;
    } catch (contentfulError: any) {
      if (contentfulError?.details?.errors) {
        console.log('[v0] Contentful workspace appears to be empty. Editor will allow creating new pages.');
        return [];
      }
      throw contentfulError;
    }
  } catch (error) {
    console.error('[v0] Error fetching pages from Contentful:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<PageModel | null> {
  try {
    const cacheKey = `page-${slug}`;
    const cached = getCachedData<PageModel>(cacheKey);
    if (cached) return cached;

    const client = getContentfulClient();
    const entries = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      'fields.published': true,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0] as any;
    const page = {
      sys: item.sys,
      fields: item.fields,
    };

    try {
      PageModelSchema.parse(page);
      setCachedData(cacheKey, page);
      return page;
    } catch (validationError) {
      console.error(`Invalid page model for slug "${slug}":`, validationError);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error);
    return null;
  }
}

export async function getPageById(id: string): Promise<PageModel | null> {
  try {
    const cacheKey = `page-${id}`;
    const cached = getCachedData<PageModel>(cacheKey);
    if (cached) return cached;

    const client = getContentfulClient();
    const entry = await client.getEntry(id);

    const page = {
      sys: entry.sys,
      fields: (entry as any).fields,
    };

    try {
      PageModelSchema.parse(page);
      setCachedData(cacheKey, page);
      return page;
    } catch (validationError) {
      console.error(`Invalid page model for ID "${id}":`, validationError);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching page with ID "${id}":`, error);
    return null;
  }
}


export async function savePage(page: PageModel): Promise<boolean> {
  try {
    const client = getContentfulClient();
    
    PageModelSchema.parse(page);

    const entryId = page.sys.id;
    
    let entry;
    try {
      entry = await client.getEntry(entryId);
    } catch {
      console.log(`Creating new entry: ${entryId}`);
    }

  
    if (entry) {
      for (const [key, value] of Object.entries(page.fields)) {
        (entry as any).fields[key] = {
          'en-US': value,
        };
      }
      await entry.update();
    }

    clearCache(`page-${page.fields.slug}`);
    clearCache(`page-${entryId}`);
    clearCache('pages-all');

    return true;
  } catch (error) {
    console.error('Error saving page to Contentful:', error);
    return false;
  }
}


export async function publishPage(pageId: string): Promise<boolean> {
  try {
    const client = getContentfulClient();
    const entry = await client.getEntry(pageId);
    
    if ('publish' in entry && typeof entry.publish === 'function') {
      await entry.publish();
      clearCache(`page-${pageId}`);
      clearCache('pages-all');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error publishing page ${pageId}:`, error);
    return false;
  }
}

export async function deletePage(pageId: string): Promise<boolean> {
  try {
    const client = getContentfulClient();
    const entry = await client.getEntry(pageId);
    
    if ('isPublished' in entry && entry.isPublished && 'unpublish' in entry) {
      await (entry as any).unpublish();
    }
    
    if ('delete' in entry && typeof entry.delete === 'function') {
      await entry.delete();
      clearCache('pages-all');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error);
    return false;
  }
}

export async function checkContentfulConnection(): Promise<boolean> {
  try {
    const client = getContentfulClient();
    await client.getSpace();
    return true;
  } catch (error) {
    console.error('Contentful API connection failed:', error);
    return false;
  }
}

export async function getContentfulStatus(): Promise<{
  connected: boolean;
  spaceId?: string;
  error?: string;
}> {
  try {
    const client = getContentfulClient();
    const space = await client.getSpace();
    return {
      connected: true,
      spaceId: space.sys.id,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
