import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  PageModelSchema,
  ButtonComponentSchema,
  CardComponentSchema,
  HeroComponentSchema,
  SectionComponentSchema,
  TextComponentSchema,
  GridComponentSchema,
  ContainerComponentSchema,
} from '@/lib/schema';


const ComponentSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  props: z.record(z.any()).optional(),
});

const PageSchema = z.object({
  sys: z.object({
    id: z.string(),
    type: z.literal('Entry'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    locale: z.string(),
    revision: z.number(),
    space: z.object({
      sys: z.object({
        id: z.string(),
        type: z.literal('Link'),
        linkType: z.string(),
      }),
    }),
    contentType: z.object({
      sys: z.object({
        id: z.string(),
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
      }),
    }),
  }),
  fields: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
    components: z.array(ComponentSchema).default([]),
    published: z.boolean().default(false),
  }),
});

describe('Schema Validation', () => {
  describe('Valid Page Data', () => {
    it('should accept valid page data', () => {
      const validPage = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locale: 'en-US',
          revision: 1,
          space: {
            sys: {
              id: 'space-1',
              type: 'Link' as const,
              linkType: 'Space',
            },
          },
          contentType: {
            sys: {
              id: 'page',
              type: 'Link' as const,
              linkType: 'ContentType' as const,
            },
          },
        },
        fields: {
          title: 'Home Page',
          slug: 'home',
          components: [],
          published: true,
        },
      };

      const result = PageModelSchema.safeParse(validPage);
      expect(result.success).toBe(true);
    });

    it('should accept page with components', () => {
      const pageWithComponents = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        fields: {
          title: 'Product Page',
          slug: 'products',
          components: [
            {
              id: 'comp-1',
              type: 'hero',
              props: {
                headline: 'Welcome',
                height: 'lg',
              },
            },
          ],
          published: false,
        },
      };

      const result = PageModelSchema.safeParse(pageWithComponents);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Page Data', () => {
    it('should reject page with missing title', () => {
      const invalidPage = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locale: 'en-US',
          revision: 1,
          space: {
            sys: {
              id: 'space-1',
              type: 'Link' as const,
              linkType: 'Space',
            },
          },
          contentType: {
            sys: {
              id: 'page',
              type: 'Link' as const,
              linkType: 'ContentType' as const,
            },
          },
        },
        fields: {
          slug: 'home',
          components: [],
          published: true,
        },
      };

      const result = PageModelSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
    });

    it('should reject page with empty slug', () => {
      const invalidPage = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locale: 'en-US',
          revision: 1,
          space: {
            sys: {
              id: 'space-1',
              type: 'Link' as const,
              linkType: 'Space',
            },
          },
          contentType: {
            sys: {
              id: 'page',
              type: 'Link' as const,
              linkType: 'ContentType' as const,
            },
          },
        },
        fields: {
          title: 'Home Page',
          slug: '',
          components: [],
          published: true,
        },
      };

      const result = PageModelSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
    });

    it('should reject page with invalid slug format', () => {
      const invalidPage = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locale: 'en-US',
          revision: 1,
          space: {
            sys: {
              id: 'space-1',
              type: 'Link' as const,
              linkType: 'Space',
            },
          },
          contentType: {
            sys: {
              id: 'page',
              type: 'Link' as const,
              linkType: 'ContentType' as const,
            },
          },
        },
        fields: {
          title: 'Home Page',
          slug: 'Home Page!',
          components: [],
          published: true,
        },
      };

      const result = PageModelSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
    });

    it('should reject page with missing required sys fields', () => {
      const invalidPage = {
        sys: {
          id: 'page-1',
        },
        fields: {
          title: 'Home Page',
          slug: 'home',
        },
      };

      const result = PageModelSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
    });
  });

  describe('Component Schema', () => {
    it('should accept valid component', () => {
      const validComponent = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'hero',
        props: {
          title: 'Welcome',
          description: 'To our site',
        },
      };

      const result = ComponentSchema.safeParse(validComponent);
      expect(result.success).toBe(true);
    });

    it('should reject component with invalid UUID', () => {
      const invalidComponent = {
        id: 'not-a-uuid',
        type: 'hero',
      };

      const result = ComponentSchema.safeParse(invalidComponent);
      expect(result.success).toBe(false);
    });

    it('should accept component without props', () => {
      const component = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'spacer',
      };

      const result = ComponentSchema.safeParse(component);
      expect(result.success).toBe(true);
    });
  });

  describe('Default Values', () => {
    it('should apply default values', () => {
      const pageData = {
        sys: {
          id: 'page-1',
          type: 'Entry' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locale: 'en-US',
          revision: 1,
          space: {
            sys: {
              id: 'space-1',
              type: 'Link' as const,
              linkType: 'Space',
            },
          },
          contentType: {
            sys: {
              id: 'page',
              type: 'Link' as const,
              linkType: 'ContentType' as const,
            },
          },
        },
        fields: {
          title: 'Home Page',
          slug: 'home',
        },
      };

      const result = PageSchema.safeParse(pageData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fields.components).toEqual([]);
        expect(result.data.fields.published).toBe(false);
      }
    });
  });
});
