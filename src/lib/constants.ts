export const FREE_DAILY_LIMIT = 3;
export const GUEST_LIMIT = 3;

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    variantId: null,
    features: [
      "3 generations per day",
      "Actor headshots from TMDB",
      "Copy & download cards",
      "Random actor picker",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID || "",
    features: [
      "Unlimited generations",
      "Bulk export to CSV",
      "Full post history & favorites",
      "Download shareable PNG cards",
      "One-click Post to X",
    ],
  },
  agency: {
    name: "Agency",
    price: 49,
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_VARIANT_ID || "",
    features: [
      "Everything in Pro",
      "Unlimited generations",
      "Bulk export to CSV",
      "Full post history & favorites",
      "Built for high-volume creators",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export const GENERATION_PROMPT = (actorName: string) =>
  `Write a compelling, engaging Twitter post about ${actorName}'s acting craft and most iconic performances. Maximum 240 characters. No hashtags. Sound like a passionate film critic.`;
