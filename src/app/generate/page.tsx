"use client";

import { useState, useRef, useEffect } from "react";
import { Shuffle, Loader2 } from "lucide-react";
import PostCard, { PostCardActions } from "@/components/PostCard";
import UpgradeModal, { type UpgradeModalVariant } from "@/components/UpgradeModal";
import { ACTORS, getRandomActor } from "@/data/actors";
import {
  canGuestGenerate,
  incrementGuestGenerationCount,
  getGuestRemaining,
  clearGuestGenerationCount,
} from "@/lib/guest";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import type { GeneratedPost } from "@/types";
import type { User } from "@supabase/supabase-js";

type UserPlan = "free" | "pro" | "agency" | null;

export default function GeneratePage() {
  const [actorName, setActorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState("");
  const [limitModal, setLimitModal] = useState<UpgradeModalVariant | null>(null);
  const [guestRemaining, setGuestRemaining] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>(null);
  const [generationsToday, setGenerationsToday] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const loadUserProfile = async (user: User) => {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, generations_today, last_generation_date")
      .eq("id", user.id)
      .single();

    const today = new Date().toISOString().split("T")[0];
    const generationsTodayCount =
      profile?.last_generation_date === today ? profile.generations_today : 0;

    setUserPlan((profile?.plan as UserPlan) ?? "free");
    setGenerationsToday(generationsTodayCount);
    return {
      plan: (profile?.plan as UserPlan) ?? "free",
      generationsToday: generationsTodayCount,
    };
  };

  const showLimitModal = (
    variant: UpgradeModalVariant,
    context: {
      trigger: string;
      isAuthenticated: boolean;
      userPlan: UserPlan;
      generationsToday: number | null;
    }
  ) => {
    console.log("[CinePost] limit modal decision:", {
      trigger: context.trigger,
      isAuthenticated: context.isAuthenticated,
      userPlan: context.userPlan,
      generationsToday: context.generationsToday,
      modalVariant: variant,
    });
    setLimitModal(variant);
  };

  useEffect(() => {
    const supabase = createClient();

    const handleUser = async (user: User | null) => {
      if (user) {
        clearGuestGenerationCount();
        setIsAuthenticated(true);
        setGuestRemaining(null);
        await loadUserProfile(user);
      } else {
        setIsAuthenticated(false);
        setUserPlan(null);
        setGenerationsToday(null);
        setGuestRemaining(getGuestRemaining());
      }
      setAuthChecked(true);
    };

    supabase.auth.getUser().then(({ data: { user } }) => handleUser(user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRandomActor = () => {
    setActorName(getRandomActor());
    setResult(null);
    setError("");
  };

  const handleGenerate = async () => {
    const name = actorName.trim();
    if (!name) {
      setError("Please enter an actor name or pick a random actor");
      return;
    }

    const limitContext = {
      trigger: "pre-check",
      isAuthenticated,
      userPlan,
      generationsToday,
    };

    if (!isAuthenticated && !canGuestGenerate()) {
      showLimitModal("guest", { ...limitContext, trigger: "guest-localStorage-exhausted" });
      return;
    }

    if (
      isAuthenticated &&
      userPlan === "free" &&
      generationsToday !== null &&
      generationsToday >= FREE_DAILY_LIMIT
    ) {
      showLimitModal("daily_limit", {
        ...limitContext,
        trigger: "free-plan-daily-limit-client",
      });
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const isGuest = !isAuthenticated;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorName: name, isGuest }),
      });

      const data = await res.json();

      if (!res.ok) {
        const apiContext = {
          trigger: `api-error:${data.error}`,
          isAuthenticated,
          userPlan: (data.plan as UserPlan) ?? userPlan,
          generationsToday,
        };

        if (data.error === "auth_required") {
          showLimitModal("guest", apiContext);
          return;
        }

        if (data.error === "limit_reached") {
          if (isAuthenticated) {
            showLimitModal("daily_limit", apiContext);
          } else {
            showLimitModal("guest", apiContext);
          }
          return;
        }

        throw new Error(data.message || "Generation failed");
      }

      setResult(data);

      trackEvent("generate-post", {
        actor: name,
        authenticated: isGuest ? "no" : "yes",
      });

      if (isGuest) {
        incrementGuestGenerationCount();
        setGuestRemaining(getGuestRemaining());
      } else if (userPlan === "free" && generationsToday !== null) {
        setGenerationsToday(generationsToday + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setResult(null);
    setError("");
    handleRandomActor();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Generate a <span className="text-gold">Post</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Pick a random actor or enter a name to generate viral content
          </p>
          {authChecked && !isAuthenticated && guestRemaining !== null && guestRemaining > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {guestRemaining} free generation{guestRemaining !== 1 ? "s" : ""} remaining
            </p>
          )}
          {authChecked && !isAuthenticated && guestRemaining === 0 && (
            <p className="text-sm text-gold mt-2">
              Guest limit reached —{" "}
              <a href="/signup" className="underline hover:text-gold-light">
                sign up free
              </a>{" "}
              to keep generating
            </p>
          )}
          {authChecked && isAuthenticated && userPlan === "free" && generationsToday !== null && (
            <p className="text-sm text-gray-500 mt-2">
              {Math.max(0, FREE_DAILY_LIMIT - generationsToday)} generation
              {FREE_DAILY_LIMIT - generationsToday !== 1 ? "s" : ""} remaining today
            </p>
          )}
        </div>

        {/* Input Section */}
        <div className="card-cinema p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              placeholder="Enter actor name..."
              className="input-cinema flex-1"
              list="actor-suggestions"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <datalist id="actor-suggestions">
              {ACTORS.slice(0, 50).map((actor) => (
                <option key={actor} value={actor} />
              ))}
            </datalist>
            <button
              onClick={handleRandomActor}
              className="btn-outline flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Shuffle className="w-4 h-4" />
              Random Actor
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Post"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card-cinema p-12 text-center animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
            <p className="text-gray-400">Crafting your post about {actorName}...</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="animate-slide-up">
            <PostCard
              ref={cardRef}
              actorName={result.actorName}
              postText={result.postText}
              headshotUrl={result.headshotUrl}
            />
            <PostCardActions
              actorName={result.actorName}
              postText={result.postText}
              headshotUrl={result.headshotUrl}
              onGenerateAnother={handleGenerateAnother}
            />
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={limitModal !== null}
        onClose={() => setLimitModal(null)}
        variant={limitModal ?? "guest"}
      />
    </div>
  );
}
