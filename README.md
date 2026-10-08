# Golden Hour Courts
Premium React + Vite + Supabase pickleball court booking for Cebu, Philippines.

## Business defaults
- 5 starter courts
- ₱450 per court/hour
- 4:00 PM–3:00 AM daily
- Asia/Manila timezone
- Payment is required before a booking becomes confirmed

## Stack
React 19, Vite, Tailwind CSS v4, React Router, Supabase Auth/Postgres, Three.js, React Three Fiber, Drei, GSAP + ScrollTrigger, and Lenis.

## Setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the public Supabase project values.
4. Run `npm install`.
5. Run the Supabase migrations in order: `001_initial_schema.sql`, `002_rls.sql`, `003_booking_functions.sql`, `004_booking_cancellation.sql`, `005_availability_function.sql`.
6. Run `npm run dev`.
7. Run `npm run build` before deployment.

Never commit service-role keys or PayMongo secret keys. Browser code only uses the public Supabase URL and anon key.

## Environment variables
- `VITE_SUPABASE_URL` — Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — public anon key.
- `PAYMONGO_SECRET_KEY` — server/Edge Function only; not read by this browser app.
- `PAYMONGO_WEBHOOK_SECRET` — server/Edge Function only.
- `APP_BASE_URL` — server-side payment redirect configuration.

## Route map
- `/` — Home and 3D/parallax experience
- `/courts` — active courts from Supabase
- `/availability` — protected live availability and booking hold flow
- `/login` — email/password sign-in
- `/register` — email/password registration
- `/reservations` — protected user's reservations and cancellation
- `*` — NotFound

## Booking behavior
Availability reads occupied ranges through the database availability function because the existing RLS intentionally prevents customers from reading other users' bookings directly. Creating a booking calls the existing `create_booking_hold` database function, which performs the authoritative overlap check. Cancellation calls `cancel_booking`. The current repository creates a payment-pending hold; a verified PayMongo webhook must be added before treating a booking as paid/confirmed.

## Images
No fake court photographs are committed. Put real photos at `public/images/courts/court-1.jpg` through `court-5.jpg`. The UI uses a CSS court illustration fallback whenever an image is missing or returns 404.

## 3D / motion
The Home page uses a procedural Three.js pickleball with a generated bump texture; no external 3D model is used. The 3D layer is lazy-loaded, caps DPR at 2, pauses when the page is hidden or the hero leaves the viewport, and falls back on reduced-motion/low-power devices. GSAP ScrollTrigger is used only for transform/opacity parallax. Lenis is loaded for the Home scrolling layer.

## Tuning
- Hero ball rotation: `src/components/Hero3D.jsx`, the `useFrame` rotation rates.
- Hero float speed/intensity: the `<Float>` props in `Hero3D.jsx`.
- Parallax layer speed: each `.parallax-layer` uses `data-speed` in `src/pages/Home.jsx`.
- Parallax scrub timing: the GSAP ScrollTrigger `start`, `end`, and `scrub` values in `Home.jsx`.
- Booking hold duration: 15 minutes in the existing database function call.

## Assumptions
- Live booking pages require authentication because the existing RLS policies do not allow anonymous booking creation.
- Availability is protected because the existing RLS policies do not expose other customers' booking rows; migration 005 exposes only occupied time ranges, not customer or payment data.
- The exact street address, phone, amenities, cancellation policy, merchant credentials, and payment provider webhook endpoint were not invented.
- Real court photography is intentionally omitted; missing images use the CSS fallback.
- The supplied database migrations are the source of truth for table and column names; no existing table or column was renamed.

## PayMongo
Payment integration remains a server-side boundary. Before live use, verify current PayMongo checkout, API, webhook signature, event, retry/idempotency, and payment-method requirements against official PayMongo documentation and test end-to-end in test mode. Never treat a browser redirect as payment proof.
