import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_SECRET_KEY"];
        const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret || !webhookSecret) {
          return new Response("Stripe is not configured", { status: 503 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });

        const body = await request.text();
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        if (
          event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded"
        ) {
          const session = event.data.object;
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("payments")
            .update({
              status: session.payment_status === "paid" ? "paid" : "pending",
              paid_at: session.payment_status === "paid" ? new Date().toISOString() : null,
              stripe_payment_intent:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            })
            .eq("stripe_session_id", session.id);
        }

        if (event.type === "checkout.session.expired") {
          const session = event.data.object;
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("payments")
            .update({ status: "unpaid" })
            .eq("stripe_session_id", session.id);
        }

        return new Response("ok");
      },
    },
  },
});
