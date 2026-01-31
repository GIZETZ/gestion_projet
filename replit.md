# Gestion de Projet - Topic Selection Game

## Overview

This is a classroom project management game where student groups can select topics (labeled A-F) through an interactive card-flipping interface. The application features user registration with admin approval, real-time topic selection with polling, and celebratory confetti animations when topics are chosen.

The app consists of three main flows:
1. **Authentication** - Students register with group info and wait for admin approval
2. **Game** - Approved students see flippable cards and can claim one topic
3. **Admin** - Administrator (at `/ithiel`) approves users and can reset the game

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state with 1-second polling for real-time updates
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for card flip animations, canvas-confetti for celebrations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **Session Management**: express-session with MemoryStore
- **Build Tool**: Vite for client, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with `db:push` command
- **Tables**: 
  - `users` - Group leader info, approval status, admin flag
  - `topics` - Letters A-F with titles and assignment tracking

### Authentication Flow
- Session-based authentication using express-session
- Admin approval required before users can access the game
- Admin role check for protected admin routes
- No password hashing currently implemented (simple password storage)

### API Structure
- REST endpoints defined in `shared/routes.ts` with Zod schemas
- Routes prefixed with `/api`
- Key endpoints: `/api/register`, `/api/login`, `/api/me`, `/api/topics`, `/api/admin/*`

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route pages (Auth, Game, Admin)
    hooks/        # Custom hooks for auth, topics, admin
    lib/          # Query client and utilities
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Drizzle database connection
shared/           # Shared between client/server
  schema.ts       # Drizzle schema definitions
  routes.ts       # API contract with Zod schemas
```

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database queries

### UI Libraries
- shadcn/ui components (Radix UI primitives)
- Framer Motion for animations
- canvas-confetti for celebration effects
- Lucide React for icons

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `express-session` / `memorystore` - Session handling
- `wouter` - Client-side routing
- `zod` - Runtime type validation

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session signing (optional, defaults to "secret")