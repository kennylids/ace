"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarDays, MapPin, Users, Pencil, Trash2 } from "lucide-react";
import { useEventQuery, useDeleteEventMutation } from "@/lib/queries/events";
import { AdminGuard } from "@/components/admin-guard";
import { TopBar } from "@/components/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatFullDate, formatTime } from "@/lib/format";

const avatarColors = ["#2F6B3C", "#2C5F8A", "#9C3B2E", "#5C6B53", "#1C431F"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminEventDetailPage() {
  return (
    <AdminGuard>
      <AdminEventDetailContent />
    </AdminGuard>
  );
}

function AdminEventDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: event, isLoading } = useEventQuery(params.id);
  const deleteMutation = useDeleteEventMutation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  const pct = Math.min(100, Math.round((event.participants.length / event.capacity) * 100));

  function handleDelete() {
    deleteMutation.mutate(event!.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        router.push("/admin");
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar onBack={() => router.push("/admin")} onMore={() => setSheetOpen(true)} />

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="mb-4 flex h-[170px] items-end rounded-2xl bg-secondary p-4">
          <Badge variant="primary">{event.category}</Badge>
        </div>

        <h1 className="font-display text-[24px] font-bold leading-tight mb-1.5">{event.title}</h1>
        <p className="mb-4 text-[13px] text-muted-foreground">You&apos;re hosting this event</p>

        <div className="divide-y divide-border">
          <InfoRow
            icon={<CalendarDays className="h-[17px] w-[17px]" />}
            primary={formatFullDate(event.date)}
            secondary={formatTime(event.time)}
          />
          <InfoRow
            icon={<MapPin className="h-[17px] w-[17px]" />}
            primary={event.location}
            secondary="Exact address shown to attendees"
          />
          <div className="flex items-start gap-3 py-3.5">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-secondary text-muted-foreground">
              <Users className="h-[17px] w-[17px]" />
            </div>
            <div className="flex-1">
              <p className="text-[14.5px] font-semibold">
                {event.participants.length} of {event.capacity} spots filled
              </p>
              <Progress value={pct} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="mb-3 mt-5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
          About
        </div>
        <p className="text-[14px] leading-relaxed text-muted-foreground">{event.description}</p>

        <div className="mb-3 mt-5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
          Attendees ({event.participants.length})
        </div>
        {event.participants.length === 0 ? (
          <p className="text-[13.5px] text-muted-foreground">No one has joined yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {event.participants.map((p, i) => (
              <Avatar key={p.id} className="h-[34px] w-[34px]">
                <AvatarFallback style={{ backgroundColor: avatarColors[i % avatarColors.length] }}>
                  {getInitials(p.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <button
            className="flex w-full items-center gap-3 border-b border-border py-3.5 text-left text-[15px]"
            onClick={() => {
              setSheetOpen(false);
              router.push(`/admin/events/${event.id}/edit`);
            }}
          >
            <Pencil className="h-[18px] w-[18px]" />
            Edit event
          </button>
          <button
            className="flex w-full items-center gap-3 py-3.5 text-left text-[15px] text-destructive"
            onClick={() => {
              setSheetOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-[18px] w-[18px]" />
            Delete event
          </button>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogTitle>Delete this event?</DialogTitle>
          <DialogDescription>
            This can&apos;t be undone. Everyone who joined will no longer see it on their list.
          </DialogDescription>
          <Button variant="danger" onClick={handleDelete} className="mb-2" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete event"}
          </Button>
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({
  icon,
  primary,
  secondary,
}: {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-secondary text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-[14.5px] font-semibold">{primary}</p>
        <p className="text-[12.5px] text-muted-foreground">{secondary}</p>
      </div>
    </div>
  );
}
