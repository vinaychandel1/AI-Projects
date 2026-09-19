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

## Status & Features
- **ALL PHASES COMPLETE**: The project is now fully production-ready.
    - **Foundation**: Monorepo setup, Database schema with Prisma, Auth.js v5.
    - **AI Engine**: Advanced resume parsing, 3-layer AI matching engine, skill normalization.
    - **Integration**: Modular Job Source adapters (`MockJobSourceAdapter`), job ingestion API, Job Board UI, AI provider abstraction (`MockAIProvider`).
    - **Tools**: Job application Kanban tracker, automated job alerts.

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL v16+
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vinaychandel1/AI-Projects.git
   cd "AI-Projects/job aggregation"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in `apps/web` and `packages/db` based on `.env.example`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/skillmatch"
   AUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
4. Run database migrations:
   ```bash
   npm run db:push
   ```

### Running the App
- Start the development server:
  ```bash
  npm run dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

### Hosting (Production)
- **Frontend**: Deploy `apps/web` on Vercel or Netlify.
- **Database**: Use a managed Postgres service like Neon, Supabase, or AWS RDS.
- **Build**: Ensure `DATABASE_URL` and `AUTH_SECRET` are set in your production environment settings.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
