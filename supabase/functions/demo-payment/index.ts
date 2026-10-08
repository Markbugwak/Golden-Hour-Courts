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

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "Demo payment service is not configured." }, 500);
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
    .select("id,booking_reference,user_id,status,total_amount,currency,hold_expires_at")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (bookingError || !booking) return json({ error: "Booking not found." }, 404);
  if (booking.status !== "pending_payment") return json({ error: "Booking is not awaiting payment." }, 409);
  if (booking.hold_expires_at && new Date(booking.hold_expires_at).getTime() <= Date.now()) {
    return json({ error: "This booking hold has expired. Please choose another slot." }, 409);
  }

  const { data: payment, error: paymentError } = await admin
    .from("payments")
    .select("id,status")
    .eq("booking_id", booking.id)
    .single();

  if (paymentError || !payment) return json({ error: "Payment record not found." }, 404);
  if (payment.status === "paid") return json({ success: true, booking_reference: booking.booking_reference, already_paid: true });

  const now = new Date().toISOString();

  const { error: updatePaymentError } = await admin
    .from("payments")
    .update({
      provider: "demo",
      status: "paid",
      provider_payment_id: `demo_${booking.id}`,
      updated_at: now,
    })
    .eq("id", payment.id);

  if (updatePaymentError) return json({ error: "Unable to complete demo payment." }, 500);

  const { error: updateBookingError } = await admin
    .from("bookings")
    .update({
      status: "confirmed",
      hold_expires_at: null,
      updated_at: now,
    })
    .eq("id", booking.id)
    .eq("user_id", user.id)
    .eq("status", "pending_payment");

  if (updateBookingError) {
    await admin.from("payments").update({ status: "pending", provider: "demo", updated_at: new Date().toISOString() }).eq("id", payment.id);
    return json({ error: "Unable to confirm the reservation." }, 500);
  }

  return json({ success: true, booking_reference: booking.booking_reference, amount: booking.total_amount, currency: booking.currency, demo: true });
});
