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

### 1. Install dependencies
```bash
cd ace-frontend && npm install @tanstack/react-query
```

### 2. Create API client (`lib/api.ts`)
- Base fetch wrapper: `apiFetch<T>(path, options?)` wrapping native fetch
- Base URL from `NEXT_PUBLIC_API_URL`
- Auto-attach `Authorization: Bearer <token>` from module-level variable
- `credentials: "include"` on all requests (refresh token cookie)
- On 401: call `/api/auth/refresh`, store new accessToken, retry original request once
- Token stored in module-scope variable (not localStorage — XSS-safe, not state — avoids re-renders)

### 3. Create TanStack Query client (`lib/query-client.ts`)
- Export `getQueryClient()` singleton for client components
- Config: `staleTime: 30_000`, `retry: 1`

### 4. Create query hooks (`lib/queries/events.ts`)
Custom hooks per endpoint — colocates cache keys, fetch logic, and invalidation:
- `useEventsQuery(category?)` — GET `/api/events`, key: `["events", { category }]`, `enabled: !!user`
- `useEventQuery(id)` — GET `/api/events/:id`, key: `["events", id]`, `enabled: !!user`
- `useCreateEventMutation()` — POST `/api/events`, invalidates `["events"]`
- `useUpdateEventMutation()` — PUT `/api/events/:id`, invalidates `["events"]`
- `useDeleteEventMutation()` — DELETE `/api/events/:id`, invalidates `["events"]`
- `useJoinEventMutation()` — POST `/api/events/:id/join`, invalidates `["events"]` + `["events", id]`
- `useLeaveEventMutation()` — DELETE `/api/events/:id/join`, invalidates `["events"]` + `["events", id]`

### 5. Create auth hooks (`lib/queries/auth.ts`)
- `useLoginMutation()` — POST `/api/auth/login`, calls `setSession()` on auth context
- `useRegisterMutation()` — POST `/api/auth/register`, same

### 6. Rewrite `context/auth-context.tsx`
- `setSession(user, accessToken)` — stores token in module variable, user in state
- `logout()` — clears token + user state
- On mount: attempt silent refresh via `/api/auth/refresh` to restore session
- Exposes `isLoading` for initial auth check
- Remove role picker from login (backend determines role)

### 7. Remove `context/events-context.tsx`
- Components import hooks directly from `lib/queries/events.ts`
- `joinedIds` derived at component level: `event.participants.some(p => p.id === user.id)`

### 8. Update `app/providers.tsx`
- Add `QueryClientProvider` wrapping children
- Keep `AuthProvider` (owns user/token state)
- Remove `EventsProvider`

### 9. Update `lib/types.ts`
- Backend categories are UPPERCASE (`CLINIC`, `SINGLES_LADDER`) — add mapping utility
- Add `Participant` interface: `{ id: string; name: string }`
- Change `ClubEvent.joined: string[]` → `ClubEvent.participants: Participant[]`
- Add `ApiUser`: `{ id: string; name: string; email: string; role: string }`

### 10. Adapt pages/components
Pattern change across all event consumers:
- `useEvents()` → `useEventsQuery()` + destructure `{ data, isLoading }`
- `joinedIds.has(id)` → `event.participants.some(p => p.id === user?.id)`
- `event.joined.length` → `event.participants.length`
- Derive initials from `participant.name` for avatar display
- Mutations return promises — handle `isPending`/`isError` in UI

Files to update:
- `app/feed/page.tsx` — useEventsQuery + loading state
- `app/my-events/page.tsx` — filter by user participation
- `app/events/[id]/page.tsx` — useEventQuery, join/leave mutations
- `app/admin/events/new/page.tsx` — useCreateEventMutation
- `app/admin/events/[id]/edit/page.tsx` — useUpdateEventMutation + delete
- `app/login/page.tsx` — useLoginMutation, remove role picker, add error display
- `components/event-card.tsx` — participants array for avatar display

### 11. Add `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 12. Route protection
- Create `components/auth-guard.tsx` — wraps pages, redirects to `/login` if no user
- Create `components/admin-guard.tsx` — redirects to `/feed` if role !== ADMIN
- Wrap `/feed`, `/my-events`, `/events/*` with auth guard
- Wrap `/admin/*` with admin guard
- Alternative: Next.js middleware — but component-based is simpler with client-side auth

### 13. Category enum mapping
- Backend sends UPPERCASE: `CLINIC`, `DOUBLES`, `SINGLES_LADDER`, `SOCIAL`, `JUNIOR`
- Frontend displays: `"Clinic"`, `"Doubles"`, `"Singles ladder"`, `"Social"`, `"Junior"`
- Add `categoryFromApi()`/`categoryToApi()` utils in `lib/types.ts`
- Update `EventCard`'s `categoryBadgeVariant` to work with mapped values
- Forms send UPPERCASE to backend

### 14. CORS credentials verification
- Backend must have `cors({ origin: "http://localhost:3000", credentials: true })`
- Required for `credentials: "include"` (sends refresh token cookie cross-origin)
- Check `src/index.ts` CORS config — add `credentials: true` if missing

### 15. Query `enabled` flag
- All event queries need `enabled: !!user` — prevents firing before auth resolves
- Without this: queries fire on mount → 401 → unnecessary refresh attempt

### 16. Logout clears query cache
- On `logout()`: call `queryClient.clear()` to purge cached event data
- Prevents stale data leaking between user sessions

### 17. Error handling
- Mutations: inline error message from API response (e.g., "Event is full", "Already joined")
- Network failures: toast or inline "Connection failed, try again"
- 403 on admin routes: redirect to feed
- Keep simple — no global error boundary needed for v1

### 18. Loading states
- Feed/my-events: skeleton cards or simple spinner while `isLoading`
- Event detail: skeleton layout
- Mutations: button shows `isPending` state (disable + "Joining..." text)

### 19. Missing pages in step 10
Additional files to update (missed in original list):
- `app/admin/page.tsx` — uses `useEvents()`, needs `useEventsQuery()`
- `app/admin/events/[id]/page.tsx` — uses `getEvent()`, `deleteEvent()`, `event.joined` refs

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
10. Visit `/admin` as participant -> redirected to `/feed`
11. Visit `/feed` while logged out -> redirected to `/login`
12. Join full event -> shows "Event is full" error, not crash
13. Refresh page mid-session -> stays logged in (silent refresh works)
