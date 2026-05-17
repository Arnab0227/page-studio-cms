import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Text } from './Text';
import type { HeroComponent as HeroComponentType } from '@/lib/types';

interface HeroProps extends Omit<HeroComponentType['props'], 'type'> {
  className?: string;
  onCTAClick?: () => void;
}

const heightStyles = {
  sm: 'min-h-[300px]',
  md: 'min-h-[400px]',
  lg: 'min-h-[500px]',
  full: 'min-h-screen',
};

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      headline,
      description,
      cta,
      backgroundImage,
      height = 'lg',
      className,
      onCTAClick,
    },
    ref
  ) => {
    const heightClass = heightStyles[height as keyof typeof heightStyles] || heightStyles.lg;

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full flex items-center justify-center overflow-hidden',
          heightClass,
          className
        )}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {!backgroundImage && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400"
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1
            className={cn(
              'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight',
              backgroundImage ? 'text-white' : 'text-white'
            )}
          >
            {headline}
          </h1>

          {description && (
            <p
              className={cn(
                'mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto',
                backgroundImage ? 'text-gray-100' : 'text-gray-100'
              )}
            >
              {description}
            </p>
          )}

          {cta && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                label={cta.label}
                href={cta.href}
                variant="primary"
                size="lg"
                onClick={onCTAClick}
                className="bg-white text-blue-600 hover:bg-gray-100"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Hero.displayName = 'Hero';

export { Hero };
export type { HeroProps };
