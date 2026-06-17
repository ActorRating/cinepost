"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { PLANS, type PlanType } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const planKeys: PlanType[] = ["free", "pro", "agency"];

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const handleCheckout = async (plan: PlanType) => {
    if (plan === "free") return;

    setLoading(plan);

    if (!supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/signup";
      return;
    }

    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Simple, <span className="text-gold">transparent</span> pricing
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const isPopular = key === "pro";

            return (
              <div
                key={key}
                className={`card-cinema p-8 relative flex flex-col hover-grow ${
                  isPopular ? "border-gold/50" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-cinema-black text-xs font-bold px-4 py-1.5 rounded-2xl">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 text-sm">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {key === "free" ? (
                  <Link href="/generate" className="btn-outline w-full text-center block">
                    Get Started
                  </Link>
                ) : (
                  <button
                    onClick={() => handleCheckout(key)}
                    disabled={loading === key}
                    className={`w-full flex items-center justify-center gap-2 ${
                      isPopular ? "btn-gold" : "btn-outline"
                    }`}
                  >
                    {loading === key && <Loader2 className="w-4 h-4 animate-spin" />}
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
