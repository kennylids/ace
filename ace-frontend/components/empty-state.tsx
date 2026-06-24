import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16 text-muted-foreground">
      <Icon className="mb-4 h-11 w-11 text-muted-foreground/70" strokeWidth={1.5} />
      <h3 className="font-display text-[18px] font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-[13.5px] leading-relaxed max-w-[260px]">{description}</p>
    </div>
  );
}
