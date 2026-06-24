"use client";

import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import { useEvents } from "@/context/events-context";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";

export default function MyEventsPage() {
  const router = useRouter();
  const { events, joinedIds } = useEvents();
  const mine = events.filter((e) => joinedIds.has(e.id));

  return (
    <div className="flex flex-1 flex-col">
      <TopBar eyebrow="Participant" title="My events" />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {mine.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No events joined yet"
            description="Browse the schedule and join something happening at your club."
          />
        ) : (
          <>
            <div className="mb-3 mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
              You&apos;re in for {mine.length}
            </div>
            {mine.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                joined
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
