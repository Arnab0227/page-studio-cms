import React from 'react';
import { cn } from '@/lib/utils';
import type { TextComponent as TextComponentType } from '@/lib/types';

interface TextProps extends Omit<TextComponentType['props'], 'type'> {
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'small';
}


const variantStyles = {
  h1: 'text-4xl sm:text-5xl font-bold tracking-tight',
  h2: 'text-3xl sm:text-4xl font-bold tracking-tight',
  h3: 'text-2xl sm:text-3xl font-semibold',
  h4: 'text-xl font-semibold',
  p: 'text-base leading-relaxed',
  small: 'text-sm text-gray-600',
};


const alignmentStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};


const getTextColor = (color?: string): string => {
  if (!color) return 'text-gray-900';

  const colorMap: Record<string, string> = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    white: 'text-white',
  };

  return colorMap[color] || `text-${color}`;
};


const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      content,
      variant = 'p',
      color,
      textAlign = 'left',
      className,
      as,
      ...props
    },
    ref
  ) => {
    const Component = as || variant;
    const textColorClass = getTextColor(color);

    const textClasses = cn(
      variantStyles[variant as keyof typeof variantStyles],
      alignmentStyles[textAlign as keyof typeof alignmentStyles],
      textColorClass,
      className
    );

    return React.createElement(
      Component,
      {
        ref,
        className: textClasses,
        ...props,
      },
      content
    );
  }
);

Text.displayName = 'Text';

export { Text };
export type { TextProps };
