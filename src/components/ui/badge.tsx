import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted border border-ink-800 text-ink-500",
        lime: "bg-lime/10 border border-lime/30 text-lime",
        accent: "bg-accent/10 border border-accent/30 text-accent",
        success: "bg-success-soft border border-success/30 text-success-fg",
        warning: "bg-warning-soft border border-warning/30 text-warning-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
