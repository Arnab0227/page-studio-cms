import React from 'react';
import { cn } from '@/lib/utils';
import type { CardComponent as CardComponentType } from '@/lib/types';

interface CardProps extends Omit<CardComponentType['props'], 'type'> {
  children?: React.ReactNode;
  className?: string;
  onImageError?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      description,
      image,
      footer,
      children,
      className,
      onImageError,
    },
    ref
  ) => {
    const hasImage = image?.src;

    return (
      <article
        ref={ref}
        className={cn(
          'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200',
          className
        )}
      >
        {hasImage && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <img
              src={image.src}
              alt={image.alt || title}
              className="w-full h-full object-cover"
              onError={onImageError}
            />
          </div>
        )}

        <div className="p-4 sm:p-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-600 mb-4">
              {description}
            </p>
          )}

          {children && (
            <div className="mb-4">
              {children}
            </div>
          )}
        </div>

        {footer && (
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              {footer}
            </p>
          </div>
        )}
      </article>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };
