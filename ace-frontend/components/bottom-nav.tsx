"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", label: "Feed", icon: CalendarDays },
  { href: "/my-events", label: "My events", icon: ListChecks },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 left-0 right-0 flex border-t border-border bg-background px-4 pb-5 pt-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1.5 text-muted-foreground/70",
              active && "text-primary"
            )}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
