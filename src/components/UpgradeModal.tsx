"use client";

import Link from "next/link";
import { X } from "lucide-react";

export type UpgradeModalVariant = "guest" | "daily_limit";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: UpgradeModalVariant;
  message?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  variant,
  message,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const isGuest = variant === "guest";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card-cinema p-8 max-w-md w-full animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-foreground hover-grow"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-3xl">🎬</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            {isGuest
              ? "You've used your free generations"
              : "You've used today's free generations"}
          </h2>
          <p className="text-gray-400 mb-6">
            {message ||
              (isGuest
                ? "Sign up for a free account to get 3 more generations per day, or upgrade to Pro for unlimited access."
                : "Come back tomorrow, or upgrade to Pro for unlimited access.")}
          </p>

          <div className="space-y-3">
            {isGuest ? (
              <>
                <Link href="/signup" className="btn-gold block w-full text-center">
                  Sign Up Free
                </Link>
                <Link href="/pricing" className="btn-outline block w-full text-center">
                  View Pricing
                </Link>
                <Link href="/login" className="text-sm text-gray-400 hover:text-gold transition-colors">
                  Already have an account? Sign in
                </Link>
              </>
            ) : (
              <Link href="/pricing" className="btn-gold block w-full text-center">
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
