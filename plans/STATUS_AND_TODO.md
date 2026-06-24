# ACE Project — Status Review & TODO

## Current State

### Backend (ace-backend/) — DONE

Fully implemented Express + TypeScript API with raw `pg` (no Prisma — blocked by company policy).

| Component | Status | Files |
|-----------|--------|-------|
| Express app + config | Done | `src/index.ts`, `src/config/env.ts`, `src/config/db.ts` |
| Auth middleware (JWT) | Done | `src/middleware/auth.ts` |
| Error handling | Done | `src/middleware/error.ts` |
| Auth routes + service | Done | `src/routes/auth.routes.ts`, `src/services/auth.service.ts` |
| Events routes + service | Done | `src/routes/events.routes.ts`, `src/services/events.service.ts` |
| Users route | Done | `src/routes/users.routes.ts` |
| JWT + password utils | Done | `src/utils/jwt.ts`, `src/utils/password.ts` |
| SQL migration | Done | `migrations/001_init.sql` |
| Migrate script | Done | `scripts/migrate.ts` |
| Seed script | Done | `scripts/seed.ts` |
| Docker (Postgres) | Done | `docker-compose.yml` |
| TypeScript compiles | Done | Verified clean |

**API endpoints:** auth (register/login/refresh/me), events (CRUD + join/leave), users (list).

---

### Frontend (ace-frontend/) — NOT INTEGRATED

Currently 100% client-side. Uses React Context with in-memory state seeded from `data/sample-events.ts`. No API calls. No real persistence.

| File | Current Behavior | Needs |
|------|-----------------|-------|
| `context/auth-context.tsx` | Fake login — sets name from email, no server call | Call `/api/auth/login`, store JWT, refresh logic |
| `context/events-context.tsx` | In-memory CRUD on `sampleEvents` array | Fetch from `/api/events`, call backend for mutations |
| `app/login/page.tsx` | Submits to context directly | Submit to API, handle errors |
| `app/feed/page.tsx` | Reads from context | No change (context will talk to API) |
| `app/my-events/page.tsx` | Filters joined from context | Same |
| `app/events/[id]/page.tsx` | Uses `event.joined[]` (initials array) | Adapt to API shape (participants: `{id, name}[]`) |
| `app/admin/events/new/page.tsx` | `createEvent()` returns sync | Needs async, handle loading/errors |
| `app/admin/events/[id]/edit/page.tsx` | Same pattern | Same fix |

---

## TODO: Frontend Integration

### 1. Create API client (`lib/api.ts`)
- Base fetch wrapper with `NEXT_PUBLIC_API_URL`
- Auto-attach `Authorization: Bearer <token>` header
- Auto-refresh on 401: call `/api/auth/refresh`, retry original request
- Store access token in memory (not localStorage — XSS risk)

### 2. Rewrite `context/auth-context.tsx`
- `login(email, password)` -> POST `/api/auth/login`
- Store returned `accessToken` in state, `user` object in state
- `logout()` -> clear state
- `register(name, email, password, role)` -> POST `/api/auth/register`
- On mount: try `/api/auth/refresh` to restore session from cookie

### 3. Rewrite `context/events-context.tsx`
- Remove `sampleEvents` import
- `events` state populated by GET `/api/events` on mount (when authenticated)
- `joinedIds` derived from events where current user is in participants list
- `createEvent` -> POST `/api/events` (async, refetch list)
- `updateEvent` -> PUT `/api/events/:id` (async)
- `deleteEvent` -> DELETE `/api/events/:id` (async)
- `joinEvent` -> POST `/api/events/:id/join` (async)
- `unjoinEvent` -> DELETE `/api/events/:id/join` (async)

### 4. Adapt components to new data shape
- `event.joined` (string[] of initials) -> `event.participants` ({id, name}[])
- Derive initials from `name` field for avatar display
- Update `EventCard`, event detail pages, capacity calculation

### 5. Add `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 6. Update `lib/types.ts`
- Match backend response shape (snake_case from pg -> camelCase in frontend)
- Add participant type: `{ id: string; name: string }`
- Update ClubEvent to use participants array instead of joined string[]

---

## Verification

1. `docker compose up -d` in ace-backend — Postgres running
2. `npm run db:migrate` — tables created
3. `npm run db:seed` — sample data loaded
4. `npm run dev` in ace-backend — Express on :3001
5. `npm run dev` in ace-frontend — Next.js on :3000
6. Login as `maya@example.com` / `password123` -> lands on feed with real events
7. Join/leave event -> persists on page refresh
8. Login as `admin@ace.club` / `password123` -> create/edit/delete event works
9. Logout + refresh page -> redirected to login (session gone)
