"use client";

import { useRouter } from "next/navigation";
import { Search, CalendarDays } from "lucide-react";
import { useEvents } from "@/context/events-context";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const router = useRouter();
  const { events, joinedIds } = useEvents();
  const available = events.filter((e) => !joinedIds.has(e.id));

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        eyebrow="Hi, Maya"
        title="On the schedule"
        trailing={
          <Button variant="icon" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {available.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="All caught up"
            description="New events from your club will show up here as they get posted."
          />
        ) : (
          <>
            <div className="mb-3 mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
              {available.length} upcoming
            </div>
            {available.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
