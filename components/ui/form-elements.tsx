import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { placeholder?: string }
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, placeholder, ...props }, ref) => (
  <div className="relative">
    <select className={cn('flex h-10 w-full appearance-none rounded-xl border border-input bg-background px-3.5 py-2 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer', className)} ref={ref} {...props}>
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
));
Select.displayName = 'Select';

// Checkbox
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn('peer h-4 w-4 shrink-0 rounded-md border-2 border-primary/40 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground transition-all', className)} {...props}>
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="h-3 w-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
