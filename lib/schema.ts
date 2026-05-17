import { z } from 'zod';

export const LayoutSchema = z.object({
  margin: z.object({
    top: z.number().default(0),
    right: z.number().default(0),
    bottom: z.number().default(16),
    left: z.number().default(0),
  }).optional().default({ top: 0, right: 0, bottom: 16, left: 0 }),
  padding: z.object({
    top: z.number().default(0),
    right: z.number().default(0),
    bottom: z.number().default(0),
    left: z.number().default(0),
  }).optional().default({ top: 0, right: 0, bottom: 0, left: 0 }),
  width: z.number().optional(),
  height: z.number().optional(),
  alignment: z.enum(['left', 'center', 'right', 'full']).optional().default('left'),
  // Absolute positioning for draggable canvas
  _x: z.number().optional(),
  _y: z.number().optional(),
  _width: z.number().optional(),
  _height: z.union([z.number(), z.literal('auto')]).optional(),
}).optional();

export const BaseComponentSchema = z.object({
  id: z.string().min(1, 'Component ID is required'),
  type: z.string().min(1, 'Component type is required'),
  children: z.array(z.lazy(() => BuilderComponentSchema)).optional().default([]),
  props: z.record(z.any()).optional(),
  layout: LayoutSchema,
});


export const ButtonComponentSchema = BaseComponentSchema.extend({
  type: z.literal('button'),
  props: z.object({
    label: z.string().min(1, 'Label is required'),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    href: z.string().url().optional().or(z.literal('')).default(''),
    onClick: z.string().optional(),
  }),
});


export const CardComponentSchema = BaseComponentSchema.extend({
  type: z.literal('card'),
  props: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    image: z.object({
      src: z.string().url('Image URL must be valid').or(z.literal('')),
      alt: z.string().min(1, 'Alt text is required'),
    }).optional(),
    footer: z.string().optional(),
  }),
});


export const SectionComponentSchema: z.ZodType<any> = BaseComponentSchema.extend({
  type: z.literal('section'),
  props: z.object({
    title: z.string().optional(),
    layout: z.enum(['single', 'two-column', 'three-column', 'grid']).default('single'),
    backgroundColor: z.string().optional(),
    padding: z.enum(['sm', 'md', 'lg']).default('md'),
  }),
  children: z.lazy(() => BuilderComponentSchema.array()),
});


export const HeroComponentSchema = BaseComponentSchema.extend({
  type: z.literal('hero'),
  props: z.object({
    headline: z.string().min(1, 'Headline is required'),
    description: z.string().optional(),
    cta: z.object({
      label: z.string().min(1, 'CTA label is required'),
      href: z.string().url('CTA URL must be valid').or(z.literal('')),
    }).optional(),
    backgroundImage: z.string().url().optional().or(z.literal('')),
    height: z.enum(['sm', 'md', 'lg', 'full']).default('lg'),
  }),
});


export const GridComponentSchema: z.ZodType<any> = BaseComponentSchema.extend({
  type: z.literal('grid'),
  props: z.object({
    columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    gap: z.enum(['sm', 'md', 'lg']).default('md'),
    responsiveColumns: z.object({
      mobile: z.number().int().min(1).max(4),
      tablet: z.number().int().min(1).max(4),
      desktop: z.number().int().min(1).max(4),
    }).optional(),
  }),
  children: z.lazy(() => BuilderComponentSchema.array()),
});


export const TextComponentSchema = BaseComponentSchema.extend({
  type: z.literal('text'),
  props: z.object({
    content: z.string().min(1, 'Text content is required'),
    variant: z.enum(['h1', 'h2', 'h3', 'h4', 'p', 'small']).default('p'),
    color: z.string().optional(),
    textAlign: z.enum(['left', 'center', 'right']).default('left'),
  }),
});


export const ContainerComponentSchema: z.ZodType<any> = BaseComponentSchema.extend({
  type: z.literal('container'),
  props: z.object({
    className: z.string().optional(),
  }),
  children: z.lazy(() => BuilderComponentSchema.array()),
});


export const BuilderComponentSchema = z.union([
  ButtonComponentSchema,
  CardComponentSchema,
  SectionComponentSchema,
  HeroComponentSchema,
  GridComponentSchema,
  TextComponentSchema,
  ContainerComponentSchema,
]);


export const PageModelSchema = z.object({
  sys: z.object({
    id: z.string(),
    type: z.literal('Entry'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    publishedAt: z.string().datetime().optional(),
  }),
  fields: z.object({
    title: z.string().min(1, 'Page title is required'),
    slug: z.string().min(1, 'Page slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().optional(),
    published: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    components: z.array(BuilderComponentSchema),
  }),
});


export const ContentfulResponseSchema = z.object({
  sys: z.object({
    type: z.literal('Array'),
  }),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  items: z.array(z.unknown()),
});


export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).optional(),
  timestamp: z.string().datetime(),
});


export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.record(z.array(z.string())).optional(),
});


export type ButtonComponent = z.infer<typeof ButtonComponentSchema>;
export type CardComponent = z.infer<typeof CardComponentSchema>;
export type SectionComponent = z.infer<typeof SectionComponentSchema>;
export type HeroComponent = z.infer<typeof HeroComponentSchema>;
export type GridComponent = z.infer<typeof GridComponentSchema>;
export type TextComponent = z.infer<typeof TextComponentSchema>;
export type ContainerComponent = z.infer<typeof ContainerComponentSchema>;
export type BuilderComponent = z.infer<typeof BuilderComponentSchema>;
export type PageModel = z.infer<typeof PageModelSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
