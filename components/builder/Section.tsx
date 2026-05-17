import React from 'react';
import { cn } from '@/lib/utils';
import type { SectionComponent as SectionComponentType } from '@/lib/types';

interface SectionProps extends Omit<SectionComponentType['props'], 'type'> {
  children?: React.ReactNode;
  className?: string;
}

const layoutStyles = {
  single: 'flex flex-col w-full',
  'two-column': 'grid grid-cols-1 md:grid-cols-2 gap-6',
  'three-column': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
};

const paddingStyles = {
  sm: 'px-4 py-6 sm:px-6',
  md: 'px-4 py-8 sm:px-6 sm:py-12',
  lg: 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20',
};


const getBackgroundColor = (color?: string): string => {
  if (!color) return 'bg-white';

  const bgColorMap: Record<string, string> = {
    gray: 'bg-gray-50',
    'gray-dark': 'bg-gray-100',
    white: 'bg-white',
    'blue-light': 'bg-blue-50',
    'primary': 'bg-blue-600',
  };

  return bgColorMap[color] || `bg-${color}`;
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      title,
      layout = 'single',
      backgroundColor,
      padding = 'md',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const bgColor = getBackgroundColor(backgroundColor);
    const layoutClass = layoutStyles[layout as keyof typeof layoutStyles] || layoutStyles.single;
    const paddingClass = paddingStyles[padding as keyof typeof paddingStyles];

    return (
      <section
        ref={ref}
        className={cn(bgColor, paddingClass, className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {title}
            </h2>
          )}

          <div className={layoutClass}>
            {children}
          </div>
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export { Section };
export type { SectionProps };
