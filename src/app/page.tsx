import Link from "next/link";
import { Sparkles, ImageIcon, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cinema-gradient" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">AI-Powered Film Content</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance tracking-tight">
            Generate viral actor content for your social media in{" "}
            <span className="text-gold">seconds</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            AI-powered posts with real actor headshots, ready to copy and post
          </p>

          <Link href="/generate" className="btn-gold inline-block text-lg">
            Generate Free Post
          </Link>

          <p className="mt-4 text-sm text-gray-500">No signup required for your first 3 posts</p>
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
