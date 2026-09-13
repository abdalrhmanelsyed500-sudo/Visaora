# Visaora deployment

## Local development

Requirements:

- Node.js 20.9+ (Node 22 is used in the current workspace)
- npm 10+
- PostgreSQL only when enabling Prisma persistence

```bash
npm install
cp .env.example .env.local
npm run dev
```

The static repository means the website and its tests run without PostgreSQL. `npm run db:seed` needs a reachable `DATABASE_URL`.

## Environment

```dotenv
NEXT_PUBLIC_SITE_URL="https://visaora.example"
DATABASE_URL="postgresql://user:password@host:5432/visaora?schema=public"
ADMIN_PREVIEW="false"
```

Never commit `.env` files or credentials. `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, sitemap locations and JSON-LD. In a real deployment it must be the public HTTPS origin without an accidental staging value.

## Database setup

```bash
npm run db:generate
npm run db:push       # quick environments
npm run db:seed       # metadata + taxonomy only
```

For production, use reviewed Prisma migrations rather than `db push`:

```bash
npx prisma migrate dev --name initial_content_model
npx prisma migrate deploy
npm run db:seed
```

The current checkout may need network access the first time Prisma downloads its platform engine. The app itself does not need that engine until the database adapter is connected.

## Production build

```bash
npm ci
npm run db:generate
npm run db:migrate   # map this to `prisma migrate deploy` in CI
npm run build
npm run start
```

The project is compatible with a Node process or a Next.js-compatible hosting platform. Bind the server to `0.0.0.0` in container/preview environments. `npm run start` already does this.

## Deployment checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- [ ] Set `ADMIN_PREVIEW=false` and connect a real session/auth provider.
- [ ] Run migrations and seed only country/region/category metadata.
- [ ] Configure PostgreSQL backups and connection pooling.
- [ ] Put a shared rate limiter (Redis/edge KV) behind `src/lib/security.ts` for multi-instance deployments.
- [ ] Configure a cache/revalidation webhook after publish/update.
- [ ] Verify `/robots.txt`, `/sitemap.xml`, canonical URLs and Open Graph image.
- [ ] Check admin and private API paths are inaccessible without a valid session.
- [ ] Add CSP/security headers appropriate to the hosting platform; do not ship secrets to the client.
- [ ] Run `npm test`, `npm run typecheck` and `npm run build` in CI.
- [ ] Measure Core Web Vitals on representative country and guide pages.

## Security posture

Public API handlers are read-only, sanitize bounded search input and rate-limit search. Prisma parameterization protects database queries when the adapter is connected. Admin writes are deliberately not shipped until authentication, authorization, CSRF protection and audit logging are implemented behind the boundary. Use secure, httpOnly, sameSite cookies for the eventual admin session.

## Observability and analytics

`analytics.track(event, properties)` is the only UI event boundary. It currently emits a browser custom event and no paid analytics request. A future provider can subscribe to the boundary after privacy review. Useful events include `country_view`, `visa_view`, `search`, `filter`, `share`, `favorite` and `outbound_source_click`.

## Rollback

Application deployments are immutable. Database content is versioned through `Revision`; before publishing a correction, preserve a snapshot. If a slug changes, create a redirect record before changing it. To roll back a guide, restore a prior revision and keep the route canonical stable.
