# RunningCrew

Full-stack running app: Next.js (Vercel) + Express API (Render) + Expo mobile.

## Setup

```bash
npm install
cp api/.env.example api/.env
cp web/.env.example web/.env
cp mobile/.env.example mobile/.env
psql $DATABASE_URL -f api/db/schema.sql
```

## Dev

```bash
npm install --install-links=false   # exFAT/external drive
npm run dev:api   # http://localhost:3001
npm run dev:web   # http://localhost:3000
npm run dev:mobile
```

> Windows external drives (exFAT): use `install-links=false` in `.npmrc` or move project to NTFS.

## Phase 1 (no payment PG)

- Google OAuth login
- 10-day trial → member tier
- Admin manual subscription at `/admin/users`
- Platform stats at `/admin/stats`
- OSM route map with metric coloring

### Subscription scenario tests

```bash
npm run test:subscription --prefix api
```

### Windows note

If `next build` fails with `EISDIR: readlink` on an external drive (exFAT), move the project to an NTFS volume or enable Developer Mode for symlinks. Typecheck still works: `npx tsc --noEmit` in `web/`.
