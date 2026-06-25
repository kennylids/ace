export type EventCategory = "Clinic" | "Doubles" | "Singles ladder" | "Social" | "Junior";

export type ApiEventCategory = "CLINIC" | "DOUBLES" | "SINGLES_LADDER" | "SOCIAL" | "JUNIOR";

const CATEGORY_MAP: Record<ApiEventCategory, EventCategory> = {
  CLINIC: "Clinic",
  DOUBLES: "Doubles",
  SINGLES_LADDER: "Singles ladder",
  SOCIAL: "Social",
  JUNIOR: "Junior",
};

const CATEGORY_REVERSE_MAP: Record<EventCategory, ApiEventCategory> = {
  Clinic: "CLINIC",
  Doubles: "DOUBLES",
  "Singles ladder": "SINGLES_LADDER",
  Social: "SOCIAL",
  Junior: "JUNIOR",
};

export function categoryFromApi(cat: ApiEventCategory): EventCategory {
  return CATEGORY_MAP[cat];
}

export function categoryToApi(cat: EventCategory): ApiEventCategory {
  return CATEGORY_REVERSE_MAP[cat];
}

export interface Participant {
  id: string;
  name: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
  participants: Participant[];
}

export type UserRole = "ADMIN" | "PARTICIPANT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ClubEventInput = Omit<ClubEvent, "id" | "participants">;

export interface ApiEvent {
  id: string;
  title: string;
  category: ApiEventCategory;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  participants: Participant[];
}

export function eventFromApi(e: ApiEvent): ClubEvent {
  return {
    id: e.id,
    title: e.title,
    category: categoryFromApi(e.category),
    date: e.date.slice(0, 10),
    time: e.time,
    location: e.location,
    capacity: e.capacity,
    description: e.description,
    participants: e.participants || [],
  };
}
