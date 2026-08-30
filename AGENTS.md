# SmartKit Boilerplate — Code Conventions

Rules for AI coding assistants working inside `smartkit/`. These rules describe
how this boilerplate is actually structured. Higher-priority rules live
elsewhere: the repository-root `AGENTS.md` (monorepo conventions, thesis
formatting) and `.cursor/rules/*.mdc` (per-domain best practices, loaded
automatically by Cursor AI through the repository-root `CLAUDE.md` manifest).
When those files and this one disagree, defer to them.

## Project Shape

- Next.js 16 App Router, TypeScript 5.7 strict mode
- Feature-based layout: all feature code lives under `src/features/{name}/`
- Zod 4 for schema validation, Drizzle ORM for the database, Biome for lint/format
- Vitest + Testing Library + Happy DOM for tests (`vitest.config.ts`)
- Authentication via Better Auth; email via Resend + React Email templates

## Feature Directories

- Place all feature code under `src/features/{name}/`
- Default subdirectories: `components/`, `hooks/`, `actions/`, `lib/`, `types/`, `emails/`
- This layout is a strong default, not an enforcement: when a feature only has
  one or two utility files, placing them at the feature root is fine
  (e.g. `src/features/billing/types.ts`)

## Server/Client Boundaries

- Client Components: `'use client'` directive at the top of the file
- Server-only utilities: `server-only` import to prevent client bundling
- Do not use `.server.ts` / `.client.tsx` filename conventions — this project
  does not use them
- Never pass event handlers to Client Component props from Server Components

## Schema Sharing

- Zod schemas are defined once in the feature `types/` directory
- The same schemas validate payloads on the client before submission and on
  the server inside route handlers and server actions
- Keep type definitions explicit; avoid `any` types

## Data Flow

- Server Components read data directly (DB access, env vars)
- Server Actions in `features/{name}/actions/` handle writes
- Call `revalidatePath` after mutations to refresh cached routes
- There is no client-side cache layer; Client Components receive data through
  props or server actions

## Test Organization

- Test files are **centralized** under `src/tests/features/{name}/`
- Structure mirrors the feature layout:
  - `src/tests/features/billing/payment-content.test.ts`
  - `src/tests/features/billing/components/PlanCard.test.tsx`
- Use `@/` alias for all imports (e.g. `@/features/billing/...`, `@/tests/utils`)
- Do **not** use `__tests__/` subfolders — use `components/` subfolder for component tests
- Naming convention: `foo.test.ts` for utilities, `Foo.test.tsx` for components
- Modules that import `server-only` need mock factories with hoisted `vi.fn()`
  references (see `process-sepay-payload.test.ts` for the pattern)

## Quality Scripts

- `pnpm lint` — Biome check
- `pnpm check-types` — TypeScript strict check
- `pnpm test:run` — Vitest suite
- `pnpm db:generate` / `pnpm db:migrate` — Drizzle schema migrations
