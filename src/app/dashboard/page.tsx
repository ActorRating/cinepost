"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Download,
  Trash2,
  Loader2,
  Crown,
  BarChart3,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { PLACEHOLDER_HEADSHOT } from "@/lib/tmdb";
import { stripQuotes } from "@/lib/text";
import type { GeneratedPost, UserProfile } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUpgraded, setShowUpgraded] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      setShowUpgraded(true);
      window.history.replaceState({}, "", "/dashboard");
      const timer = setTimeout(() => setShowUpgraded(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProfile(data.profile);
          setPosts(data.posts);
        }
        setLoading(false);
      });
  }, []);

  const toggleFavorite = async (postId: string, isFavorite: boolean) => {
    const res = await fetch("/api/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, isFavorite: !isFavorite }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isFavorite: !isFavorite } : p))
      );
    }
  };

  const deletePost = async (postId: string) => {
    const res = await fetch(`/api/posts?id=${postId}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleCopy = async (postId: string, text: string) => {
    await navigator.clipboard.writeText(stripQuotes(text));
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = async () => {
    setExportError("");
    const res = await fetch("/api/export");
    if (res.status === 403) {
      const data = await res.json();
      setExportError(data.message || "Upgrade to Pro to export CSV.");
      return;
    }
    if (!res.ok) {
      setExportError("Export failed. Please try again.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cinepost-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPosts =
    tab === "favorites" ? posts.filter((p) => p.isFavorite) : posts;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  const isFree = profile?.plan === "free";
  const remaining = isFree
    ? Math.max(0, FREE_DAILY_LIMIT - (profile?.generationsToday || 0))
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {showUpgraded && (
          <div className="mb-6 card-cinema border-gold/40 p-4 sm:p-5 flex items-start gap-3 animate-slide-up">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gold mb-1">Welcome to {profile?.plan === "agency" ? "Agency" : "Pro"}!</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your subscription is active. You now have unlimited generations and CSV export.
              </p>
              <Link href="/generate" className="inline-block mt-3 text-sm text-gold hover:underline">
                Generate your first Pro post →
              </Link>
            </div>
            <button
              onClick={() => setShowUpgraded(false)}
              className="flex-shrink-0 text-gray-400 hover:text-foreground hover-grow"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {exportError && (
          <div className="mb-6 card-cinema border-red-500/30 p-4 flex items-start justify-between gap-3">
            <p className="text-sm text-red-300">{exportError}</p>
            <button onClick={() => setExportError("")} className="text-gray-400 hover-grow">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
          </div>
          <div className="flex gap-3">
            {isFree && (
              <Link href="/pricing" className="btn-gold flex items-center gap-2 text-sm !px-4 !py-2">
                <Crown className="w-4 h-4" />
                Upgrade
              </Link>
            )}
            {profile?.plan !== "free" && (
              <button
                onClick={handleExport}
                className="btn-outline flex items-center gap-2 text-sm !px-4 !py-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
            <Link href="/generate" className="btn-outline text-sm !px-4 !py-2">
              Generate
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card-cinema p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              Plan
            </div>
            <p className="text-lg font-semibold capitalize">
              {profile?.plan}
              {profile?.plan !== "free" && (
                <Crown className="w-4 h-4 text-gold inline ml-1" />
              )}
            </p>
          </div>
          <div className="card-cinema p-4">
            <p className="text-gray-400 text-xs mb-1">Total Generated</p>
            <p className="text-lg font-semibold">{profile?.generationsTotal || 0}</p>
          </div>
          <div className="card-cinema p-4">
            <p className="text-gray-400 text-xs mb-1">Today</p>
            <p className="text-lg font-semibold">
              {profile?.generationsToday || 0}
              {remaining !== null && (
                <span className="text-sm text-gray-400 font-normal">
                  {" "}
                  / {FREE_DAILY_LIMIT}
                </span>
              )}
            </p>
          </div>
          <div className="card-cinema p-4">
            <p className="text-gray-400 text-xs mb-1">Favorites</p>
            <p className="text-lg font-semibold">
              {posts.filter((p) => p.isFavorite).length}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-cinema-border">
          <button
            onClick={() => setTab("all")}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === "all"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-foreground"
            }`}
          >
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === "favorites"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-foreground"
            }`}
          >
            Favorites ({posts.filter((p) => p.isFavorite).length})
          </button>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="card-cinema p-12 text-center">
            <p className="text-gray-400 mb-4">
              {tab === "favorites" ? "No favorites yet" : "No posts generated yet"}
            </p>
            <Link href="/generate" className="btn-gold inline-block text-sm">
              Generate Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="card-cinema p-4 sm:p-5 flex gap-4">
                <div className="w-16 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-cinema-border bg-cinema-black flex items-center justify-center">
                  <Image
                    src={post.headshotUrl || PLACEHOLDER_HEADSHOT}
                    alt={post.actorName}
                    width={64}
                    height={80}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-gold font-semibold">
                        {post.actorName}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {post.postText}
                      </p>
                      {post.createdAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => post.id && handleCopy(post.id, post.postText)}
                        className="p-2 text-gray-400 hover:text-foreground transition-colors hover-grow"
                        title="Copy"
                      >
                        {copiedId === post.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => post.id && toggleFavorite(post.id, !!post.isFavorite)}
                        className={`p-2 transition-colors hover-grow ${
                          post.isFavorite ? "text-gold" : "text-gray-400 hover:text-gold"
                        }`}
                        title="Favorite"
                      >
                        <Star className="w-4 h-4" fill={post.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => post.id && deletePost(post.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors hover-grow"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
