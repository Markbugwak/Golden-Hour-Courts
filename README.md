# Golden Hour Courts
Premium pickleball reservation platform for Cebu, Philippines.

## Business defaults
- 5 starter courts
- ₱450 per court/hour
- 4:00 PM–3:00 AM Asia/Manila
- Payment required before confirmation

## Frontend
React + Vite + Tailwind CSS. The public experience includes Home, Courts, Availability, authentication screens, and My Reservations.

## Supabase
Apply migrations in order. The database seeds exactly five initial courts while keeping courts dynamically managed. Customer booking creation should use the trusted database function or Edge Functions; do not expose service-role credentials in browser code.

## PayMongo
Payment boundaries are prepared for a server-side checkout/webhook integration. Configure PayMongo secrets only as Supabase Edge Function secrets. Never treat a browser success redirect as payment proof; confirmation must come from a verified provider webhook.

Before live use, verify the current PayMongo API, checkout, webhook signature, supported payment methods, retry/idempotency and event details against the official PayMongo developer documentation, then run a real test-mode end-to-end payment.

## Business details
The exact street address, phone, amenities, cancellation policy and merchant credentials are intentionally not invented and must be configured before launch.
