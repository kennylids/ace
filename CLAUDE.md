# ACE - Athletics Club Events

A fullstack web application for managing athletics club events (clinics, doubles, singles ladder, social, junior categories). Members can browse events, join/leave them, and admins can create/manage events.

## Tech Stack

### Frontend (`ace-frontend/`)
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Radix UI primitives + shadcn/ui components
- **Language**: TypeScript (strict)

### Backend (`ace-backend/`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict, NodeNext modules)
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken) + bcrypt password hashing
- **Validation**: Zod
- **Security**: Helmet, CORS, cookie-parser

## Project Structure

```
ace/
├── ace-frontend/          # Next.js app
│   ├── app/               # App Router pages
│   ├── components/        # UI components
│   ├── context/           # React context providers
│   ├── lib/               # Utilities
│   └── data/              # Static/mock data
├── ace-backend/           # Express API
│   ├── src/
│   │   ├── config/        # Environment config
│   │   ├── middleware/    # Auth guard, error handler
│   │   ├── routes/        # Route definitions (auth, events, users)
│   │   ├── services/      # Business logic (auth, events)
│   │   └── utils/         # Helpers
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed data
└── CLAUDE.md
```

## Commands

### Backend
```bash
cd ace-backend
npm run dev              # Start dev server (tsx watch)
npm run build            # Compile TypeScript
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset database (destructive)
```

### Frontend
```bash
cd ace-frontend
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
```

### Database
```bash
cd ace-backend
docker compose up -d     # Start PostgreSQL
docker compose down      # Stop PostgreSQL
```

## Development Setup

1. Start PostgreSQL: `cd ace-backend && docker compose up -d`
2. Run migrations: `npm run db:migrate`
3. Seed data: `npm run db:seed`
4. Start backend: `npm run dev`
5. Start frontend: `cd ../ace-frontend && npm run dev`

## Key Patterns

- **API routes**: `/api/auth/*`, `/api/events/*`, `/api/users/*`
- **Auth flow**: JWT tokens stored in HTTP-only cookies
- **Validation**: Zod schemas validate request bodies in routes
- **Error handling**: Centralized error middleware catches thrown errors
- **DB access**: Prisma client used in service layer, not directly in routes

## Coding Guidelines

- When explaining backend concepts (middleware, auth, DB design, API patterns), provide structured explanations with purpose/steps and practical learning tips
- The developer is learning backend — prioritize clarity and "why" over brevity for architectural decisions
- TypeScript strict mode in both projects — always use type annotations on function signatures
- No docstrings unless behavior is non-obvious
- Prefer short functions, no dead code
