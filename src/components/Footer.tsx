import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cinema-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} CinePost. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/generate" className="hover:text-gold transition-colors">
            Generate
          </Link>
          <Link href="/pricing" className="hover:text-gold transition-colors">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gold transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
