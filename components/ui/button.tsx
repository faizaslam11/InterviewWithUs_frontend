// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const bv = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20 active:translate-y-0',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        outline: 'border border-input bg-background hover:bg-secondary hover:border-primary/40',
        secondary: 'bg-secondary text-secondary-foreground border border-border hover:border-primary/30',
        ghost: 'hover:bg-secondary text-muted-foreground hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        amber: 'bg-amber-500 text-white hover:opacity-90 hover:-translate-y-px',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-7 text-base',
        xl: 'h-14 rounded-xl px-9 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof bv> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(bv({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';
export { Button, bv as buttonVariants };
