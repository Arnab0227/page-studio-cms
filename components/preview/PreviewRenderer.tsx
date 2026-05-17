import React from 'react';
import { BuilderComponentSchema, PageModelSchema } from '@/lib/schema';
import { Button } from '../builder/Button';
import { Card } from '../builder/Card';
import { Text } from '../builder/Text';
import { Section } from '../builder/Section';
import { Hero } from '../builder/Hero';
import { Grid } from '../builder/Grid';
import { Container } from '../builder/Container';
import UnsupportedSection from './UnsupportedSection';
import type { BuilderComponent } from '@/lib/schema';

interface PreviewRendererProps {
  components: unknown;
  isDraftMode?: boolean;
}

function validateComponent(component: unknown): BuilderComponent | null {
  const result = BuilderComponentSchema.safeParse(component);
  
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[PreviewRenderer] Invalid component:', result.error);
    }
    return null;
  }
  
  return result.data;
}

function getLayoutStyles(component: any): { className: string; style: React.CSSProperties } {
  const props = component.props || {};
  const layout = component.layout || {};
  
  const style: React.CSSProperties = {};
  const classes: string[] = [];
  
  const posX = layout._x ?? props._x;
  const posY = layout._y ?? props._y;
  const hasPositioning = typeof posX === 'number' || typeof posY === 'number';
  
  if (hasPositioning) {
    style.position = 'absolute';
    if (typeof posX === 'number') style.left = `${posX}px`;
    if (typeof posY === 'number') style.top = `${posY}px`;
    
    const width = layout._width ?? props._width;
    if (typeof width === 'number') style.width = `${width}px`;
    
    const height = layout._height ?? props._height;
    if (typeof height === 'number') {
      style.height = `${height}px`;
    } else if (height === 'auto') {
      style.height = 'auto';
    }
    style.zIndex = 1;
    return { className: classes.join(' '), style };
  }
  
  if (layout.alignment === 'center') {
    classes.push('mx-auto');
  } else if (layout.alignment === 'right') {
    classes.push('ml-auto');
  }
  
  if (layout.alignment === 'full') {
    classes.push('w-full');
  }
  
  if (layout.width) {
    style.width = `${layout.width}px`;
  }
  if (layout.height) {
    style.height = `${layout.height}px`;
  }
  
  const margin = layout.margin || {};
  if (margin.top) style.marginTop = `${margin.top}px`;
  if (margin.right) style.marginRight = `${margin.right}px`;
  if (margin.bottom) style.marginBottom = `${margin.bottom}px`;
  if (margin.left) style.marginLeft = `${margin.left}px`;
  
  const padding = layout.padding || {};
  if (padding.top) style.paddingTop = `${padding.top}px`;
  if (padding.right) style.paddingRight = `${padding.right}px`;
  if (padding.bottom) style.paddingBottom = `${padding.bottom}px`;
  if (padding.left) style.paddingLeft = `${padding.left}px`;
  
  return { className: classes.join(' '), style };
}

function renderComponent(
  component: BuilderComponent,
  renderChildren?: (children: unknown) => React.ReactNode
): React.ReactNode {
  try {
    const { className, style } = getLayoutStyles(component);
    
    switch (component.type) {
      case 'button':
        return (
          <div key={component.id} className={`inline-block ${className}`} style={style}>
            <Button
              label={(component.props as any).label}
              variant={(component.props as any).variant}
              size={(component.props as any).size}
              href={(component.props as any).href}
            />
          </div>
        );

      case 'text':
        return (
          <div key={component.id} className={className} style={style}>
            <Text
              content={(component.props as any).content}
              variant={(component.props as any).variant}
              textAlign={(component.props as any).textAlign}
            />
          </div>
        );

      case 'card':
        return (
          <div key={component.id} className={className} style={style}>
            <Card
              title={(component.props as any).title}
              description={(component.props as any).description}
              image={(component.props as any).image}
              footer={(component.props as any).footer}
            />
          </div>
        );

      case 'hero':
        return (
          <div key={component.id} className={className} style={style}>
            <Hero
              headline={(component.props as any).headline}
              description={(component.props as any).description}
              cta={(component.props as any).cta}
              backgroundImage={(component.props as any).backgroundImage}
              height={(component.props as any).height}
            />
          </div>
        );

      case 'section':
        return (
          <div key={component.id} className={className} style={style}>
            <Section
              title={(component.props as any).title}
              layout={(component.props as any).layout}
              backgroundColor={(component.props as any).backgroundColor}
              padding={(component.props as any).padding}
            >
              {renderChildren?.((component as any).children) || null}
            </Section>
          </div>
        );

      case 'grid':
        return (
          <div key={component.id} className={className} style={style}>
            <Grid
              columns={(component.props as any).columns}
              gap={(component.props as any).gap}
              responsiveColumns={(component.props as any).responsiveColumns}
            >
              {renderChildren?.((component as any).children) || null}
            </Grid>
          </div>
        );

      case 'container':
        return (
          <div key={component.id} className={className} style={style}>
            <Container
              className={(component.props as any).className}
            >
              {renderChildren?.((component as any).children) || null}
            </Container>
          </div>
        );

      default:
        return (
          <UnsupportedSection
            key={component.id}
            type={component.type}
            reason="Unknown component type"
          />
        );
    }
  } catch (error) {
    console.error('[PreviewRenderer] Error rendering component:', error);
    return (
      <UnsupportedSection
        key={component.id}
        type={component.type}
        reason="Component render error"
      />
    );
  }
}

function renderChildren(children: unknown): React.ReactNode {
  if (!Array.isArray(children)) {
    return null;
  }

  const validatedChildren = children
    .map((child) => validateComponent(child))
    .filter((child): child is BuilderComponent => child !== null);

  if (validatedChildren.length === 0) {
    return null;
  }

  return validatedChildren.map((child) =>
    renderComponent(child, renderChildren)
  );
}


export const PreviewRenderer: React.FC<PreviewRendererProps> = ({
  components,
  isDraftMode = false,
}) => {
  if (!Array.isArray(components)) {
    return (
      <UnsupportedSection
        type="invalid"
        reason="Components must be an array"
      />
    );
  }

  const validatedComponents = components
    .map((comp) => validateComponent(comp))
    .filter((comp): comp is BuilderComponent => comp !== null);

  if (validatedComponents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No valid components to display</p>
        {isDraftMode && process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-400 mt-2">
            Draft mode: Check the console for validation errors
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {validatedComponents.map((component) =>
        renderComponent(component, renderChildren)
      )}
    </div>
  );
};

PreviewRenderer.displayName = 'PreviewRenderer';
