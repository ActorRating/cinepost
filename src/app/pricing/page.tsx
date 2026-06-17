"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Sparkles } from "lucide-react";
import { PLANS, type PlanType } from "@/lib/constants";

const planKeys: PlanType[] = ["free", "pro", "agency"];

export default function PricingPage() {
  const [waitlistPlan, setWaitlistPlan] = useState<PlanType | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleWaitlist = async (plan: "pro" | "agency") => {
    if (!email.trim()) {
      setWaitlistPlan(plan);
      setError("Enter your email to join the waitlist");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage(data.message || "You're on the waitlist!");
      setWaitlistPlan(null);
      setEmail("");
    } catch {
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-5 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">Free during early access</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Simple, <span className="text-gold">transparent</span> pricing
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            CinePost is completely free right now. Paid plans are coming soon — join the waitlist to get
            early access.
          </p>
        </div>

        {(message || error) && (
          <div
            className={`mb-8 max-w-lg mx-auto px-4 py-3 rounded-2xl text-sm text-center ${
              error
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-gold/10 border border-gold/30 text-gold"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const isPopular = key === "pro";
            const isFree = key === "free";
            const isPaid = key === "pro" || key === "agency";

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

                {isPaid && (
                  <div className="absolute top-4 right-4 bg-white/10 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg">
                    Coming soon
                  </div>
                )}

                <h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-6">
                  {isFree ? (
                    <>
                      <span className="text-4xl font-bold text-gold">Free</span>
                      <p className="text-sm text-gold/80 mt-1 font-medium">During early access</p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </>
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

                {isFree ? (
                  <Link href="/generate" className="btn-gold w-full text-center block">
                    Get Started Free
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setWaitlistPlan(key);
                        setError("");
                      }}
                      onFocus={() => setWaitlistPlan(key)}
                      placeholder="you@example.com"
                      className="input-cinema text-sm"
                    />
                    <button
                      onClick={() => handleWaitlist(key)}
                      disabled={loading && waitlistPlan === key}
                      className={`w-full flex items-center justify-center gap-2 ${
                        isPopular ? "btn-gold" : "btn-outline"
                      }`}
                    >
                      {loading && waitlistPlan === key && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Join Waitlist
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
