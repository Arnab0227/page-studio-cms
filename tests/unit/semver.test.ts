import { describe, it, expect } from 'vitest';

function parseSemVer(version: string): { major: number; minor: number; patch: number } {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Invalid semantic version: ${version}`);
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function detectVersionBump(
  oldVersion: string,
  changes: {
    structureChanged?: boolean;
    componentsAdded?: boolean;
    componentsRemoved?: boolean;
    propsChanged?: boolean;
  }
): 'major' | 'minor' | 'patch' {
  const { major, minor, patch } = parseSemVer(oldVersion);

  if (changes.structureChanged || changes.componentsRemoved) {
    return 'major';
  }

  if (changes.componentsAdded || changes.propsChanged) {
    return 'minor';
  }

  return 'patch';
}

function nextVersion(
  currentVersion: string,
  bumpType: 'major' | 'minor' | 'patch'
): string {
  const { major, minor, patch } = parseSemVer(currentVersion);

  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

describe('Semantic Versioning', () => {
  describe('Version Parsing', () => {
    it('should parse valid semantic version', () => {
      const version = parseSemVer('1.2.3');
      expect(version).toEqual({ major: 1, minor: 2, patch: 3 });
    });

    it('should parse version with zeros', () => {
      const version = parseSemVer('0.0.1');
      expect(version).toEqual({ major: 0, minor: 0, patch: 1 });
    });

    it('should reject invalid version format', () => {
      expect(() => parseSemVer('1.2')).toThrow();
      expect(() => parseSemVer('v1.2.3')).toThrow();
      expect(() => parseSemVer('1.2.3.4')).toThrow();
    });
  });

  describe('Patch Version Bumps', () => {
    it('should bump patch version for minor content changes', () => {
      const bumpType = detectVersionBump('1.0.0', {});
      expect(bumpType).toBe('patch');
    });

    it('should bump patch from 1.0.0 to 1.0.1', () => {
      const nextVer = nextVersion('1.0.0', 'patch');
      expect(nextVer).toBe('1.0.1');
    });

    it('should bump patch from 1.5.9 to 1.5.10', () => {
      const nextVer = nextVersion('1.5.9', 'patch');
      expect(nextVer).toBe('1.5.10');
    });

    it('should handle many patch updates', () => {
      let version = '1.0.0';
      for (let i = 0; i < 5; i++) {
        version = nextVersion(version, 'patch');
      }
      expect(version).toBe('1.0.5');
    });
  });

  describe('Minor Version Bumps', () => {
    it('should bump minor version for new components/props', () => {
      const bumpType = detectVersionBump('1.0.0', {
        propsChanged: true,
      });
      expect(bumpType).toBe('minor');
    });

    it('should detect minor bump for added components', () => {
      const bumpType = detectVersionBump('1.0.0', {
        componentsAdded: true,
      });
      expect(bumpType).toBe('minor');
    });

    it('should bump minor from 1.0.0 to 1.1.0', () => {
      const nextVer = nextVersion('1.0.0', 'minor');
      expect(nextVer).toBe('1.1.0');
    });

    it('should reset patch version on minor bump', () => {
      const nextVer = nextVersion('1.5.9', 'minor');
      expect(nextVer).toBe('1.6.0');
    });

    it('should bump minor multiple times', () => {
      let version = '1.0.0';
      for (let i = 0; i < 3; i++) {
        version = nextVersion(version, 'minor');
      }
      expect(version).toBe('1.3.0');
    });
  });

  describe('Major Version Bumps', () => {
    it('should bump major version for structural changes', () => {
      const bumpType = detectVersionBump('1.0.0', {
        structureChanged: true,
      });
      expect(bumpType).toBe('major');
    });

    it('should bump major version when components removed', () => {
      const bumpType = detectVersionBump('1.5.3', {
        componentsRemoved: true,
      });
      expect(bumpType).toBe('major');
    });

    it('should bump major from 1.0.0 to 2.0.0', () => {
      const nextVer = nextVersion('1.0.0', 'major');
      expect(nextVer).toBe('2.0.0');
    });

    it('should reset minor and patch on major bump', () => {
      const nextVer = nextVersion('1.5.9', 'major');
      expect(nextVer).toBe('2.0.0');
    });

    it('should handle major version progression', () => {
      let version = '0.0.1';
      version = nextVersion(version, 'major');
      expect(version).toBe('1.0.0');
    });
  });

  describe('Complex Version Scenarios', () => {
    it('should handle mixed changes with major priority', () => {
      const bumpType = detectVersionBump('1.5.3', {
        structureChanged: true,
        componentsAdded: true,
        propsChanged: true,
      });
      expect(bumpType).toBe('major');
    });

    it('should handle mixed changes with minor priority', () => {
      const bumpType = detectVersionBump('1.5.3', {
        componentsAdded: true,
        propsChanged: true,
      });
      expect(bumpType).toBe('minor');
    });

    it('should follow version progression: 0.0.1 -> 0.1.0 -> 1.0.0 -> 1.1.0', () => {
      let version = '0.0.1';
      version = nextVersion(version, 'minor');
      expect(version).toBe('0.1.0');
      version = nextVersion(version, 'major');
      expect(version).toBe('1.0.0');
      version = nextVersion(version, 'minor');
      expect(version).toBe('1.1.0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle initial version release', () => {
      const nextVer = nextVersion('0.0.1', 'minor');
      expect(nextVer).toBe('0.1.0');
    });

    it('should handle large version numbers', () => {
      const nextVer = nextVersion('100.200.300', 'patch');
      expect(nextVer).toBe('100.200.301');
    });

    it('should handle version reset on major bump', () => {
      const nextVer = nextVersion('5.99.99', 'major');
      expect(nextVer).toBe('6.0.0');
    });
  });

  describe('Version Comparison', () => {
    it('should identify patch as lowest priority change', () => {
      const bump1 = detectVersionBump('1.0.0', {});
      const bump2 = detectVersionBump('1.0.0', { componentsAdded: true });
      const bump3 = detectVersionBump('1.0.0', { structureChanged: true });

      expect(bump1).toBe('patch');
      expect(bump2).toBe('minor');
      expect(bump3).toBe('major');
    });
  });
});
