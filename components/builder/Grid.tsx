import React from 'react';
import { cn } from '@/lib/utils';
import type { GridComponent as GridComponentType } from '@/lib/types';

interface GridProps extends Omit<GridComponentType['props'], 'type'> {
  children?: React.ReactNode;
  className?: string;
}

const gridColsStyles = {
  1: 'grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

const gapStyles = {
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
};


interface ResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}


const buildResponsiveGridClass = (config: ResponsiveConfig): string => {
  const classes = ['grid-cols-' + config.mobile];

  if (config.tablet !== config.mobile) {
    classes.push(`md:grid-cols-${config.tablet}`);
  }

  if (config.desktop !== config.tablet) {
    classes.push(`lg:grid-cols-${config.desktop}`);
  }

  return classes.join(' ');
};


const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 3,
      gap = 'md',
      responsiveColumns,
      children,
      className,
      ...props
    },
    ref
  ) => {
    let gridColsClass: string;

    if (responsiveColumns) {
      gridColsClass = buildResponsiveGridClass(responsiveColumns);
    } else {
      gridColsClass = gridColsStyles[columns as keyof typeof gridColsStyles] || gridColsStyles[3];
    }

    
    const gapClass = gapStyles[gap as keyof typeof gapStyles] || gapStyles.md;

    return (
      <div
        ref={ref}
        className={cn('grid w-full', gridColsClass, gapClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export { Grid };
export type { GridProps };
