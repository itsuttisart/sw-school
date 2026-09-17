import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700': variant === 'default',
            'border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-900': variant === 'outline',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'h-10 px-5 py-2.5': size === 'default',
            'h-9 rounded-lg px-4 text-xs': size === 'sm',
            'h-12 rounded-2xl px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
