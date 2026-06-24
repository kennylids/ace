"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
  eyebrow?: string;
  title?: string;
  onBack?: () => void;
  onMore?: () => void;
  trailing?: React.ReactNode;
  className?: string;
}

export function TopBar({ eyebrow, title, onBack, onMore, trailing, className }: TopBarProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2.5 px-5 pt-4 pb-2.5", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {onBack && (
          <Button variant="icon" size="icon" onClick={onBack} aria-label="Go back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
              {eyebrow}
            </div>
          )}
          {title && (
            <h1 className="font-display text-[20px] font-semibold tracking-tight truncate">{title}</h1>
          )}
        </div>
      </div>
      {trailing}
      {onMore && (
        <Button variant="icon" size="icon" onClick={onMore} aria-label="More actions">
          <MoreVertical className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
