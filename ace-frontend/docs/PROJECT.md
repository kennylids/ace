# Ace — Tennis Club Event Platform

## Overview

Ace is a mobile-first web app for tennis clubs to publish events (clinics, mixers, ladder matches) and for members to browse and join them. Two user roles — **participant** and **admin** — each with a distinct experience.

## Architecture

```
ace-frontend (Next.js 14, App Router)  →  ace-backend (Express + TypeScript)
                                              ├── PostgreSQL (Docker)
                                              ├── JWT auth (bcrypt + httpOnly cookies)
                                              └── Raw SQL via node-postgres (pg)
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend Framework | Next.js 14 (App Router) |
| Backend Framework | Express.js |
| Language | TypeScript (strict) |
| Database | PostgreSQL 16 (Docker) |
| DB Client | node-postgres (pg) — raw SQL |
| Auth | Custom JWT (access + refresh tokens) |
| Validation | Zod |
| UI primitives | Radix UI (Dialog, Sheet, Select, Avatar, Progress, Label, Separator) |
| Styling | Tailwind CSS + tailwindcss-animate |
| Component variants | class-variance-authority (CVA) |
| Icons | Lucide React |

## Features

### Authentication

- Email + password login with JWT tokens
- Access token (15min) in response body, refresh token (7d) in httpOnly cookie
- Role-based access: participant or admin
- Role determines post-login redirect and available views

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

## API Endpoints

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Yes |

### Events
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/events` | Yes |
| GET | `/api/events/:id` | Yes |
| POST | `/api/events` | Admin |
| PUT | `/api/events/:id` | Admin |
| DELETE | `/api/events/:id` | Admin |
| POST | `/api/events/:id/join` | Yes |
| DELETE | `/api/events/:id/join` | Yes |

### Users
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/users` | Admin |

## Data Model

- **Users** — id, name, email, password (bcrypt), role (ADMIN/PARTICIPANT)
- **Events** — id, title, category, date, time, location, capacity, description, created_by
- **EventParticipants** — user_id + event_id (unique constraint), joined_at

## Project Structure

```
ace-frontend/
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

ace-backend/
  src/
    config/         → env vars, pg pool
    middleware/     → auth guards, error handler
    routes/         → auth, events, users
    services/       → business logic (raw SQL)
    utils/          → JWT, bcrypt helpers
  migrations/       → SQL migration files
  scripts/          → migrate.ts, seed.ts
  docker-compose.yml
```

## Running Locally

```bash
# Start database
cd ace-backend
docker compose up -d

# Run migrations & seed
npm run db:migrate
npm run db:seed

# Start backend (port 3001)
npm run dev

# Start frontend (port 3000)
cd ../ace-frontend
npm run dev
```

### Default accounts
- Admin: `admin@ace.club` / `password123`
- Participant: `maya@example.com` / `password123`
