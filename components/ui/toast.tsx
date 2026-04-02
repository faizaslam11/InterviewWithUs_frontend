'use client';
import * as React from 'react';
import * as T from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ToastProvider = T.Provider;
export const ToastViewport = React.forwardRef<React.ElementRef<typeof T.Viewport>, React.ComponentPropsWithoutRef<typeof T.Viewport>>(
  ({ className, ...props }, ref) => <T.Viewport ref={ref} className={cn('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[400px]', className)} {...props} />
);
ToastViewport.displayName = T.Viewport.displayName;

const tv = cva('group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border p-5 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full', {
  variants: { variant: { default: 'bg-card border-border text-foreground', destructive: 'bg-destructive border-destructive/30 text-destructive-foreground', success: 'bg-primary/8 border-primary/25 text-foreground' } },
  defaultVariants: { variant: 'default' },
});

export const Toast = React.forwardRef<React.ElementRef<typeof T.Root>, React.ComponentPropsWithoutRef<typeof T.Root> & VariantProps<typeof tv>>(
  ({ className, variant, ...props }, ref) => <T.Root ref={ref} className={cn(tv({ variant }), className)} {...props} />
);
Toast.displayName = T.Root.displayName;
export const ToastAction = React.forwardRef<React.ElementRef<typeof T.Action>, React.ComponentPropsWithoutRef<typeof T.Action>>(
  ({ className, ...props }, ref) => <T.Action ref={ref} className={cn('shrink-0 rounded-lg border bg-transparent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary', className)} {...props} />
);
ToastAction.displayName = T.Action.displayName;
export const ToastClose = React.forwardRef<React.ElementRef<typeof T.Close>, React.ComponentPropsWithoutRef<typeof T.Close>>(
  ({ className, ...props }, ref) => <T.Close ref={ref} className={cn('absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-70', className)} {...props}><X className="h-4 w-4" /></T.Close>
);
ToastClose.displayName = T.Close.displayName;
export const ToastTitle = React.forwardRef<React.ElementRef<typeof T.Title>, React.ComponentPropsWithoutRef<typeof T.Title>>(
  ({ className, ...props }, ref) => <T.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
);
ToastTitle.displayName = T.Title.displayName;
export const ToastDescription = React.forwardRef<React.ElementRef<typeof T.Description>, React.ComponentPropsWithoutRef<typeof T.Description>>(
  ({ className, ...props }, ref) => <T.Description ref={ref} className={cn('text-sm opacity-85', className)} {...props} />
);
ToastDescription.displayName = T.Description.displayName;
export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
