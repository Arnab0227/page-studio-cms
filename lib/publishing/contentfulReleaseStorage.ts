import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';
import type { PageModel, BuilderComponent } from '@/lib/schema';

export interface ReleaseMetadata {
  version: string;
  publishedAt: string;
  slug: string;
  changelog: string[];
  pageId: string;
  contentHash: string;
}

export interface ReleaseFile {
  metadata: ReleaseMetadata;
  page: PageModel;
  components: BuilderComponent[];
}

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;

let managementClient: any = null;
let deliveryClient: ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'> | null = null;

function getManagementClient() {
  if (managementClient) {
    return managementClient;
  }

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Contentful credentials are missing');
  }

  managementClient = createManagementClient({
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  return managementClient;
}

function getDeliveryClient() {
  if (deliveryClient) {
    return deliveryClient;
  }

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Contentful credentials are missing');
  }

  deliveryClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
    environment: 'master',
  });

  return deliveryClient;
}

export async function saveRelease(
  slug: string,
  version: string,
  page: PageModel,
  components: BuilderComponent[],
  changelog: string[],
  contentHash: string
): Promise<ReleaseFile> {
  try {
    const metadata: ReleaseMetadata = {
      version,
      publishedAt: new Date().toISOString(),
      slug,
      changelog,
      pageId: page.sys.id,
      contentHash,
    };

    const releaseFile: ReleaseFile = {
      metadata,
      page,
      components,
    };

    const client = getManagementClient();
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Create a release entry in Contentful
    const releaseEntry = await environment.createEntry('release', {
      fields: {
        version: { 'en-US': version },
        slug: { 'en-US': slug },
        pageId: { 'en-US': page.sys.id },
        pageTitle: { 'en-US': page.fields.title },
        publishedAt: { 'en-US': new Date().toISOString() },
        contentHash: { 'en-US': contentHash },
        changelog: { 'en-US': changelog.join('\n') },
        // Store the full release data as JSON string
        releaseData: { 'en-US': JSON.stringify(releaseFile) },
      },
    });

    // Publish the entry
    await releaseEntry.publish();

    console.log('[v0] Release saved to Contentful:', version);
    return releaseFile;
  } catch (error) {
    console.error('[v0] Error saving release to Contentful:', error);
    throw error;
  }
}

export async function getRelease(
  slug: string,
  version: string
): Promise<ReleaseFile | null> {
  try {
    const client = getDeliveryClient();
    const entries = await client.getEntries({
      content_type: 'release',
      'fields.slug': slug,
      'fields.version': version,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0] as any;
    const releaseDataStr = item.fields.releaseData;
    
    if (!releaseDataStr) {
      return null;
    }

    return JSON.parse(releaseDataStr) as ReleaseFile;
  } catch (error) {
    console.error('[v0] Error getting release from Contentful:', error);
    return null;
  }
}

export async function getLatestRelease(slug: string): Promise<ReleaseFile | null> {
  try {
    const client = getDeliveryClient();
    const entries = await client.getEntries({
      content_type: 'release',
      'fields.slug': slug,
      order: '-sys.createdAt',
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0] as any;
    const releaseDataStr = item.fields.releaseData;
    
    if (!releaseDataStr) {
      return null;
    }

    return JSON.parse(releaseDataStr) as ReleaseFile;
  } catch (error) {
    console.error('[v0] Error getting latest release from Contentful:', error);
    return null;
  }
}

export async function getAllReleases(slug: string): Promise<ReleaseFile[]> {
  try {
    const client = getDeliveryClient();
    const entries = await client.getEntries({
      content_type: 'release',
      'fields.slug': slug,
      order: '-sys.createdAt',
      limit: 100,
    });

    const releases: ReleaseFile[] = [];
    for (const item of entries.items) {
      const releaseDataStr = (item as any).fields.releaseData;
      if (releaseDataStr) {
        releases.push(JSON.parse(releaseDataStr) as ReleaseFile);
      }
    }

    return releases;
  } catch (error) {
    console.error('[v0] Error getting all releases from Contentful:', error);
    return [];
  }
}

export async function findReleaseByContentHash(
  slug: string,
  contentHash: string
): Promise<ReleaseFile | null> {
  try {
    const client = getDeliveryClient();
    const entries = await client.getEntries({
      content_type: 'release',
      'fields.slug': slug,
      'fields.contentHash': contentHash,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0] as any;
    const releaseDataStr = item.fields.releaseData;
    
    if (!releaseDataStr) {
      return null;
    }

    return JSON.parse(releaseDataStr) as ReleaseFile;
  } catch (error) {
    console.error('[v0] Error finding release by content hash:', error);
    return null;
  }
}
