"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Film, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const client = createClient();
    setSupabase(client);

    client.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = () => {
    supabase?.auth.signOut();
  };

  const links = [
    { href: "/generate", label: "Generate" },
    { href: "/pricing", label: "Pricing" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cinema-black/60 backdrop-blur-xl border-b border-cinema-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group hover-grow">
          <Film className="w-6 h-6 text-gold" />
          <span className="font-display text-xl font-bold tracking-wide">
            Cine<span className="text-gold">Post</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover-grow inline-block ${
                pathname === link.href
                  ? "text-gold"
                  : "text-gray-400 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="btn-outline text-sm !px-4 !py-2 hover-grow">
              Sign In
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-cinema-dark border-b border-cinema-border px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-400 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                handleSignOut();
                setMobileOpen(false);
              }}
              className="block text-sm text-gray-400"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-gold"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
