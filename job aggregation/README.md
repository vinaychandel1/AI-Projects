# SkillMatch Jobs

AI-powered job discovery platform featuring resume parsing, skill normalization, a 3-layer AI matching engine, and a modular job source adapter architecture.

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: PostgreSQL, Prisma ORM, pgvector
- **Authentication**: Auth.js v5 (NextAuth)
- **UI**: Tailwind CSS, shadcn/ui

## Project Structure
This is a monorepo managed with npm workspaces:
- `apps/web`: Next.js web application
- `packages/db`: Prisma database schema and client
- `packages/core`: Core domain logic and shared utilities

## Status
Phase 1: Foundation complete (Monorepo, Auth, Profile/Skill Management, UI skeleton).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
