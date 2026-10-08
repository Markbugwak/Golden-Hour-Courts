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
5. Run the Supabase migrations in order: `001_initial_schema.sql` through `006_paymongo_checkout.sql`.
6. Run `npm run dev`.
7. Run `npm run build` before deployment.

Never commit service-role keys or PayMongo secret keys. Browser code only uses the public Supabase URL and anon key.

## Payment flow
The booking flow creates a 15-minute `pending_payment` hold. The browser then invokes the `create-paymongo-checkout` Supabase Edge Function. That function creates a PayMongo Hosted Checkout v2 session without exposing the PayMongo secret key to the browser. After payment, PayMongo sends `checkout_session.payment.paid` to `paymongo-webhook`; the webhook verifies the PayMongo signature and is the source of truth for changing the booking to `confirmed`.

PayMongo currently recommends Hosted Checkout v2 for new integrations. Do not treat the browser success redirect as proof of payment. Test the complete flow in PayMongo test mode before using live credentials.

### Supabase Edge Function secrets
Set these in the Supabase project:
- `PAYMONGO_SECRET_KEY`
- `PAYMONGO_WEBHOOK_SECRET`
- `APP_BASE_URL`

Deploy:
```bash
supabase functions deploy create-paymongo-checkout
supabase functions deploy paymongo-webhook --no-verify-jwt
```

Register the deployed `paymongo-webhook` URL in PayMongo Developer Tools → Webhooks and subscribe to `checkout_session.payment.paid`.

## Environment variables
- `VITE_SUPABASE_URL` — Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — public anon key.
- `PAYMONGO_SECRET_KEY` — server/Edge Function only.
- `PAYMONGO_WEBHOOK_SECRET` — server/Edge Function only.
- `APP_BASE_URL` — public application URL used for payment redirects.

## Route map
- `/` — Home and 3D/parallax experience
- `/courts` — active courts from Supabase
- `/availability` — protected live availability and booking hold/payment flow
- `/login` — email/password sign-in
- `/register` — email/password registration
- `/reservations` — protected user's reservations, payment continuation, and cancellation
- `/payment/success` — PayMongo return screen
- `/payment/cancelled` — PayMongo cancellation return screen
- `*` — NotFound

## Booking behavior
Availability reads occupied ranges through the database availability function because the existing RLS intentionally prevents customers from reading other users' booking rows directly. Creating a booking calls the existing `create_booking_hold` database function, which performs the authoritative overlap check. Cancellation calls `cancel_booking`. A booking is not confirmed until the verified PayMongo webhook marks its payment as paid.

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
- The exact street address, phone, amenities, cancellation policy, and merchant credentials were not invented.
- Real court photography is intentionally omitted; missing images use the CSS fallback.
- The supplied database migrations are the source of truth for table and column names; no existing table or column was renamed.

## PayMongo launch checklist
Before going live:
1. Complete PayMongo KYC and enable the payment methods you want to offer.
2. Use a test secret key first.
3. Set the Supabase Edge Function secrets.
4. Deploy both Edge Functions.
5. Register the webhook and subscribe to `checkout_session.payment.paid`.
6. Verify webhook signatures and test successful, cancelled, and failed payment paths.
7. Confirm that paid bookings become `confirmed` only from the webhook.
8. Verify an expired hold cannot be confirmed accidentally.
9. Only then switch to live PayMongo credentials.
