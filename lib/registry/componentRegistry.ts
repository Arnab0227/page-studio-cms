import type { BuilderComponent } from '@/lib/schema';

export type ComponentType =
  | 'button'
  | 'text'
  | 'card'
  | 'hero'
  | 'section'
  | 'grid'
  | 'container';


export interface ComponentMetadata {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'layout' | 'interactive';
  canHaveChildren: boolean;
  defaultProps: Record<string, any>;
}


export const COMPONENT_REGISTRY: Record<ComponentType, ComponentMetadata> = {
  button: {
    type: 'button',
    name: 'Button',
    description: 'Interactive button with variants and sizes',
    icon: '🔘',
    category: 'interactive',
    canHaveChildren: false,
    defaultProps: {
      label: 'Click me',
      variant: 'primary',
      size: 'md',
    },
  },
  text: {
    type: 'text',
    name: 'Text',
    description: 'Text content with typography variants',
    icon: '📝',
    category: 'content',
    canHaveChildren: false,
    defaultProps: {
      content: 'Add your text here',
      variant: 'p',
      textAlign: 'left',
    },
  },
  card: {
    type: 'card',
    name: 'Card',
    description: 'Container with image, title, and description',
    icon: '🎴',
    category: 'layout',
    canHaveChildren: false,
    defaultProps: {
      title: 'Card Title',
      description: 'Card description',
    },
  },
  hero: {
    type: 'hero',
    name: 'Hero',
    description: 'Large banner section with headline and CTA',
    icon: '🎯',
    category: 'layout',
    canHaveChildren: false,
    defaultProps: {
      headline: 'Welcome to Your Page',
      description: 'Add a compelling description',
      height: 'full',
    },
  },
  section: {
    type: 'section',
    name: 'Section',
    description: 'Container for organizing content',
    icon: '📦',
    category: 'layout',
    canHaveChildren: true,
    defaultProps: {
      layout: 'default',
      backgroundColor: 'white',
      padding: 'md',
    },
  },
  grid: {
    type: 'grid',
    name: 'Grid',
    description: 'Responsive grid layout',
    icon: '⊞',
    category: 'layout',
    canHaveChildren: true,
    defaultProps: {
      columns: 3,
      gap: 'md',
    },
  },
  container: {
    type: 'container',
    name: 'Container',
    description: 'Max-width wrapper container',
    icon: '▭',
    category: 'layout',
    canHaveChildren: true,
    defaultProps: {
      className: 'max-w-7xl',
    },
  },
};

/**
 * Get component metadata by type
 */
export function getComponentMetadata(type: ComponentType): ComponentMetadata | null {
  return COMPONENT_REGISTRY[type] || null;
}

/**
 * Get all components in a category
 */
export function getComponentsByCategory(
  category: 'content' | 'layout' | 'interactive'
): ComponentMetadata[] {
  return Object.values(COMPONENT_REGISTRY).filter((c) => c.category === category);
}

/**
 * Get all available component types
 */
export function getAllComponentTypes(): ComponentType[] {
  return Object.keys(COMPONENT_REGISTRY) as ComponentType[];
}

/**
 * Check if component type exists
 */
export function isValidComponentType(type: string): type is ComponentType {
  return type in COMPONENT_REGISTRY;
}

/**
 * Check if component can have children
 */
export function canComponentHaveChildren(type: ComponentType): boolean {
  const metadata = COMPONENT_REGISTRY[type];
  return metadata?.canHaveChildren || false;
}
