"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/context/events-context";
import { TopBar } from "@/components/top-bar";
import { EventForm } from "@/components/event-form";
import { ClubEventInput } from "@/lib/types";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();

  function handleSubmit(input: ClubEventInput) {
    const event = createEvent(input);
    router.push(`/admin/events/${event.id}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="New event" onBack={() => router.push("/admin")} />
      <div className="flex-1 overflow-y-auto">
        <EventForm
          submitLabel="Publish event"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin")}
        />
      </div>
    </div>
  );
}
