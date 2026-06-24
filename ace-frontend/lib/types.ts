export type EventCategory = "Clinic" | "Doubles" | "Singles ladder" | "Social" | "Junior";

export interface ClubEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO date, e.g. "2026-07-11"
  time: string; // 24h time, e.g. "09:00"
  location: string;
  capacity: number;
  description: string;
  joined: string[]; // initials of joined participants, for the avatar stack
}

export type UserRole = "admin" | "participant";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export type ClubEventInput = Omit<ClubEvent, "id" | "joined">;
