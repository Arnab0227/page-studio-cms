import type { PageModel, BuilderComponent } from '@/lib/schema';
import { createHash } from 'crypto';

export type VersionBump = 'major' | 'minor' | 'patch';


export function calculateContentHash(
  page: PageModel,
  components: BuilderComponent[]
): string {
  const content = JSON.stringify({
    title: page.fields.title,
    slug: page.fields.slug,
    components,
  });

  return createHash('sha256').update(content).digest('hex');
}

function parseVersion(version: string): [number, number, number] {
  const parts = version.split('.').map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}


function formatVersion(major: number, minor: number, patch: number): string {
  return `${major}.${minor}.${patch}`;
}


export function bumpVersion(currentVersion: string, bump: VersionBump): string {
  const [major, minor, patch] = parseVersion(currentVersion);

  switch (bump) {
    case 'major':
      return formatVersion(major + 1, 0, 0);
    case 'minor':
      return formatVersion(major, minor + 1, 0);
    case 'patch':
      return formatVersion(major, minor, patch + 1);
  }
}


function isSameComponent(a: BuilderComponent, b: BuilderComponent): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}


function isBreakingPropChange(propName: string, oldValue: any, newValue: any): boolean {
  const requiredProps = ['label', 'content', 'headline'];

  if (requiredProps.includes(propName)) {
    if (oldValue && !newValue) {
      return true;
    }
  }

  return false;
}


export function detectVersionBump(
  previousComponents: BuilderComponent[] | undefined,
  currentComponents: BuilderComponent[]
): VersionBump {
  const prevComps = previousComponents || [];
  let hasMajorChange = false;
  let hasMinorChange = false;

  const prevMap = new Map(prevComps.map((c) => [c.id, c]));
  const currMap = new Map(currentComponents.map((c) => [c.id, c]));

  for (const [id, _] of prevMap) {
    if (!currMap.has(id)) {
      hasMajorChange = true;
      break;
    }
  }

  for (const [id, currComp] of currMap) {
    const prevComp = prevMap.get(id);

    if (!prevComp) {
      if (['section', 'grid', 'container'].includes(currComp.type)) {
        hasMinorChange = true;
      }
      continue;
    }

    if (prevComp.type !== currComp.type) {
      hasMajorChange = true;
      break;
    }

    if (prevComp.props !== currComp.props) {
      const prevProps = prevComp.props as any;
      const currProps = currComp.props as any;

      for (const [propName, oldValue] of Object.entries(prevProps)) {
        const newValue = currProps[propName];

        if (oldValue !== newValue) {
          if (isBreakingPropChange(propName, oldValue, newValue)) {
            hasMajorChange = true;
            break;
          }

          hasMinorChange = true;
        }
      }

      for (const [propName, newValue] of Object.entries(currProps)) {
        if (!(propName in prevProps) && newValue !== undefined) {
          hasMinorChange = true;
        }
      }
    }

    if (hasMajorChange) {
      break;
    }
  }

  if (hasMajorChange) {
    return 'major';
  }

  if (hasMinorChange) {
    return 'minor';
  }

  return 'patch';
}


export function calculateNextVersion(
  currentVersion: string,
  previousComponents: BuilderComponent[] | undefined,
  currentComponents: BuilderComponent[]
): string {
  const bump = detectVersionBump(previousComponents, currentComponents);
  return bumpVersion(currentVersion, bump);
}
