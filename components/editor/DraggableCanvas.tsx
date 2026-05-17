'use client';

import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GripHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addComponent,
  updateComponent,
  removeComponent,
  selectComponent as selectComponentAction,
} from '@/lib/store';
import { createDefaultComponent } from '@/lib/store';
import { Button as ButtonComponent } from '@/components/builder/Button';
import { Card } from '@/components/builder/Card';
import { Text } from '@/components/builder/Text';
import { Section } from '@/components/builder/Section';
import { Hero } from '@/components/builder/Hero';
import { Grid } from '@/components/builder/Grid';
import { Container } from '@/components/builder/Container';
import type { BuilderComponent } from '@/lib/schema';
import type { RootState, AppDispatch } from '@/lib/store';
import { cn } from '@/lib/utils';

interface CanvasProps {
  onComponentSelect?: (id: string | null) => void;
}

interface DraggingState {
  componentId: string;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
  type: 'move' | 'resize';
}

const DraggableCanvas: React.FC<CanvasProps> = ({ onComponentSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const components = useSelector((state: RootState) => state.editor.components);
  const selectedComponentId = useSelector((state: RootState) => state.editor.selectedComponentId);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSelectComponent = (id: string | null) => {
    dispatch(selectComponentAction(id));
    onComponentSelect?.(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer?.getData('componentType') || '';
    if (componentType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const component = createDefaultComponent(componentType);
      if (component) {
        const positionedComponent = {
          ...component,
          layout: {
            ...(component as any).layout,
            _x: Math.max(0, x),
            _y: Math.max(0, y),
            _width: 300,
            _height: 'auto' as any,
          },
        };
        dispatch(addComponent(positionedComponent as any));
      }
    }

    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    componentId: string,
    type: 'move' | 'resize'
  ) => {
    if (e.button !== 0) return; 

    e.stopPropagation();
    handleSelectComponent(componentId);

    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    const layout = (component as any).layout || {};
    const startLeft = layout._x ?? (component.props._x as number) ?? 0;
    const startTop = layout._y ?? (component.props._y as number) ?? 0;

    setDragging({
      componentId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft,
      startTop,
      type,
    });
  };

  React.useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragging.startX;
      const deltaY = e.clientY - dragging.startY;

      const component = components.find((c) => c.id === dragging.componentId);
      if (!component) return;

      if (dragging.type === 'move') {
        const newLeft = Math.max(0, dragging.startLeft + deltaX);
        const newTop = Math.max(0, dragging.startTop + deltaY);

        dispatch(
          updateComponent({
            ...component,
            layout: {
              ...(component as any).layout,
              _x: newLeft,
              _y: newTop,
            },
          } as any)
        );
      } else if (dragging.type === 'resize') {
        const layout = (component as any).layout || {};
        const currentWidth = layout._width ?? (component.props._width as number) ?? 300;
        const currentHeight = layout._height ?? (component.props._height as any) ?? 'auto';
        const newWidth = Math.max(100, currentWidth + deltaX);
        const newHeight =
          typeof currentHeight === 'number'
            ? Math.max(50, currentHeight + deltaY)
            : 'auto';

        dispatch(
          updateComponent({
            ...component,
            layout: {
              ...(component as any).layout,
              _width: newWidth,
              _height: newHeight,
            },
          } as any)
        );
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, components, dispatch]);

  const renderComponent = (component: BuilderComponent, isSelected: boolean) => {
    const layout = (component as any).layout || {};
    const left = layout._x ?? (component.props._x as number) ?? 0;
    const top = layout._y ?? (component.props._y as number) ?? 0;
    const width = layout._width ?? (component.props._width as number) ?? 300;
    const height = layout._height ?? (component.props._height as any) ?? 'auto';

    const style: React.CSSProperties = {
      position: 'absolute',
      left,
      top,
      width,
      minHeight: height === 'auto' ? 'auto' : (height as number) || 'auto',
    };

    const containerClass = cn(
      'relative bg-white',
      isSelected && 'ring-2 ring-blue-500 ring-offset-2'
    );

    return (
      <div
        key={component.id}
        style={style}
        className={containerClass}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('[data-handle]') === null) {
            handleMouseDown(e, component.id, 'move');
          }
        }}
      >
        <div
          data-handle="move"
          className="absolute -top-7 left-0 cursor-move opacity-0 hover:opacity-100 px-2 py-1 transition-opacity"
          onMouseDown={(e) => handleMouseDown(e, component.id, 'move')}
          title="Drag to move"
        >
          <GripHorizontal size={14} className="text-gray-400" />
        </div>

        <div
          data-handle="resize"
          className="absolute -bottom-1 -right-1 w-5 h-5 cursor-nwse-resize opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleMouseDown(e, component.id, 'resize')}
          title="Drag corner to resize"
          style={{
            borderRight: '2px solid #9CA3AF',
            borderBottom: '2px solid #9CA3AF',
          }}
        />

        <button
          className="absolute -top-8 right-0 p-1 bg-red-100 rounded hover:bg-red-200"
          onClick={() => {
            dispatch(removeComponent(component.id));
            handleSelectComponent(null);
          }}
          title="Delete component"
        >
          <X size={14} className="text-red-600" />
        </button>

        <div className="pointer-events-none">
          {component.type === 'button' && <ButtonComponent {...(component.props as any)} />}
          {component.type === 'card' && <Card {...(component.props as any)} />}
          {component.type === 'text' && <Text {...(component.props as any)} />}
          {component.type === 'section' && <Section {...(component.props as any)} />}
          {component.type === 'hero' && <Hero {...(component.props as any)} />}
          {component.type === 'grid' && <Grid {...(component.props as any)} />}
          {component.type === 'container' && <Container {...(component.props as any)} />}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOverId(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSelectComponent(null);
        }
      }}
      className={cn(
        'flex-1 relative overflow-auto bg-gray-50 p-8',
        dragOverId === 'canvas' && 'bg-blue-50 border-2 border-dashed border-blue-300'
      )}
      style={{
        minHeight: '800px',
      }}
    >
      {components.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
          <p className="text-lg mb-2">Drag components to canvas to get started</p>
          <p className="text-sm">Position and resize components freely</p>
        </div>
      ) : (
        <div style={{ position: 'relative', minHeight: '100%' }}>
          {components.map((component) =>
            renderComponent(component, selectedComponentId === component.id)
          )}
        </div>
      )}
    </div>
  );
};

export { DraggableCanvas };
