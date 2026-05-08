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
- **State Management:** React Context (Performance Tracking)
- **Validation:** Zod
- **UI Components:** Radix UI (shadcn/ui)
- **Notifications:** Sonner

---

## Architecture & Patterns

### 1. Adaptive Performance (`@/components/performance-provider.tsx`)
- **Detection Logic:** Automatically identifies "low-end" devices based on:
  - Hardware Specs: RAM < 4GB or Logical CPU Cores < 4.
  - User Preferences: `prefers-reduced-motion` enabled.
  - Network Conditions: `Save Data` mode active.
- **Implementation:** Always use the `usePerformance()` hook to conditionally disable or simplify heavy features (Smooth Scroll, Custom Cursor, 3D Tilts, Backdrop Blurs).

### 2. UI & Animations (GSAP)
- **Optimization:** Use `gsap.quickTo` for frequent updates like mouse-follow or tilt effects to maintain 60fps.
- **Scroll Triggers:** Consolidate multiple ScrollTriggers into single timelines to minimize main-thread overhead.
- **Hardware Acceleration:** Apply `will-change-transform` to layers moving during scroll.
- **Mobile Parallax:** Use `gsap.matchMedia` to disable scroll-based parallax on touch devices (`pointer: coarse`) to prevent lag.

### 3. SEO & Structured Data (`@/components/seo-json-ld.tsx`)
- **Schema types:** `Restaurant`, `FAQPage`, `BreadcrumbList`.
- **Testimonials:** Always mirror guest testimonials in the `restaurantSchema` using `aggregateRating` and `review` arrays to boost local search visibility.

### 4. Data Layer (`/db` & `/lib/content.ts`)
- **Database Connection:** Use the cached connection pool in `db/index.ts`.
- **Transactions:** Use `db.transaction()` for multi-step updates (e.g., delete-and-batch-insert for menu).
- **Server Isolation:** Use the `"server-only"` directive for sensitive files.

### 5. Administrative Security (`/lib/admin-auth.ts`)
- **Authentication:** Native Node `crypto` flow with HttpOnly, Secure, Lax cookies.
- **Timing Attacks:** Always use `crypto.timingSafeEqual()` for verification.

---

## Development Workflows

### Database Migrations
1. Modify `db/schema.ts`.
2. Generate migration: `npx drizzle-kit generate`.
3. Push to DB: `npx drizzle-kit push`.

### Layout Standards
- **Typography:** Ensure subheaders use `tracking-normal` and sufficient padding on mobile to prevent overflow.
- **Interactive Elements:** Use horizontal scroll indicators (e.g., in Menu tabs) on mobile to signal hidden content.

---

## Core Mandates & Constraints
- **Performance First:** No lag on mobile. If a feature drops FPS below 30 on budget devices, it MUST be simplified or disabled via `isLowEnd`.
- **Zero-Tolerance for 500s:** API routes must never crash. Always wrap risky operations in try/catch or use Zod safe parsing.
- **Mobile First:** All sections, including the Admin panel and large data tables, must be fully functional and elegantly constrained on mobile.
- **No Volatile Storage:** All content must persist in the Neon PostgreSQL database; do not use local JSON for production data.
