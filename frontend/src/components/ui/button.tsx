import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        outline: "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "gradient-button text-accent-foreground shadow-medium hover:opacity-90",
        success: "gradient-success text-primary-foreground shadow-soft hover:opacity-90",
        quickAction: "flex-col h-auto py-4 px-3 bg-card border-2 border-transparent hover:border-primary/20 shadow-soft hover:shadow-medium rounded-xl",
        input: "bg-muted hover:bg-muted/80 text-muted-foreground rounded-full",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11 rounded-full",
        iconSm: "h-9 w-9 rounded-full",
        iconLg: "h-14 w-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
