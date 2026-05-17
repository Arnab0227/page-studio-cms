import React from 'react';
import { cn } from '@/lib/utils';
import type { ButtonComponent as ButtonComponentType } from '@/lib/types';

interface ButtonProps extends Omit<ButtonComponentType['props'], 'onClick'> {
  onClick?: () => void;
  className?: string;
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  outline: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      label,
      variant = 'primary',
      size = 'md',
      href,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const buttonStyles = cn(
      baseStyles,
      variants[variant as keyof typeof variants],
      sizes[size as keyof typeof sizes],
      className
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={buttonStyles}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {label}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonStyles}
        onClick={onClick}
        type="button"
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
