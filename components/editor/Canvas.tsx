import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComponent, updateComponent, selectComponent as selectComponentAction } from '@/lib/store';
import { createDefaultComponent } from '@/lib/store';
import { Button } from '../builder/Button';
import { Card } from '../builder/Card';
import { Text } from '../builder/Text';
import { Section } from '../builder/Section';
import { Hero } from '../builder/Hero';
import { Grid } from '../builder/Grid';
import { Container } from '../builder/Container';
import type { BuilderComponent } from '@/lib/schema';
import type { RootState } from '@/lib/store';
import { cn } from '@/lib/utils';

interface CanvasProps {
  onComponentSelect?: (id: string) => void;
}


const getLayoutClasses = (layout: any): string => {
  if (!layout) return '';
  
  const classes: string[] = [];
  
  if (layout.alignment === 'center') {
    classes.push('mx-auto');
  } else if (layout.alignment === 'right') {
    classes.push('ml-auto');
  }
  
  if (layout.alignment === 'full') {
    classes.push('w-full');
  }
  
  const margin = layout.margin || {};
  if (margin.top >= 4) classes.push(`mt-${Math.round(margin.top / 4)}`);
  if (margin.right >= 4) classes.push(`mr-${Math.round(margin.right / 4)}`);
  if (margin.bottom >= 4) classes.push(`mb-${Math.round(margin.bottom / 4)}`);
  if (margin.left >= 4) classes.push(`ml-${Math.round(margin.left / 4)}`);
  
  const padding = layout.padding || {};
  if (padding.top >= 4) classes.push(`pt-${Math.round(padding.top / 4)}`);
  if (padding.right >= 4) classes.push(`pr-${Math.round(padding.right / 4)}`);
  if (padding.bottom >= 4) classes.push(`pb-${Math.round(padding.bottom / 4)}`);
  if (padding.left >= 4) classes.push(`pl-${Math.round(padding.left / 4)}`);
  
  return classes.join(' ');
};

const renderComponent = (
  component: BuilderComponent,
  isSelected: boolean,
  onSelect: (id: string) => void,
  renderChildren?: (children: BuilderComponent[] | undefined) => React.ReactNode
): React.ReactNode => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const layoutClasses = getLayoutClasses((component as any).layout);
  const baseClasses = cn(
    'relative group cursor-pointer transition-all',
    isSelected && 'ring-2 ring-blue-500 ring-inset',
    layoutClasses
  );

  switch (component.type) {
    case 'button':
      return (
        <div key={component.id} className={baseClasses} onClick={handleClick}>
          <Button
            label={(component.props as any).label}
            variant={(component.props as any).variant}
            size={(component.props as any).size}
            href={(component.props as any).href}
          />
          {isSelected && (
            <div className="absolute top-0 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded -mt-6 pointer-events-none">
              Button
            </div>
          )}
        </div>
      );

    case 'text':
      return (
        <div key={component.id} className={baseClasses} onClick={handleClick}>
          <Text
            content={(component.props as any).content}
            variant={(component.props as any).variant}
            textAlign={(component.props as any).textAlign}
          />
          {isSelected && (
            <div className="absolute top-0 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded -mt-6 pointer-events-none">
              Text
            </div>
          )}
        </div>
      );

    case 'card':
      return (
        <div key={component.id} className={baseClasses} onClick={handleClick}>
          <Card
            title={(component.props as any).title}
            description={(component.props as any).description}
            image={(component.props as any).image}
            footer={(component.props as any).footer}
          />
          {isSelected && (
            <div className="absolute top-0 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded -mt-6 pointer-events-none">
              Card
            </div>
          )}
        </div>
      );

    case 'hero':
      return (
        <div
          key={component.id}
          className={cn(baseClasses, '-mx-4 sm:-mx-6')}
          onClick={handleClick}
        >
          <Hero
            headline={(component.props as any).headline}
            description={(component.props as any).description}
            cta={(component.props as any).cta}
            backgroundImage={(component.props as any).backgroundImage}
            height={(component.props as any).height}
          />
          {isSelected && (
            <div className="absolute top-4 left-4 text-xs bg-blue-500 text-white px-2 py-1 rounded pointer-events-none z-10">
              Hero
            </div>
          )}
        </div>
      );

    case 'section':
      return (
        <div
          key={component.id}
          className={cn(baseClasses, '-mx-4 sm:-mx-6')}
          onClick={handleClick}
        >
          <Section
            title={(component.props as any).title}
            layout={(component.props as any).layout}
            backgroundColor={(component.props as any).backgroundColor}
            padding={(component.props as any).padding}
          >
            {renderChildren?.((component as any).children) || null}
          </Section>
          {isSelected && (
            <div className="absolute top-4 left-4 text-xs bg-blue-500 text-white px-2 py-1 rounded pointer-events-none z-10">
              Section
            </div>
          )}
        </div>
      );

    case 'grid':
      return (
        <div key={component.id} className={baseClasses} onClick={handleClick}>
          <Grid
            columns={(component.props as any).columns}
            gap={(component.props as any).gap}
            responsiveColumns={(component.props as any).responsiveColumns}
          >
            {renderChildren?.((component as any).children) || null}
          </Grid>
          {isSelected && (
            <div className="absolute top-0 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded -mt-6 pointer-events-none">
              Grid
            </div>
          )}
        </div>
      );

    case 'container':
      return (
        <div key={component.id} className={baseClasses} onClick={handleClick}>
          <Container className={(component.props as any).className}>
            {renderChildren?.((component as any).children) || null}
          </Container>
          {isSelected && (
            <div className="absolute top-0 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded -mt-6 pointer-events-none">
              Container
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};


const Canvas: React.FC<CanvasProps> = ({ onComponentSelect }) => {
  const dispatch = useDispatch();
  const components = useSelector((state: RootState) => state.editor.components);
  const selectedComponentId = useSelector((state: RootState) => state.editor.selectedComponentId);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleSelectComponent = (id: string | null) => {
    dispatch(selectComponentAction(id));
    onComponentSelect?.(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer?.getData('componentType') || '';
    if (componentType) {
      const component = createDefaultComponent(componentType);
      if (component) {
        dispatch(addComponent(component as any));
      }
    }

    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const renderChildren = (children: BuilderComponent[] | undefined) => {
    if (!children || children.length === 0) {
      return null;
    }

    return children.map((child) =>
      renderComponent(child, selectedComponentId === child.id, handleSelectComponent, renderChildren)
    );
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOverId(null)}
      onClick={() => handleSelectComponent(null)}
      className={cn(
        'flex-1 overflow-auto bg-gray-50 px-4 sm:px-6 py-8',
        dragOverId === 'canvas' && 'bg-blue-50 border-2 border-dashed border-blue-300'
      )}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Drag components here to get started
            </p>
            <p className="text-sm text-gray-400">
              or select from the palette on the left
            </p>
          </div>
        ) : (
          components.map((component) =>
            renderComponent(
              component,
              selectedComponentId === component.id,
              handleSelectComponent,
              renderChildren
            )
          )
        )}
      </div>
    </div>
  );
};

Canvas.displayName = 'Canvas';

export { Canvas };
export type { CanvasProps };
