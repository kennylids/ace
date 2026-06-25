"use client";

import { useRouter, useParams } from "next/navigation";
import { useEventQuery, useUpdateEventMutation } from "@/lib/queries/events";
import { AdminGuard } from "@/components/admin-guard";
import { TopBar } from "@/components/top-bar";
import { EventForm } from "@/components/event-form";
import { ClubEventInput } from "@/lib/types";

export default function EditEventPage() {
  return (
    <AdminGuard>
      <EditEventContent />
    </AdminGuard>
  );
}

function EditEventContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: event, isLoading } = useEventQuery(params.id);
  const updateMutation = useUpdateEventMutation();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Event not found" onBack={() => router.push("/admin")} />
      </div>
    );
  }

  function handleSubmit(input: ClubEventInput) {
    updateMutation.mutate(
      { id: event!.id, input },
      { onSuccess: () => router.push(`/admin/events/${event!.id}`) }
    );
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
          submitLabel={updateMutation.isPending ? "Saving..." : "Save changes"}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/events/${event.id}`)}
        />
        {updateMutation.isError && (
          <p className="px-5 text-[13px] text-destructive">
            {updateMutation.error instanceof Error ? updateMutation.error.message : "Failed to update"}
          </p>
        )}
      </div>
    </div>
  );
}
