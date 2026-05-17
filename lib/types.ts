export interface BaseComponentProps {
  id: string;
  type: ComponentType;
  children?: BuilderComponent[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
  };
}

export type ComponentType = 
  | 'button' 
  | 'card' 
  | 'section' 
  | 'hero' 
  | 'grid' 
  | 'text' 
  | 'container';


export interface ButtonComponent extends BaseComponentProps {
  type: 'button';
  props: {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    onClick?: string;
  };
}

export interface CardComponent extends BaseComponentProps {
  type: 'card';
  props: {
    title: string;
    description?: string;
    image?: {
      src: string;
      alt: string;
    };
    footer?: string;
  };
}

export interface SectionComponent extends BaseComponentProps {
  type: 'section';
  props: {
    title?: string;
    layout: 'single' | 'two-column' | 'three-column' | 'grid';
    backgroundColor?: string;
    padding?: 'sm' | 'md' | 'lg';
  };
  children: BuilderComponent[];
}


export interface HeroComponent extends BaseComponentProps {
  type: 'hero';
  props: {
    headline: string;
    description?: string;
    cta?: {
      label: string;
      href: string;
    };
    backgroundImage?: string;
    height?: 'sm' | 'md' | 'lg' | 'full';
  };
}


export interface GridComponent extends BaseComponentProps {
  type: 'grid';
  props: {
    columns: 1 | 2 | 3 | 4;
    gap: 'sm' | 'md' | 'lg';
    responsiveColumns?: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  children: BuilderComponent[];
}


export interface TextComponent extends BaseComponentProps {
  type: 'text';
  props: {
    content: string;
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}


export interface ContainerComponent extends BaseComponentProps {
  type: 'container';
  props: {
    className?: string;
  };
  children: BuilderComponent[];
}

export type BuilderComponent = 
  | ButtonComponent 
  | CardComponent 
  | SectionComponent 
  | HeroComponent 
  | GridComponent 
  | TextComponent 
  | ContainerComponent;


export interface PageModel {
  sys: {
    id: string;
    type: 'Entry';
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
  fields: {
    title: string;
    slug: string;
    description?: string;
    published: boolean;
    seoTitle?: string;
    seoDescription?: string;
    components: BuilderComponent[];
  };
}

export interface ContentfulResponse<T> {
  sys: {
    type: 'Array';
  };
  total: number;
  skip: number;
  limit: number;
  items: T[];
}


export interface EditorState {
  currentPage: PageModel | null;
  selectedComponentId: string | null;
  components: BuilderComponent[];
  history: BuilderComponent[][];
  historyIndex: number;
  unsavedChanges: boolean;
  isSaving: boolean;
}

export interface HistoryEntry {
  components: BuilderComponent[];
  timestamp: number;
  action: string;
}


export interface DragItem {
  id: string;
  type: ComponentType;
  index: number;
}


export interface PaletteItem {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  defaultProps: Record<string, unknown>;
}


export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}
