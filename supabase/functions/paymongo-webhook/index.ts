import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
};

const hmac = async (secret: string, value: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
};

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const webhookSecret = Deno.env.get("PAYMONGO_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!webhookSecret || !supabaseUrl || !serviceKey) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("Paymongo-Signature") || "";
  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
    const [key, ...value] = part.split("=");
    return [key, value.join("=")];
  }));
  const timestamp = parts.t;
  const provided = parts.li || parts.te;
  if (!timestamp || !provided) return new Response("Invalid signature", { status: 401 });

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return new Response("Stale webhook", { status: 401 });

  const expected = await hmac(webhookSecret, `${timestamp}.${rawBody}`);
  if (!timingSafeEqual(expected, provided)) return new Response("Invalid signature", { status: 401 });

  const payload = JSON.parse(rawBody);
  const event = payload?.data;
  const eventType = event?.type;
  if (eventType !== "checkout_session.payment.paid") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = event?.attributes?.data;
  const attributes = session?.attributes || {};
  const reference = attributes.reference_number;
  const checkoutId = session?.id;
  const payments = attributes.payments || [];
  const paidPayment = payments.find((item: any) => item?.attributes?.status === "paid") || payments[0];
  const providerPaymentId = paidPayment?.id || null;

  if (!reference || !checkoutId) return new Response("Missing checkout data", { status: 400 });

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .select("id,status,hold_expires_at,total_amount,currency")
    .eq("booking_reference", reference)
    .single();

  if (bookingError || !booking) return new Response("Booking not found", { status: 404 });

  const { error: paymentError } = await admin
    .from("payments")
    .update({
      provider_checkout_id: checkoutId,
      provider_payment_id: providerPaymentId,
      provider_event_id: event?.id || null,
      status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("booking_id", booking.id);

  if (paymentError) return new Response("Payment update failed", { status: 500 });

  const holdActive = !booking.hold_expires_at || new Date(booking.hold_expires_at).getTime() > Date.now();
  if (booking.status === "pending_payment" && holdActive) {
    const { error: bookingUpdateError } = await admin
      .from("bookings")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", booking.id)
      .eq("status", "pending_payment");
    if (bookingUpdateError) return new Response("Booking confirmation failed", { status: 500 });
  } else if (booking.status === "pending_payment") {
    await admin
      .from("payments")
      .update({ status: "refund_pending", updated_at: new Date().toISOString() })
      .eq("booking_id", booking.id);
    await admin
      .from("bookings")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", booking.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
