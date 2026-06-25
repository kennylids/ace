"use client";

import { useRouter } from "next/navigation";
import { ListChecks, LogOut } from "lucide-react";
import { useEventsQuery } from "@/lib/queries/events";
import { useAuth } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function MyEventsPage() {
  return (
    <AuthGuard>
      <MyEventsContent />
    </AuthGuard>
  );
}

function MyEventsContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: events, isLoading } = useEventsQuery();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const mine = events?.filter((e) =>
    e.participants.some((p) => p.id === user?.id)
  ) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        eyebrow="Participant"
        title="My events"
        trailing={
          <Button variant="icon" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-[18px] w-[18px]" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : mine.length === 0 ? (
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
