# Zeemac Filters — Next.js

## Phase 1a: scaffold + schema + auth
## Phase 1b: homepage
## Phase 1c: Featured Products (live) + product admin
## Phase 2a: product listing + detail pages
## Phase 2b: Category & Brand admin + public pages
(See earlier phase notes — unchanged in this delivery.)

## SEO pass (this delivery)
- **`app/sitemap.js`** — now dynamic: includes every active product,
  category, and brand from the database (not just the static homepage
  routes). Regenerates automatically as products are added/removed.
- **`app/robots.js`** — allows all crawling except `/admin` and `/api`,
  points crawlers to `/sitemap.xml`.
- **Structured data (JSON-LD)** added to:
  - Product detail pages — `Product` schema (name, image, SKU/part number,
    brand, category, description from the SEO fields) + `BreadcrumbList`
  - Category and Brand detail pages — `BreadcrumbList`
  - (Organization/WebSite schema was already on every page via the root layout)

### Still not done (by your call, for later)
- RFQ backend (still WhatsApp handoff)
- Privacy Policy / Terms & Conditions pages (footer links are still `#`)
- Multi-select filters, Lenis smooth scroll

## Setup
```bash
cp .env.example .env      # edit ADMIN_EMAIL and JWT_SECRET at minimum
npm install
npm run db:push           # creates prisma/dev.db from the schema
npm run db:seed           # populates categories + brands
npm run dev
```
Check `http://localhost:3000/sitemap.xml` and `/robots.txt` once products
exist to confirm they're listed.

## A note on this delivery
Same limitation as every phase so far: Prisma's engine binary and Google
Fonts aren't reachable from this sandbox. A test build with fonts stubbed
out compiled successfully, including the new sitemap/robots routes and
JSON-LD additions. `npm install && npm run dev` on your own machine is the
real check.

## Stack
Next.js 15 · Tailwind CSS v4 · GSAP + ScrollTrigger · lucide-react · Prisma + SQLite · jose (JWT) · nodemailer · sharp
