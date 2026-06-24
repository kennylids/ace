import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-mono text-[11px] font-medium px-2.5 py-1",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        teal: "bg-court-teal-tint text-court-teal-foreground",
        accent: "bg-accent/30 text-accent-foreground",
        muted: "bg-secondary text-muted-foreground",
      },
    },
    defaultVariants: { variant: "muted" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
