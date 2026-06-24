"use client";

import { useRouter, useParams } from "next/navigation";
import { useEvents } from "@/context/events-context";
import { TopBar } from "@/components/top-bar";
import { EventForm } from "@/components/event-form";
import { ClubEventInput } from "@/lib/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getEvent, updateEvent } = useEvents();
  const event = getEvent(params.id);

  if (!event) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Event not found" onBack={() => router.push("/admin")} />
      </div>
    );
  }

  function handleSubmit(input: ClubEventInput) {
    updateEvent(event!.id, input);
    router.push(`/admin/events/${event!.id}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Edit event" onBack={() => router.push(`/admin/events/${event.id}`)} />
      <div className="flex-1 overflow-y-auto">
        <EventForm
          initialValue={{
            title: event.title,
            category: event.category,
            date: event.date,
            time: event.time,
            location: event.location,
            capacity: event.capacity,
            description: event.description,
          }}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/events/${event.id}`)}
        />
      </div>
    </div>
  );
}
