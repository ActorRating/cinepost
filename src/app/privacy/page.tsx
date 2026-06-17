import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — CinePost",
  description: "How CinePost collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-gold">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: June 17, 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              CinePost (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates an AI-powered tool that helps users
              generate social media content about actors. This Privacy Policy explains how we collect,
              use, and protect your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Account information:</strong> email address and
                password when you create an account.
              </li>
              <li>
                <strong className="text-foreground">Generated content:</strong> actor names, AI-generated
                post text, and associated headshot URLs you create while using the service.
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong> generation counts, plan type,
                and basic usage metrics stored in your profile.
              </li>
              <li>
                <strong className="text-foreground">Waitlist information:</strong> email address and
                plan interest if you join our waitlist.
              </li>
              <li>
                <strong className="text-foreground">Guest usage:</strong> anonymous generation counts
                stored locally in your browser (localStorage) if you use the service without signing up.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and operate the CinePost service</li>
              <li>To generate AI content using third-party AI providers</li>
              <li>To fetch actor headshots from TMDB</li>
              <li>To store your post history and account preferences</li>
              <li>To communicate about your account or waitlist status</li>
              <li>To improve our service and fix technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services to operate CinePost:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Supabase</strong> — authentication and database
                hosting
              </li>
              <li>
                <strong className="text-foreground">Groq</strong> — AI text generation
              </li>
              <li>
                <strong className="text-foreground">TMDB</strong> — actor headshot images
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — website hosting
              </li>
            </ul>
            <p className="mt-3">
              These providers process data according to their own privacy policies. We do not sell your
              personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Storage and Security</h2>
            <p>
              Your account data and generated posts are stored securely in Supabase. We use industry-standard
              security measures including encrypted connections (HTTPS) and row-level security policies to
              ensure users can only access their own data. No method of transmission over the internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your account data and generated posts for as long as your account is active. You may
              delete individual posts from your dashboard. To request account deletion, contact us at the
              email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete your personal
              data. You can delete posts from your dashboard and request account deletion by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>
              CinePost is not intended for users under 13 years of age. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated policy on this
              page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p>
              Questions about this Privacy Policy? Contact us at{" "}
              <a href="mailto:hello@cinepost.com">hello@cinepost.com</a>.
            </p>
          </section>
        </div>

        <p className="mt-12 text-gray-500 text-sm">
          <Link href="/" className="text-gold hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
