import React from 'react';
import { createDefaultComponent } from '@/lib/store';
import type { PaletteItem } from '@/lib/types';
import {
  CircleDot,
  Square,
  Layout,
  Layers,
  Grid3x3,
  Type,
  Container as ContainerIcon,
} from 'lucide-react';

interface ComponentPaletteProps {
  onComponentSelect?: (type: string) => void;
  onDragStart?: (e: React.DragEvent, type: string) => void;
}


const paletteItems: PaletteItem[] = [
  {
    type: 'button',
    label: 'Button',
    icon: 'button',
    description: 'Clickable button element',
    defaultProps: {
      label: 'Click me',
      variant: 'primary',
      size: 'md',
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'type',
    description: 'Text content and headings',
    defaultProps: {
      content: 'Text content',
      variant: 'p',
    },
  },
  {
    type: 'card',
    label: 'Card',
    icon: 'square',
    description: 'Content card with image',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description',
    },
  },
  {
    type: 'hero',
    label: 'Hero',
    icon: 'layout',
    description: 'Large banner section',
    defaultProps: {
      headline: 'Welcome',
      description: 'Hero description',
      height: 'lg',
    },
  },
  {
    type: 'section',
    label: 'Section',
    icon: 'layout',
    description: 'Container section',
    defaultProps: {
      layout: 'single',
      padding: 'md',
    },
  },
  {
    type: 'grid',
    label: 'Grid',
    icon: 'grid',
    description: 'Responsive grid layout',
    defaultProps: {
      columns: 3,
      gap: 'md',
    },
  },
  {
    type: 'container',
    label: 'Container',
    icon: 'container',
    description: 'Simple wrapper',
    defaultProps: {},
  },
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.FC<{ size: number }>> = {
    button: CircleDot,
    type: Type,
    square: Square,
    layout: Layout,
    layers: Layers,
    grid: Grid3x3,
    container: ContainerIcon,
  };

  const IconComponent = icons[iconName] || Square;
  return <IconComponent size={20} />;
};

const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onComponentSelect,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', item.type);
    onDragStart?.(e, item.type);
  };

  const handleComponentClick = (item: PaletteItem) => {
    onComponentSelect?.(item.type);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">
          Components
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {paletteItems.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => handleComponentClick(item)}
              className={
                'p-3 rounded-lg border border-gray-200 cursor-move ' +
                'hover:border-blue-300 hover:bg-blue-50 ' +
                'transition-all duration-200 group'
              }
              title={item.description}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                  {getIconComponent(item.icon)}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          Drag or click to add
        </p>
      </div>
    </div>
  );
};

ComponentPalette.displayName = 'ComponentPalette';

export { ComponentPalette };
export type { ComponentPaletteProps };
