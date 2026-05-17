import React from 'react';
import { cn } from '@/lib/utils';
import type { ContainerComponent as ContainerComponentType } from '@/lib/types';

interface ContainerProps extends Omit<ContainerComponentType['props'], 'type'> {
  children?: React.ReactNode;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Container };
export type { ContainerProps };
