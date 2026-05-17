import fs from 'fs/promises';
import path from 'path';
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

export async function getPublishedPages(): Promise<PublishedPageInfo[]> {
  try {
    const releasesDir = path.join(process.cwd(), 'releases');

    try {
      await fs.access(releasesDir);
    } catch {
      return []; // No releases yet
    }

    const items = await fs.readdir(releasesDir);
    const publishedPages: PublishedPageInfo[] = [];

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

          const releasePath = path.join(
            slugDir,
            `${latestVersion.version}.json`
          );
          const releaseContent = await fs.readFile(releasePath, 'utf-8');
          const release = JSON.parse(releaseContent);

          publishedPages.push({
            id: release.page.sys.id,
            title: release.page.fields.title,
            slug: slug,
            description: release.page.fields.description,
            publishedAt: release.metadata.publishedAt,
            version: latestVersion.version,
            author: 'System',
          });
        }
      } catch (error) {
        console.error(`Error reading release for ${slug}:`, error);
      }
    }

    return publishedPages.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error getting published pages:', error);
    return [];
  }
}
