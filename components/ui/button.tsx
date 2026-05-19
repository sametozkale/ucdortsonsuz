import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[background,transform,border-color,opacity] duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed min-h-11 min-w-11",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-sm)] bg-accent px-5 text-inverse hover:bg-accent-hover hover:-translate-y-px active:translate-y-px active:opacity-95",
        outline:
          "rounded-[var(--radius-sm)] border border-border-strong bg-transparent text-ink hover:bg-surface-muted",
        ghost: "rounded-[var(--radius-sm)] text-ink hover:bg-surface-muted",
        link: "text-ink underline underline-offset-[3px] hover:opacity-90 min-h-0 min-w-0 px-0",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
