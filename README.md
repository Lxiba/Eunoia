# Eunoia

AI-powered mental health journal with sentiment analysis, mood tracking, and an empathetic AI chat companion.

Write your thoughts, and Eunoia analyzes their sentiment using AI — helping you track your emotional patterns over time with visual charts and personalized weekly insights.

## Features

- **AI Journal** — Write freely, get instant sentiment analysis on every entry
- **Per-Entry AI Analysis** — Deep emotional breakdown, root cause identification, triggers, and actionable suggestions for each entry
- **Mood Tracking** — Pie charts and timeline visualizations of your emotional patterns
- **AI Chat Companion** — Supportive, empathetic chat sidebar powered by Google Gemini
- **Weekly Insights** — AI-generated analysis of your mood patterns with personalized tips
- **Speech-to-Text** — Dictate journal entries using your voice (Chrome/Edge/Safari)
- **File Upload** — Drop or upload .txt, .pdf, .csv, .md, .json, .tsv files as journal entries
- **Onboarding** — Personalized setup to tailor your experience
- **Dark Mode** — Easy on the eyes for late-night reflections
- **Responsive** — Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 3
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini API (`gemini-2.5-flash` with `gemini-2.0-flash` fallback) — sentiment analysis, chat, per-entry analysis, weekly insights
- **File Parsing**: pdf-parse for PDF text extraction
- **Speech**: Web Speech API (browser-native, no dependencies)
- **Mobile**: Flutter (deferred to post-MVP)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/apikey) API key (free)
- Optionally: a [Supabase](https://supabase.com) project (app works in demo mode without it)

### 1. Install & Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs in **demo mode** by default — sign in with any email/password. Entries are stored in memory.

### 2. Add Google Gemini (optional but recommended)

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey), then edit `web/.env.local`:

```
GOOGLE_GEMINI_API_KEY=your_key_here
```

This enables real AI sentiment analysis, chat, per-entry analysis, and weekly insights. The app uses `gemini-2.5-flash` as the primary model with automatic fallback to `gemini-2.0-flash` and exponential backoff retry on rate limits.

### 3. Set Up Supabase (optional, for persistence)

Create a Supabase project, then:
1. Run `supabase-migration.sql` in the Supabase SQL Editor
2. Update `web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Project Structure

```
eunoia/
├── web/                        # Next.js app
│   ├── src/
│   │   ├── app/                # Pages and API routes
│   │   │   ├── page.js         # Public landing page
│   │   │   ├── auth/           # Sign in / sign up
│   │   │   ├── journal/        # Dashboard with entries, mood charts, chat
│   │   │   └── api/            # sentiment, chat, analyze, insights, parse-file
│   │   ├── components/         # React components
│   │   │   ├── landing/        # Landing page sections
│   │   │   └── ...             # Auth, journal, chat, mood, onboarding
│   │   └── lib/                # Supabase clients, Gemini config, helpers
│   └── public/                 # Static assets (favicon.jpg)
├── mobile/                     # Flutter app (post-MVP)
├── supabase-migration.sql      # Database schema
└── CLAUDE.md                   # AI assistant guidance
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/sentiment` | POST | Sentiment analysis (Gemini with keyword fallback) |
| `/api/chat` | POST | AI chat companion (Gemini with demo fallback) |
| `/api/analyze` | POST | Per-entry deep analysis (Gemini with template fallback) |
| `/api/insights` | POST | Weekly mood insights (Gemini with template fallback) |
| `/api/parse-file` | POST | File upload parsing (PDF, TXT, CSV, MD, JSON, TSV) |

## License

ISC
