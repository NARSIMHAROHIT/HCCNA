import { createFileRoute } from "@tanstack/react-router";

/**
 * Square webhook receiver.
 *
 * Point a Square webhook subscription at  https://<your-domain>/api/public/webhooks/square
 * and subscribe to `payment.created`, `payment.updated` and `order.updated`.
 *
 * Square signs the request with HMAC-SHA256 over (notification URL + raw body),
 * so SQUARE_WEBHOOK_URL must match the URL configured in Square exactly. It
 * falls back to the request URL, which is correct unless a proxy rewrites it.
 */

interface SquarePaymentObject {
  id?: string;
  order_id?: string;
  status?: string;
}

interface SquareWebhookBody {
  type?: string;
  data?: {
    object?: {
      payment?: SquarePaymentObject;
      order_updated?: { order_id?: string; state?: string };
      order?: { id?: string; state?: string };
    };
  };
}

export const Route = createFileRoute("/api/public/webhooks/square")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signatureKey = process.env["SQUARE_WEBHOOK_SIGNATURE_KEY"];
        if (!signatureKey) return new Response("Square is not configured", { status: 503 });

        const signature = request.headers.get("x-square-hmacsha256-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });

        const rawBody = await request.text();
        const notificationUrl = process.env["SQUARE_WEBHOOK_URL"] ?? request.url;

        const { verifySquareWebhook } = await import("@/lib/square.server");
        const valid = await verifySquareWebhook(rawBody, signature, notificationUrl, signatureKey);
        if (!valid) return new Response("Invalid signature", { status: 401 });

        let body: SquareWebhookBody;
        try {
          body = JSON.parse(rawBody) as SquareWebhookBody;
        } catch {
          return new Response("Invalid body", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const type = body.type ?? "";

        if (type === "payment.created" || type === "payment.updated") {
          const payment = body.data?.object?.payment;
          const orderId = payment?.order_id;
          if (!orderId) return new Response("ok");

          if (payment?.status === "COMPLETED" || payment?.status === "APPROVED") {
            const paid = payment.status === "COMPLETED";
            await supabaseAdmin
              .from("payments")
              .update({
                status: paid ? "paid" : "pending",
                paid_at: paid ? new Date().toISOString() : null,
                square_payment_id: payment.id ?? null,
              })
              .eq("square_order_id", orderId);
          }

          if (payment?.status === "CANCELED" || payment?.status === "FAILED") {
            await supabaseAdmin
              .from("payments")
              .update({ status: "unpaid" })
              .eq("square_order_id", orderId);
          }

          return new Response("ok");
        }

        if (type === "order.updated") {
          const orderId =
            body.data?.object?.order_updated?.order_id ?? body.data?.object?.order?.id;
          if (!orderId) return new Response("ok");

          // Confirm against the Orders API rather than trusting the event payload.
          const { retrieveSquareOrder, squareOrderIsPaid } = await import("@/lib/square.server");
          const order = await retrieveSquareOrder(orderId);
          if (squareOrderIsPaid(order)) {
            await supabaseAdmin
              .from("payments")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                square_payment_id: order?.tenders?.[0]?.payment_id ?? null,
              })
              .eq("square_order_id", orderId);
          }
          return new Response("ok");
        }

        return new Response("ok");
      },
    },
  },
});
