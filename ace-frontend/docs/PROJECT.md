# Ace — Tennis Club Event Platform

## Overview

Ace is a mobile-first web app for tennis clubs to publish events (clinics, mixers, ladder matches) and for members to browse and join them. Two user roles — **participant** and **admin** — each with a distinct experience. Currently runs entirely client-side with in-memory state; no backend API.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| UI primitives | Radix UI (Dialog, Sheet, Select, Avatar, Progress, Label, Separator) |
| Styling | Tailwind CSS + tailwindcss-animate |
| Component variants | class-variance-authority (CVA) |
| Icons | Lucide React |
| Utility | clsx, tailwind-merge |

## Features

### Authentication

- Email + password login form (demo — no real auth backend)
- Role selector toggle: participant or admin
- Role determines post-login redirect and available views
- Logout (admin dashboard header)

### Participant Experience

| Feature | Description |
|---------|-------------|
| Event feed | Browse all upcoming events the user hasn't joined. Shows count, card list with category badge, date, location, and avatar stack. |
| Event detail | Full view with date/time, location, capacity progress bar, description, and "Who's going" avatar list. |
| Join event | One-tap join from detail page. Button disabled when event is full. |
| Leave event | Confirmation bottom sheet before removing the user from an event. Redirects to My Events. |
| My Events | Filtered list of events the user has joined. |
| Bottom navigation | Two tabs — Feed and My Events. |

### Admin Experience

| Feature | Description |
|---------|-------------|
| Dashboard | Lists all events with a floating action button (FAB) to create new ones. |
| Create event | Form with fields: title, category (select), date, time, location, capacity, description. Publishes immediately. |
| Edit event | Same form pre-filled with existing data. |
| Delete event | Removes event from state. |
| Event detail | View participant count and event metadata. |

### Event Categories

Clinic · Doubles · Singles ladder · Social · Junior

## Data Layer

State is managed via two React Contexts:

- **AuthContext** — current user (name, email, role), login/logout actions.
- **EventsContext** — full event list, joined-event IDs, CRUD operations (create, update, delete), join/unjoin actions, spots-left calculation.

Data is seeded from `data/sample-events.ts` on mount. No persistence between sessions.

## UI Component Library

Reusable primitives live in `components/ui/` following the shadcn/ui pattern:

Avatar · Badge · Button · Card · Dialog · Input · Label · Progress · Select · Separator · Sheet · Textarea

App-level components in `components/`:

- **EventCard** — compact event summary card
- **EventForm** — create/edit form with category select
- **TopBar** — page header with optional back button and trailing action
- **BottomNav** — sticky bottom tab bar (participant views)
- **EmptyState** — icon + message placeholder when lists are empty

## Project Structure

```
app/
  login/          → Login page
  feed/           → Participant event feed
  my-events/      → Participant joined events
  events/[id]/    → Participant event detail
  admin/          → Admin dashboard
  admin/events/new/       → Create event
  admin/events/[id]/      → Admin event detail
  admin/events/[id]/edit/ → Edit event
components/
  ui/             → Radix-based primitives
  *.tsx           → App-level composed components
context/          → AuthContext, EventsContext
data/             → Sample seed data
lib/              → Types, utilities, date formatting
```

## Running Locally

```bash
npm install
npm run dev
```

App starts at `http://localhost:3000`. Redirects to `/login` on first load.
