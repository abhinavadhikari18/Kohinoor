# Kohinoor Restaurant Platform - Development Guidance

## Project Overview
Kohinoor is a premium restaurant platform built with **Next.js (App Router)** and **React 19**. It features a high-fidelity customer-facing site and a secure administrative dashboard for real-time menu and gallery management.

---

## Tech Stack & Core Libraries
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS 4.0 + PostCSS
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Animations:** GSAP (`@gsap/react`) + Lenis (Smooth Scrolling)
- **Validation:** Zod
- **UI Components:** Radix UI (shadcn/ui)
- **Notifications:** Sonner

---

## Architecture & Patterns

### 1. Data Layer (`/db` & `/lib/content.ts`)
- **Database Connection:** Use the cached connection pool in `db/index.ts` to prevent "ECONNRESET" errors during HMR (Hot Module Replacement) in development.
- **Transactions:** Use `db.transaction()` for multi-step updates (e.g., the delete-and-batch-insert strategy used for menu updates).
- **Server Isolation:** Any file containing database queries or sensitive logic MUST use the `"server-only"` directive.
- **Caching:** Use `unstable_noStore()` for data fetching functions that need to reflect real-time changes from the admin panel.

### 2. Administrative Security (`/lib/admin-auth.ts`)
- **Authentication:** Custom credential-based flow using native Node `crypto`.
- **Session:** Stateless JWT-like tokens stored in HttpOnly, Secure, SameSite=Lax cookies.
- **Timing Attacks:** Always use `crypto.timingSafeEqual()` for password/token verification.

### 3. API Routes (`/app/api`)
- **Validation:** Use Zod's `.safeParse()` instead of `.parse()` to handle validation errors gracefully without crashing the server (500).
- **Response Consistency:** Return structured JSON with clear error messages for the UI to consume.

### 4. UI & Animations
- **GSAP:** Use the `@gsap/react` hook for animations. Ensure proper cleanup to avoid memory leaks.
- **Mobile Fallbacks:** For complex 3D or mouse-heavy animations (like the Hero tilt), provide CSS-only fallbacks (`@keyframes`) for touch devices.
- **Responsiveness:** Favor Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) over custom media queries.

---

## Development Workflows

### Database Migrations
Use `drizzle-kit` for schema changes:
1. Modify `db/schema.ts`.
2. Generate migration: `npx drizzle-kit generate`.
3. Push to DB: `npx drizzle-kit push`.
- Common scripts are available in `package.json`: `npm run dev`, `npm run build`, `npm run lint`.

### Admin Access
- Environment variables required: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Local URL: `/admin`.

---

## Core Mandates & Constraints
- **Zero-Tolerance for 500s:** API routes must never crash. Always wrap risky operations in try/catch or use Zod safe parsing.
- **Mobile First:** The Admin panel must be fully functional on mobile devices. Use responsive grids and wrapping flex layouts.
- **No Volatile Storage:** Do not use local JSON files for production data. All content must persist in the Neon PostgreSQL database.
- **Performance:** Utilize batch inserts (`tx.insert().values([...])`) when updating large datasets like the menu or gallery.
