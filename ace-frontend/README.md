# Ace — Club Court Booking

Mobile-first Next.js (App Router) frontend for a tennis club event platform.
Two roles share one codebase: admins manage events, participants join and leave them.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Context API** for state — no external state library
  - `context/auth-context.tsx` — current user + role (`admin` | `participant`)
  - `context/events-context.tsx` — events CRUD, join/unjoin, all in-memory
- **shadcn/ui-style components** under `components/ui/` (Radix primitives + Tailwind, hand-written to match this exact theme rather than pulled from the CLI)
- **Tailwind CSS** with a small custom token set in `app/globals.css` (tennis palette: ivy green primary, optic-yellow accent, clay-red destructive)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/login`.

On the login screen, toggle **Participant** or **Admin** before signing in (any email/password works — this is a frontend-only prototype, there's no real auth or backend yet).

## Routes

| Route | Who | Screen |
|---|---|---|
| `/login` | both | Sign in, pick role |
| `/admin` | admin | Dashboard — all events, FAB to create |
| `/admin/events/new` | admin | Create event form |
| `/admin/events/[id]` | admin | Event detail — attendees, edit/delete via action sheet |
| `/admin/events/[id]/edit` | admin | Edit event (same form component as create) |
| `/feed` | participant | Browse events not yet joined |
| `/events/[id]` | participant | Event detail — Join / Leave |
| `/my-events` | participant | Events the participant has joined |

## Wiring up a real backend

All data currently lives in `context/events-context.tsx`, seeded from `data/sample-events.ts`.
To connect a real API:

1. Replace the in-memory `useState<ClubEvent[]>` with a data-fetching layer (e.g. SWR/React Query, or server actions).
2. Keep the same context method signatures (`createEvent`, `updateEvent`, `deleteEvent`, `joinEvent`, `unjoinEvent`) so no page or component needs to change — they only call the context, never touch state directly.
3. `context/auth-context.tsx` currently fakes a login by trusting the role toggle on the login screen. Swap `login()` for a real auth call and persist the session (cookie/JWT) instead of plain `useState`.

## Notes on the Sheet component

`components/ui/sheet.tsx` is positioned `absolute` so it stays within the phone-width `.app-shell` frame instead of covering the full browser viewport, which fits the mobile-first layout used throughout. If you later remove the centered phone-frame shell and go edge-to-edge on desktop, switch its positioning back to `fixed`.
