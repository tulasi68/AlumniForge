# AlumniForge

Simple, clean alumni connect template for any institution.

## Features (Basic)

- **Home** – Feed + quick actions
- **Network** – Alumni directory with search
- **Events** – Upcoming events list
- **Profile** – User profile page
- **Admin** – Simple institution configuration (name, colors, enabled modules)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Edit `lib/config.ts` to change institution name, colors, and which modules are enabled.

This is intentionally kept very simple so any college can customize it easily.

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- TypeScript
- Lucide icons

## Next Steps (optional)

- Add authentication (Clerk / NextAuth)
- Connect a real database (Supabase / Prisma)
- Add real multi-tenant support
- Deploy to Vercel
