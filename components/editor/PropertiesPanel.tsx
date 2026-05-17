import React from 'react';
import { useDispatch } from 'react-redux';
import { updateComponent, removeComponent } from '@/lib/store';
import { useForm } from 'react-hook-form';
import type { BuilderComponent } from '@/lib/schema';
import type { AppDispatch } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  component?: BuilderComponent | null;
}


const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ component }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, watch, setValue } = useForm<any>({
    defaultValues: component?.props || {},
  });
  
  const [layoutMarginTop, setLayoutMarginTop] = React.useState<number>(
    (component as any)?.layout?.margin?.top || 0
  );
  const [layoutMarginBottom, setLayoutMarginBottom] = React.useState<number>(
    (component as any)?.layout?.margin?.bottom || 16
  );
  const [layoutAlignment, setLayoutAlignment] = React.useState<string>(
    (component as any)?.layout?.alignment || 'left'
  );

  const onSubmit = (data: any) => {
    if (component) {
      const preservedProps = {
        ...component.props,
        ...data,
        _x: (component.props as any)._x,
        _y: (component.props as any)._y,
        _width: (component.props as any)._width,
        _height: (component.props as any)._height,
      };
      
      dispatch(updateComponent({
        ...component,
        props: preservedProps,
        layout: {
          ...((component as any).layout || {}),
          margin: {
            top: layoutMarginTop,
            right: 0,
            bottom: layoutMarginBottom,
            left: 0,
          },
          alignment: layoutAlignment,
        },
      }));
    }
  };

  const handleRemove = () => {
    if (component && window.confirm('Are you sure you want to delete this component?')) {
      dispatch(removeComponent(component.id));
    }
  };

  if (!component) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
        <p className="text-sm">Select a component to edit</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 capitalize">
          {component.type} Properties
        </h2>
        <button
          onClick={handleRemove}
          className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
          title="Delete component"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 space-y-4">
        {component.type === 'button' && (
          <>
            <div>
              <Label htmlFor="label" className="text-xs font-medium">Label</Label>
              <Input
                id="label"
                {...register('label')}
                placeholder="Button text"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="variant" className="text-xs font-medium">Variant</Label>
              <Select
                defaultValue={(component.props as any).variant || 'primary'}
                onValueChange={(value) => setValue('variant', value)}
              >
                <SelectTrigger id="variant" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size" className="text-xs font-medium">Size</Label>
              <Select
                defaultValue={(component.props as any).size || 'md'}
                onValueChange={(value) => setValue('size', value)}
              >
                <SelectTrigger id="size" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="href" className="text-xs font-medium">URL (optional)</Label>
              <Input
                id="href"
                {...register('href')}
                placeholder="https://example.com"
                className="mt-1"
                type="url"
              />
            </div>
          </>
        )}

        {component.type === 'text' && (
          <>
            <div>
              <Label htmlFor="content" className="text-xs font-medium">Content</Label>
              <textarea
                id="content"
                {...register('content')}
                placeholder="Text content"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="variant" className="text-xs font-medium">Variant</Label>
              <Select
                defaultValue={(component.props as any).variant || 'p'}
                onValueChange={(value) => setValue('variant', value)}
              >
                <SelectTrigger id="variant" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {component.type === 'card' && (
          <>
            <div>
              <Label htmlFor="title" className="text-xs font-medium">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Card title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-xs font-medium">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Card description"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
                rows={3}
              />
            </div>
          </>
        )}

        {component.type === 'hero' && (
          <>
            <div>
              <Label htmlFor="headline" className="text-xs font-medium">Headline</Label>
              <Input
                id="headline"
                {...register('headline')}
                placeholder="Hero headline"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-xs font-medium">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Hero description"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs font-medium">Height</Label>
              <Select
                defaultValue={(component.props as any).height || 'lg'}
                onValueChange={(value) => setValue('height', value)}
              >
                <SelectTrigger id="height" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="full">Full Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {component.type === 'section' && (
          <>
            <div>
              <Label htmlFor="title" className="text-xs font-medium">Title (optional)</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Section title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="layout" className="text-xs font-medium">Layout</Label>
              <Select
                defaultValue={(component.props as any).layout || 'single'}
                onValueChange={(value) => setValue('layout', value)}
              >
                <SelectTrigger id="layout" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Column</SelectItem>
                  <SelectItem value="two-column">Two Columns</SelectItem>
                  <SelectItem value="three-column">Three Columns</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {component.type === 'grid' && (
          <>
            <div>
              <Label htmlFor="columns" className="text-xs font-medium">Columns</Label>
              <Select
                defaultValue={String((component.props as any).columns || 3)}
                onValueChange={(value) => setValue('columns', parseInt(value))}
              >
                <SelectTrigger id="columns" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gap" className="text-xs font-medium">Gap</Label>
              <Select
                defaultValue={(component.props as any).gap || 'md'}
                onValueChange={(value) => setValue('gap', value)}
              >
                <SelectTrigger id="gap" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="border-t pt-4 mt-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Spacing & Layout</h3>
          
          <div>
            <Label htmlFor="margin-top" className="text-xs font-medium">Top Margin (px)</Label>
            <Input
              id="margin-top"
              type="number"
              value={layoutMarginTop}
              onChange={(e) => setLayoutMarginTop(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="mt-1"
              min="0"
              step="4"
            />
          </div>

          <div className="mt-2">
            <Label htmlFor="margin-bottom" className="text-xs font-medium">Bottom Margin (px)</Label>
            <Input
              id="margin-bottom"
              type="number"
              value={layoutMarginBottom}
              onChange={(e) => setLayoutMarginBottom(parseInt(e.target.value) || 0)}
              placeholder="16"
              className="mt-1"
              min="0"
              step="4"
            />
          </div>

          <div className="mt-2">
            <Label htmlFor="alignment" className="text-xs font-medium">Alignment</Label>
            <Select
              defaultValue={layoutAlignment}
              onValueChange={setLayoutAlignment}
            >
              <SelectTrigger id="alignment" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-4"
        >
          Update Properties
        </Button>
      </form>
    </div>
  );
};

PropertiesPanel.displayName = 'PropertiesPanel';

export { PropertiesPanel };
export type { PropertiesPanelProps };
