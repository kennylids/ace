"use client";

import { CalendarDays, MapPin, Check, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClubEvent, EventCategory } from "@/lib/types";
import { formatDow, formatShortDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const categoryBadgeVariant: Record<EventCategory, "primary" | "teal" | "accent" | "muted"> = {
  Clinic: "primary",
  Doubles: "teal",
  "Singles ladder": "primary",
  Social: "muted",
  Junior: "accent",
};

interface EventCardProps {
  event: ClubEvent;
  onClick: () => void;
  /** Show the admin "more actions" affordance instead of a status badge */
  onMore?: () => void;
  /** Show a "joined" badge in the corner, for the participant's joined list */
  joined?: boolean;
  className?: string;
}

export function EventCard({ event, onClick, onMore, joined, className }: EventCardProps) {
  const spotsLeft = event.capacity - event.participants.length;
  const isFull = spotsLeft <= 0;

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={cn("mb-4 cursor-pointer overflow-hidden", className)}
    >
      <div className="px-[18px] pt-4 pb-3.5">
        <div className="mb-2 flex items-start justify-between gap-2.5">
          <Badge variant={categoryBadgeVariant[event.category]}>{event.category}</Badge>
          {onMore && (
            <Button
              variant="icon"
              size="icon"
              className="h-7 w-7 -mt-1 -mr-1"
              onClick={(e) => {
                e.stopPropagation();
                onMore();
              }}
              aria-label="Manage event"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
          {joined && (
            <Badge variant="accent">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              Joined
            </Badge>
          )}
        </div>
        <h3 className="font-display text-[17px] font-semibold leading-tight mb-1">{event.title}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* net-cord divider, the card's signature element */}
      <div className="relative mx-0 border-t-[1.5px] border-dashed border-primary/50">
        <span className="absolute -left-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
        <span className="absolute -right-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
      </div>

      <div className="flex items-center justify-between gap-2 px-[18px] py-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <CalendarDays className="h-[13px] w-[13px]" />
            <span className="font-mono font-medium text-foreground">
              {formatDow(event.date)}, {formatShortDate(event.date)}
            </span>
            <span>· {formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <MapPin className="h-[13px] w-[13px]" />
            {event.location}
          </div>
        </div>
        <div className="text-right font-mono text-[12px] text-muted-foreground whitespace-nowrap">
          {isFull ? (
            <span className="font-semibold text-destructive">Full</span>
          ) : (
            <span className="font-semibold text-foreground">{spotsLeft}</span>
          )}{" "}
          {!isFull && "left"}
          <br />
          <span className="opacity-70">of {event.capacity}</span>
        </div>
      </div>
    </Card>
  );
}
