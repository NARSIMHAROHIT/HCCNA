/**
 * Minimal Square Connect API client.
 *
 * Deliberately fetch-based rather than the Square SDK: the app builds for a
 * Nitro/edge runtime, and Checkout + Orders are two plain REST calls.
 *
 * Environment variables (set these in Lovable → Project → Environment, and in
 * the Square Developer dashboard for the matching application):
 *   SQUARE_ACCESS_TOKEN          — access token for the Square application
 *   SQUARE_LOCATION_ID           — the location money is taken against
 *   SQUARE_ENVIRONMENT           — "production" (default) or "sandbox"
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — from the webhook subscription
 *   SQUARE_WEBHOOK_URL           — the exact notification URL Square is configured with
 *   PAYMENT_PROVIDER             — optional override: "square" or "stripe"
 */

const SQUARE_VERSION = "2025-01-23";

export interface SquareConfig {
  accessToken: string;
  locationId: string;
  baseUrl: string;
  environment: "production" | "sandbox";
}

export function squareConfig(): SquareConfig | null {
  const accessToken = process.env["SQUARE_ACCESS_TOKEN"];
  const locationId = process.env["SQUARE_LOCATION_ID"];
  if (!accessToken || !locationId) return null;

  const environment = process.env["SQUARE_ENVIRONMENT"] === "sandbox" ? "sandbox" : "production";
  return {
    accessToken,
    locationId,
    environment,
    baseUrl:
      environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com",
  };
}

export function squareConfigured(): boolean {
  return squareConfig() !== null;
}

/**
 * Which processor takes the money.
 *
 * Square is the default whenever it is configured. Stripe stays in the codebase
 * as a fallback: it is used automatically if Square keys are missing, and can be
 * forced back on with PAYMENT_PROVIDER=stripe without a redeploy of code.
 */
export function activePaymentProvider(): "square" | "stripe" {
  const forced = process.env["PAYMENT_PROVIDER"]?.trim().toLowerCase();
  if (forced === "stripe") return "stripe";
  if (forced === "square") return "square";
  return squareConfigured() ? "square" : "stripe";
}

interface SquareErrorBody {
  errors?: { code?: string; detail?: string; category?: string }[];
}

async function squareFetch<T>(path: string, init: RequestInit & { method: string }): Promise<T> {
  const config = squareConfig();
  if (!config) throw new Error("Square is not configured.");

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as T & SquareErrorBody) : ({} as T & SquareErrorBody);

  if (!response.ok) {
    const detail = body.errors?.[0]?.detail ?? `Square returned ${response.status}`;
    // Never surface the raw Square payload to a devotee — it can contain internal ids.
    console.error("[Square] request failed", path, response.status, body.errors);
    throw new Error(detail);
  }
  return body as T;
}

export interface SquarePaymentLink {
  id: string;
  order_id?: string;
  url: string;
  long_url?: string;
}

export interface CreatePaymentLinkInput {
  idempotencyKey: string;
  name: string;
  amountCents: number;
  currency: string;
  redirectUrl: string;
  note?: string | undefined;
  buyerEmail?: string | undefined;
  buyerPhone?: string | undefined;
  referenceId?: string | undefined;
}

/** Square-hosted checkout page for a single line item. */
export async function createSquarePaymentLink(
  input: CreatePaymentLinkInput,
): Promise<SquarePaymentLink> {
  const config = squareConfig();
  if (!config) throw new Error("Square is not configured.");

  const prePopulated: Record<string, string> = {};
  if (input.buyerEmail) prePopulated["buyer_email"] = input.buyerEmail;
  if (input.buyerPhone) prePopulated["buyer_phone_number"] = input.buyerPhone;

  const response = await squareFetch<{ payment_link: SquarePaymentLink }>(
    "/v2/online-checkout/payment-links",
    {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: input.idempotencyKey,
        quick_pay: {
          name: input.name.slice(0, 255),
          price_money: { amount: input.amountCents, currency: input.currency.toUpperCase() },
          location_id: config.locationId,
        },
        checkout_options: {
          redirect_url: input.redirectUrl,
          ask_for_shipping_address: false,
          allow_tipping: false,
        },
        ...(Object.keys(prePopulated).length ? { pre_populated_data: prePopulated } : {}),
        ...(input.note ? { payment_note: input.note.slice(0, 500) } : {}),
      }),
    },
  );

  return response.payment_link;
}

export interface SquareOrder {
  id: string;
  state?: string;
  tenders?: { id?: string; payment_id?: string }[];
  net_amount_due_money?: { amount?: number };
}

export async function retrieveSquareOrder(orderId: string): Promise<SquareOrder | null> {
  try {
    const response = await squareFetch<{ order: SquareOrder }>(`/v2/orders/${orderId}`, {
      method: "GET",
    });
    return response.order ?? null;
  } catch {
    return null;
  }
}

/** True when Square considers the order fully settled. */
export function squareOrderIsPaid(order: SquareOrder | null): boolean {
  if (!order) return false;
  if (order.state === "COMPLETED") return true;
  const due = order.net_amount_due_money?.amount;
  return due === 0 && (order.tenders?.length ?? 0) > 0;
}

/**
 * Square signs webhooks with HMAC-SHA256 over (notificationUrl + rawBody).
 * Uses Web Crypto so it works on both Node and edge runtimes.
 */
export async function verifySquareWebhook(
  rawBody: string,
  signature: string,
  notificationUrl: string,
  signatureKey: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(notificationUrl + rawBody));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));

  // Constant-time comparison.
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
