"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarDays, MapPin, Users, Share2, Check } from "lucide-react";
import { useEvents } from "@/context/events-context";
import { TopBar } from "@/components/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatFullDate, formatTime } from "@/lib/format";

const avatarColors = ["#2F6B3C", "#2C5F8A", "#9C3B2E", "#5C6B53", "#1C431F"];

export default function ParticipantEventDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getEvent, joinedIds, joinEvent, unjoinEvent } = useEvents();
  const [leaveOpen, setLeaveOpen] = useState(false);

  const event = getEvent(params.id);
  if (!event) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Event not found" onBack={() => router.back()} />
      </div>
    );
  }

  const joined = joinedIds.has(event.id);
  const spotsLeft = event.capacity - event.joined.length;
  const isFull = spotsLeft <= 0;
  const pct = Math.min(100, Math.round((event.joined.length / event.capacity) * 100));

  function handleLeave() {
    unjoinEvent(event!.id);
    setLeaveOpen(false);
    router.push("/my-events");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        onBack={() => router.back()}
        trailing={
          <Button variant="icon" size="icon" aria-label="Share">
            <Share2 className="h-[19px] w-[19px]" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5">
        <div className="mb-4 flex h-[170px] items-end rounded-2xl bg-secondary p-4">
          <Badge variant="primary">{event.category}</Badge>
        </div>

        <h1 className="font-display text-[24px] font-bold leading-tight mb-1.5">{event.title}</h1>
        <p className="mb-4 text-[13px] text-muted-foreground">Hosted by Westside Tennis Club</p>

        {joined && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/25 px-3.5 py-2.5 text-[13px] font-semibold text-accent-foreground">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            You&apos;re going to this event
          </div>
        )}

        <div className="divide-y divide-border">
          <InfoRow
            icon={<CalendarDays className="h-[17px] w-[17px]" />}
            primary={formatFullDate(event.date)}
            secondary={formatTime(event.time)}
          />
          <InfoRow
            icon={<MapPin className="h-[17px] w-[17px]" />}
            primary={event.location}
            secondary="Map and directions after you join"
          />
          <div className="flex items-start gap-3 py-3.5">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-secondary text-muted-foreground">
              <Users className="h-[17px] w-[17px]" />
            </div>
            <div className="flex-1">
              <p className="text-[14.5px] font-semibold">
                {isFull ? "Fully booked" : `${spotsLeft} spots left`}
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
          Who&apos;s going
        </div>
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex">
            {event.joined.slice(0, 5).map((initials, i) => (
              <Avatar key={i} className="-ml-2 first:ml-0 border-2 border-background h-[26px] w-[26px]">
                <AvatarFallback
                  className="text-[9px]"
                  style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-[13px] text-muted-foreground">{event.joined.length} players joined</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-3">
        {joined ? (
          <Button variant="outlineDanger" onClick={() => setLeaveOpen(true)}>
            Leave event
          </Button>
        ) : isFull ? (
          <Button disabled className="bg-secondary text-muted-foreground">
            Event is full
          </Button>
        ) : (
          <Button onClick={() => joinEvent(event.id)}>Join event</Button>
        )}
      </div>

      <Sheet open={leaveOpen} onOpenChange={setLeaveOpen}>
        <SheetContent>
          <p className="font-display text-[17px] font-semibold mb-1">Leave this event?</p>
          <p className="mb-[18px] text-[13.5px] leading-relaxed text-muted-foreground">
            Your spot will open up for someone else. You can rejoin later if there&apos;s room.
          </p>
          <Button variant="danger" onClick={handleLeave} className="mb-2">
            Leave event
          </Button>
          <Button variant="ghost" onClick={() => setLeaveOpen(false)}>
            Stay joined
          </Button>
        </SheetContent>
      </Sheet>
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
