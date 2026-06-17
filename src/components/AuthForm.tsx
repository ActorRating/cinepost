"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { clearGuestGenerationCount } from "@/lib/guest";
import { Loader2, Mail } from "lucide-react";

const MIN_PASSWORD_LENGTH = 8;

interface AuthFormProps {
  mode: "login" | "signup";
}

function getPasswordStrength(password: string): { label: string; level: 0 | 1 | 2 | 3 } {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { label: "Too short", level: 0 };
  }

  let score = 0;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Fair", level: 1 };
  if (score === 2) return { label: "Good", level: 2 };
  return { label: "Strong", level: 3 };
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  const passwordStrength =
    mode === "signup" && password.length > 0 ? getPasswordStrength(password) : null;

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPendingConfirmation(false);

    if (mode === "signup" && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setLoading(true);

    try {
      if (!supabase) return;

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/generate`,
          },
        });
        if (error) throw error;

        if (data.session) {
          clearGuestGenerationCount();
          router.push("/generate");
          return;
        }

        setPendingConfirmation(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        clearGuestGenerationCount();
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (pendingConfirmation) {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">Check your email</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="text-foreground font-medium">{email}</span>. Click the link to
            activate your account, then you can start generating posts.
          </p>
        </div>
        <Link href="/login" className="btn-gold inline-block w-full text-center">
          Go to Sign In
        </Link>
        <p className="text-xs text-gray-500">
          Didn&apos;t get it? Check spam, or try signing up again with the same email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-cinema"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-cinema"
          placeholder="••••••••"
          minLength={mode === "signup" ? MIN_PASSWORD_LENGTH : 6}
          required
        />
        {mode === "signup" && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500">At least 8 characters.</p>
            {passwordStrength && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength.level >= bar
                          ? passwordStrength.level === 1
                            ? "bg-yellow-500"
                            : passwordStrength.level === 2
                              ? "bg-gold"
                              : "bg-green-500"
                          : "bg-cinema-border"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs ${
                    passwordStrength.level === 0
                      ? "text-red-400"
                      : passwordStrength.level === 1
                        ? "text-yellow-500"
                        : passwordStrength.level === 2
                          ? "text-gold"
                          : "text-green-500"
                  }`}
                >
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {mode === "signup" ? "Create Account" : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-400">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gold hover:underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
