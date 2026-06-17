# CinePost

AI-powered tool for film and entertainment social media accounts. Automatically generates ready-to-post Twitter/X content about actors, complete with headshots from TMDB.

## Features

- **Landing Page** — Cinematic dark theme with gold accents
- **Post Generator** — Random or custom actor selection, Groq AI + TMDB headshots
- **Guest Mode** — 3 free generations without signup (localStorage)
- **Auth** — Email/password via Supabase
- **Pricing** — Free, Pro ($19/mo), Agency ($49/mo)
- **Lemon Squeezy** — Hosted checkout and webhooks for subscriptions
- **Dashboard** — Post history, favorites, generation counter, CSV export

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Auth + Database)
- Groq API (llama-3.3-70b-versatile)
- TMDB API
- Lemon Squeezy
- html2canvas (PNG export)

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL editor
3. Copy your project URL and anon key to `.env.local`
4. Add your service role key for Lemon Squeezy webhooks

### 4. Set up Lemon Squeezy

1. Create a store at [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create subscription products for Pro ($19/mo) and Agency ($49/mo)
3. Copy variant IDs to `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID` and `NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_VARIANT_ID`
4. Copy your Store ID and API key from Settings
5. Create a webhook pointing to `https://yourdomain.com/api/lemonsqueezy/webhook`
6. Subscribe to `subscription_created` and `subscription_cancelled` events
7. Set the signing secret as `LEMONSQUEEZY_WEBHOOK_SECRET`

### 5. API Keys

- **Groq**: Get a key at [console.groq.com](https://console.groq.com)
- **TMDB**: Get a key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Deploy to Vercel

```bash
npx vercel
```

Add all environment variables in the Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/              # Groq + TMDB generation
│   │   ├── lemonsqueezy/
│   │   │   ├── checkout/          # Lemon Squeezy checkout
│   │   │   └── webhook/           # Subscription webhooks
│   │   ├── dashboard/             # User data + posts
│   │   ├── posts/                 # Favorites + delete
│   │   └── export/                # CSV export
│   ├── generate/                  # Generator page
│   ├── pricing/                   # Pricing page
│   ├── dashboard/                 # User dashboard
│   └── login/ & signup/           # Auth pages
├── components/
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   ├── AuthForm.tsx
│   └── UpgradeModal.tsx
├── data/actors.ts                   # 250 iconic actors
└── lib/                             # Utilities
```

## License

MIT
