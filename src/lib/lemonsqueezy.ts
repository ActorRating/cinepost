import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

let initialized = false;

export function setupLemonSqueezy() {
  if (initialized) return;

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured");
  }

  lemonSqueezySetup({ apiKey });
  initialized = true;
}

export function getStoreId(): string {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    throw new Error("LEMONSQUEEZY_STORE_ID is not configured");
  }
  return storeId;
}

export function getVariantIdForPlan(plan: "pro" | "agency"): string {
  const variantId =
    plan === "pro"
      ? process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID
      : process.env.NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_VARIANT_ID;

  if (!variantId) {
    throw new Error(`Variant ID not configured for plan: ${plan}`);
  }

  return variantId;
}

export function getPlanFromVariantId(variantId: string | number): "pro" | "agency" | null {
  const proId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID;
  const agencyId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_VARIANT_ID;

  const id = String(variantId);
  if (proId && id === proId) return "pro";
  if (agencyId && id === agencyId) return "agency";
  return null;
}
