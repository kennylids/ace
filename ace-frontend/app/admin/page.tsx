"use client";

import { useRouter } from "next/navigation";
import { LogOut, Plus, CalendarDays } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useEventsQuery } from "@/lib/queries/events";
import { AdminGuard } from "@/components/admin-guard";
import { TopBar } from "@/components/top-bar";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: events, isLoading } = useEventsQuery();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        eyebrow="Admin"
        title="Your events"
        trailing={
          <Button variant="icon" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-[18px] w-[18px]" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : !events || events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No events yet"
            description="Create your first event and it will show up here for people to find."
          />
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/admin/events/${event.id}`)}
              onMore={() => router.push(`/admin/events/${event.id}`)}
            />
          ))
        )}
      </div>

      <Button
        size="icon"
        className="absolute bottom-[88px] right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => router.push("/admin/events/new")}
        aria-label="Create event"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
