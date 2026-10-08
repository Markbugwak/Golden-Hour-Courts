import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const secretKey = Deno.env.get("PAYMONGO_SECRET_KEY");
  const appBaseUrl = Deno.env.get("APP_BASE_URL");

  if (!supabaseUrl || !anonKey || !serviceKey || !secretKey || !appBaseUrl) {
    return json({ error: "Payment service is not configured." }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Authentication required." }, 401);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: "Authentication required." }, 401);

  const body = await req.json().catch(() => ({}));
  const bookingId = body.booking_id;
  if (!bookingId) return json({ error: "booking_id is required." }, 400);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .select("id,booking_reference,user_id,status,total_amount,currency,hold_expires_at,courts(name)")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (bookingError || !booking) return json({ error: "Booking not found." }, 404);
  if (booking.status !== "pending_payment") return json({ error: "Booking is not awaiting payment." }, 409);
  if (booking.hold_expires_at && new Date(booking.hold_expires_at).getTime() <= Date.now()) {
    return json({ error: "This booking hold has expired. Please choose another slot." }, 409);
  }

  const { data: existing } = await admin
    .from("payments")
    .select("id,provider_checkout_id,provider_checkout_url,status")
    .eq("booking_id", booking.id)
    .single();

  if (existing?.status === "paid") {
    return json({ error: "This booking is already paid." }, 409);
  }

  if (existing?.provider_checkout_url && existing.provider_checkout_id && existing.status === "pending") {
    return json({ checkout_url: existing.provider_checkout_url, checkout_id: existing.provider_checkout_id });
  }

  const checkoutPayload = {
    data: {
      attributes: {
        line_items: [{
          name: `${booking.courts?.name || "Golden Hour Court"} — Pickleball Session`,
          amount: booking.total_amount * 100,
          currency: booking.currency,
          quantity: 1,
        }],
        payment_method_types: ["card", "gcash", "qrph"],
        success_url: `${appBaseUrl.replace(/\/$/, "")}/payment/success?reference=${encodeURIComponent(booking.booking_reference)}`,
        cancel_url: `${appBaseUrl.replace(/\/$/, "")}/payment/cancelled?reference=${encodeURIComponent(booking.booking_reference)}`,
        reference_number: booking.booking_reference,
        description: "Golden Hour Courts pickleball reservation",
        send_email_receipt: true,
        show_description: true,
        show_line_items: true,
        metadata: {
          booking_id: booking.id,
          booking_reference: booking.booking_reference,
        },
      },
    },
  };

  const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${secretKey}:`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkoutPayload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json({ error: result?.errors?.[0]?.detail || "Unable to create PayMongo checkout." }, 502);
  }

  const checkout = result?.data;
  const checkoutId = checkout?.id;
  const checkoutUrl = checkout?.attributes?.checkout_url;
  if (!checkoutId || !checkoutUrl) return json({ error: "PayMongo returned an invalid checkout session." }, 502);

  const { error: paymentError } = await admin
    .from("payments")
    .update({
      provider: "paymongo",
      provider_checkout_id: checkoutId,
      provider_checkout_url: checkoutUrl,
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("booking_id", booking.id);

  if (paymentError) return json({ error: "Checkout was created but could not be linked to the booking." }, 500);

  return json({ checkout_url: checkoutUrl, checkout_id: checkoutId });
});
