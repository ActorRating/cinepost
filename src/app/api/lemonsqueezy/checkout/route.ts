import { NextResponse } from "next/server";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createClient } from "@/lib/supabase/server";
import { setupLemonSqueezy, getStoreId, getVariantIdForPlan } from "@/lib/lemonsqueezy";
import type { PlanType } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: PlanType };

    if (!plan || plan === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    setupLemonSqueezy();

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const { data, error } = await createCheckout(
      getStoreId(),
      getVariantIdForPlan(plan),
      {
        checkoutData: {
          email: profile?.email || user.email || "",
          custom: {
            supabase_user_id: user.id,
            plan,
          },
        },
        productOptions: {
          redirectUrl: `${origin}/dashboard?upgraded=true`,
          receiptButtonText: "Go to Dashboard",
          receiptLinkUrl: `${origin}/dashboard`,
        },
      }
    );

    if (error || !data) {
      console.error("Lemon Squeezy checkout error:", error);
      return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }

    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
