"use client";

import { useState, useRef } from "react";
import { Shuffle, Loader2 } from "lucide-react";
import PostCard, { PostCardActions } from "@/components/PostCard";
import UpgradeModal from "@/components/UpgradeModal";
import { ACTORS, getRandomActor } from "@/data/actors";
import {
  canGuestGenerate,
  incrementGuestGenerationCount,
  getGuestRemaining,
} from "@/lib/guest";
import type { GeneratedPost } from "@/types";

export default function GeneratePage() {
  const [actorName, setActorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [guestRemaining, setGuestRemaining] = useState(getGuestRemaining);
  const cardRef = useRef<HTMLDivElement>(null);

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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const isGuest = !canGuestGenerate() ? false : true;

      if (!isGuest && guestRemaining <= 0) {
        setShowUpgrade(true);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorName: name, isGuest }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "limit_reached" || data.error === "auth_required") {
          setShowUpgrade(true);
          return;
        }
        throw new Error(data.message || "Generation failed");
      }

      setResult(data);

      if (isGuest) {
        incrementGuestGenerationCount();
        setGuestRemaining(getGuestRemaining());
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
          {guestRemaining > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {guestRemaining} free generation{guestRemaining !== 1 ? "s" : ""} remaining
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
              cardRef={cardRef}
              onGenerateAnother={handleGenerateAnother}
            />
          </div>
        )}
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
