"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ClubEvent, ClubEventInput } from "@/lib/types";
import { sampleEvents, sampleJoinedIds } from "@/data/sample-events";

interface EventsContextValue {
  events: ClubEvent[];
  joinedIds: Set<string>;
  getEvent: (id: string) => ClubEvent | undefined;
  createEvent: (input: ClubEventInput) => ClubEvent;
  updateEvent: (id: string, input: ClubEventInput) => void;
  deleteEvent: (id: string) => void;
  joinEvent: (id: string) => void;
  unjoinEvent: (id: string) => void;
  spotsLeft: (event: ClubEvent) => number;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

// Initials used for the synthetic "you" avatar when joining in this demo data layer
function randomInitials() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ClubEvent[]>(sampleEvents);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set(sampleJoinedIds));

  const getEvent = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  const createEvent = useCallback((input: ClubEventInput) => {
    const newEvent: ClubEvent = { id: Date.now().toString(), joined: [], ...input };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, input: ClubEventInput) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...input } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const joinEvent = useCallback((id: string) => {
    setJoinedIds((prev) => new Set(prev).add(id));
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, joined: [...e.joined, randomInitials()] } : e))
    );
  }, []);

  const unjoinEvent = useCallback((id: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, joined: e.joined.slice(0, -1) } : e))
    );
  }, []);

  const spotsLeft = useCallback((event: ClubEvent) => event.capacity - event.joined.length, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        joinedIds,
        getEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        unjoinEvent,
        spotsLeft,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within an EventsProvider");
  return ctx;
}
