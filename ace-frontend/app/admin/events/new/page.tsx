"use client";

import { useRouter } from "next/navigation";
import { useCreateEventMutation } from "@/lib/queries/events";
import { AdminGuard } from "@/components/admin-guard";
import { TopBar } from "@/components/top-bar";
import { EventForm } from "@/components/event-form";
import { ClubEventInput } from "@/lib/types";

export default function CreateEventPage() {
  return (
    <AdminGuard>
      <CreateEventContent />
    </AdminGuard>
  );
}

function CreateEventContent() {
  const router = useRouter();
  const createMutation = useCreateEventMutation();

  function handleSubmit(input: ClubEventInput) {
    createMutation.mutate(input, {
      onSuccess: (data) => {
        router.push(`/admin/events/${data.id}`);
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="New event" onBack={() => router.push("/admin")} />
      <div className="flex-1 overflow-y-auto">
        <EventForm
          submitLabel={createMutation.isPending ? "Publishing..." : "Publish event"}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin")}
        />
        {createMutation.isError && (
          <p className="px-5 text-[13px] text-destructive">
            {createMutation.error instanceof Error ? createMutation.error.message : "Failed to create event"}
          </p>
        )}
      </div>
    </div>
  );
}
