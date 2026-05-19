import { NextResponse } from "next/server";

/**
 * Faz 2: Stripe veya iyzico webhook handler.
 * Provider-agnostic interface — implement payment verification here.
 */
export async function POST(request: Request) {
  const provider = request.headers.get("x-payment-provider");

  if (process.env.PAYMENT_WEBHOOK_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Webhook devre dışı (Faz 1)" },
      { status: 503 },
    );
  }

  // Stub: log and acknowledge
  const body = await request.text();
  console.info("[payment-webhook] provider:", provider, "bytes:", body.length);

  return NextResponse.json({ received: true, status: "stub" });
}
