import Link from "next/link";
import Image from "next/image";
import { Sparkles, ImageIcon, Zap, Copy, Download } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-cinema-black" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,215,0,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(26,26,78,0.5) 0%, transparent 60%)",
          }}
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-0">
          {/* Pill badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-5 py-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs sm:text-sm text-gold font-semibold tracking-wide uppercase">
                AI-Powered Film Content
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-center tracking-tight text-balance">
            Turn actors into{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFE44D 50%, #E6C200 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              viral posts
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-center text-balance leading-relaxed">
            AI writes compelling social media posts with real actor photos, copy, download, or share in one click.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              href="/generate"
              className="btn-gold text-base sm:text-lg px-10 py-4 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Free Post
            </Link>
            <Link href="/pricing" className="btn-outline text-base sm:text-lg">
              See Pricing
            </Link>
          </div>
          <p className="text-center text-sm text-gray-600 mb-14">
            No signup required &mdash; 3 free posts instantly
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-14 mb-14">
            {[
              { value: "250+", label: "Actors" },
              { value: "3 sec", label: "Generation" },
              { value: "Free", label: "To start" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Hero card preview */}
          <div className="relative mx-auto max-w-3xl">
            {/* Glow layers */}
            <div
              className="absolute -inset-px rounded-2xl opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.25) 0%, transparent 50%, rgba(255,215,0,0.1) 100%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl blur-3xl -z-10 scale-95"
              style={{ background: "rgba(255,215,0,0.08)" }}
            />

            {/* Fake browser chrome */}
            <div className="rounded-t-2xl bg-[#16161f] border border-cinema-border border-b-0 px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="flex-1 mx-4 text-center text-xs text-gray-600 font-mono bg-[#0A0A0F] rounded-md px-3 py-1">
                cinepost.com/generate
              </span>
            </div>

            {/* Card image */}
            <div className="relative rounded-b-2xl overflow-hidden border border-cinema-border border-t-0">
              <Image
                src="/hero-example-card.png"
                alt="Example CinePost card featuring Leonardo DiCaprio"
                width={1940}
                height={936}
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto block"
              />
              {/* Action bar overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-2 px-5 py-3 bg-gradient-to-t from-black/70 to-transparent">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5 transition-colors">
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5 transition-colors">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-cinema-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-cinema p-8 text-center hover-grow">
              <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 tracking-tight">Instant Generation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI writes compelling posts about any actor in under 3 seconds
              </p>
            </div>

            <div className="card-cinema p-8 text-center hover-grow">
              <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-gold/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 tracking-tight">Real Headshots</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automatically fetches actor photos from TMDB for stunning visual cards
              </p>
            </div>

            <div className="card-cinema p-8 text-center hover-grow">
              <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 tracking-tight">Ready to Post</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Copy text or download beautiful cards as PNG images for any platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-cinema-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Start creating <span className="text-gold">cinematic content</span> today
          </h2>
          <p className="text-gray-400 mb-8">
            Join film enthusiasts and social media managers creating viral actor content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate" className="btn-gold">
              Generate Free Post
            </Link>
            <Link href="/pricing" className="btn-outline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cinema-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CinePost. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gold hover-grow inline-block transition-colors">
              Pricing
            </Link>
            <Link href="/generate" className="hover:text-gold hover-grow inline-block transition-colors">
              Generate
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
