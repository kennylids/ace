"use client";

import { useRouter } from "next/navigation";
import { LogOut, CalendarDays } from "lucide-react";
import { useEventsQuery } from "@/lib/queries/events";
import { useAuth } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  return (
    <AuthGuard>
      <FeedContent />
    </AuthGuard>
  );
}

function FeedContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: events, isLoading } = useEventsQuery();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const available = events?.filter(
    (e) => !e.participants.some((p) => p.id === user?.id)
  ) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        eyebrow={`Hi, ${user?.name?.split(" ")[0] ?? "there"}`}
        title="On the schedule"
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
        ) : available.length === 0 ? (
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
