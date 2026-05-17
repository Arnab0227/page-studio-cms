import type { PageModel, BuilderComponent } from '@/lib/schema';
import { getLatestRelease, type ReleaseFile } from './releaseStorage';

export async function getPublishedPageBySlug(
  slug: string
): Promise<{ page: PageModel; components: BuilderComponent[] } | null> {
  try {
    const release = await getLatestRelease(slug);
    if (!release) {
      return null;
    }

    return {
      page: release.page,
      components: release.components,
    };
  } catch (error) {
    console.error('[v0] Error fetching published page:', error);
    return null;
  }
}

export async function fetchPublishedPageBySlug(
  slug: string
): Promise<{ page: PageModel; components: BuilderComponent[] } | null> {
  try {
    const response = await fetch(`/api/releases/${slug}`, {
      cache: 'revalidate',
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const release = await response.json();
    return {
      page: release.page,
      components: release.components,
    };
  } catch (error) {
    console.error('[v0] Error fetching published page from API:', error);
    return null;
  }
}
