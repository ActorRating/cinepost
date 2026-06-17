import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getPlanFromVariantId } from "@/lib/lemonsqueezy";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const sig = Buffer.from(signature, "utf8");

  if (digest.length !== sig.length) return false;
  return timingSafeEqual(digest, sig);
}

interface LemonSqueezyWebhook {
  meta: {
    event_name: string;
    custom_data?: {
      supabase_user_id?: string;
      plan?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      customer_id?: number;
      variant_id?: number;
      status?: string;
    };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: LemonSqueezyWebhook;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.supabase_user_id;
  const customPlan = event.meta.custom_data?.plan;
  const variantId = event.data.attributes.variant_id;
  const customerId = event.data.attributes.customer_id;
  const subscriptionId = event.data.id;

  try {
    if (eventName === "subscription_created" && userId) {
      const plan =
        customPlan === "pro" || customPlan === "agency"
          ? customPlan
          : getPlanFromVariantId(variantId ?? "") || "pro";

      await supabaseAdmin
        .from("profiles")
        .update({
          plan,
          lemonsqueezy_customer_id: customerId ? String(customerId) : null,
          lemonsqueezy_subscription_id: subscriptionId,
        })
        .eq("id", userId);
    }

    if (
      (eventName === "subscription_cancelled" ||
        eventName === "subscription_expired") &&
      userId
    ) {
      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          lemonsqueezy_subscription_id: null,
        })
        .eq("id", userId);
    }

    if (
      (eventName === "subscription_cancelled" ||
        eventName === "subscription_expired") &&
      !userId &&
      subscriptionId
    ) {
      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          lemonsqueezy_subscription_id: null,
        })
        .eq("lemonsqueezy_subscription_id", subscriptionId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
