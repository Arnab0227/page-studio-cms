import { writeFile, readFile, mkdir } from 'fs/promises';
import { resolve } from 'path';
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


export interface VersionIndex {
  slug: string;
  versions: {
    version: string;
    publishedAt: string;
    contentHash: string;
  }[];
}

const RELEASES_DIR = resolve(process.cwd(), 'releases');


function getReleaseFilePath(slug: string, version: string): string {
  return resolve(RELEASES_DIR, slug, `${version}.json`);
}


function getVersionIndexPath(slug: string): string {
  return resolve(RELEASES_DIR, slug, '_index.json');
}

/**
 * Create necessary directories
 */
async function ensureDirExists(slug: string): Promise<void> {
  try {
    await mkdir(resolve(RELEASES_DIR, slug), { recursive: true });
  } catch (error) {
    // Directory might already exist, that's okay
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}


export async function saveRelease(
  slug: string,
  version: string,
  page: PageModel,
  components: BuilderComponent[],
  changelog: string[],
  contentHash: string
): Promise<ReleaseFile> {
  await ensureDirExists(slug);

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

  const filePath = getReleaseFilePath(slug, version);

  await writeFile(filePath, JSON.stringify(releaseFile, null, 2), 'utf-8');

  await updateVersionIndex(slug, version, contentHash);

  return releaseFile;
}


export async function getRelease(
  slug: string,
  version: string
): Promise<ReleaseFile | null> {
  try {
    const filePath = getReleaseFilePath(slug, version);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}


export async function getLatestRelease(slug: string): Promise<ReleaseFile | null> {
  try {
    const index = await getVersionIndex(slug);
    if (!index || index.versions.length === 0) {
      return null;
    }

    const latestVersion = index.versions[index.versions.length - 1];
    return getRelease(slug, latestVersion.version);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}


export async function getAllReleases(slug: string): Promise<ReleaseFile[]> {
  try {
    const index = await getVersionIndex(slug);
    if (!index) {
      return [];
    }

    const releases = await Promise.all(
      index.versions.map((v) => getRelease(slug, v.version))
    );

    return releases.filter((r): r is ReleaseFile => r !== null);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}


async function getVersionIndex(slug: string): Promise<VersionIndex | null> {
  try {
    const indexPath = getVersionIndexPath(slug);
    const content = await readFile(indexPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function updateVersionIndex(
  slug: string,
  version: string,
  contentHash: string
): Promise<void> {
  const indexPath = getVersionIndexPath(slug);

  try {
    let index: VersionIndex;
    try {
      const content = await readFile(indexPath, 'utf-8');
      index = JSON.parse(content);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        index = { slug, versions: [] };
      } else {
        throw error;
      }
    }

    if (!index.versions.find((v) => v.version === version)) {
      index.versions.push({
        version,
        publishedAt: new Date().toISOString(),
        contentHash,
      });

      await writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('[ReleaseStorage] Error updating version index:', error);
    throw error;
  }
}

export async function findReleaseByContentHash(
  slug: string,
  contentHash: string
): Promise<ReleaseFile | null> {
  try {
    const index = await getVersionIndex(slug);
    if (!index) {
      return null;
    }

    const matchingVersion = index.versions.find((v) => v.contentHash === contentHash);
    if (!matchingVersion) {
      return null;
    }

    return getRelease(slug, matchingVersion.version);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
