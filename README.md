<p align="center">
  <img src="web/public/favicon.png" alt="Eunoia" width="80" height="80" />
</p>

<h1 align="center">Eunoia</h1>

<p align="center">
  Your AI-powered mental health journal — write freely, understand yourself deeply.
</p>

---

Eunoia is an intelligent journaling platform that helps you understand your emotional patterns through AI. Write about your day, talk to a supportive AI companion, and watch your mood trends unfold over time — all in one place. The name *Eunoia* comes from the Greek word for "beautiful thinking," which is exactly what this app is designed to cultivate.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Data Flow](#data-flow)
- [AI & Reliability](#ai--reliability)
- [Demo Mode](#demo-mode)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

***Journal with instant AI insights***

Write your thoughts and Eunoia immediately analyzes the emotional tone of each entry. Every entry gets a mood label, a sentiment score, and a personalized reflection to help you process what you wrote.

***AI chat companion***

Open the chat sidebar at any time for a supportive, judgment-free conversation. The AI listens, validates your feelings, and offers gentle coping strategies — drawing context from your journal history to make responses feel personal.

***Mood tracking over time***

Visual charts — a pie chart and a timeline — show how your emotions shift day to day and week to week, helping you spot patterns you might not notice on your own.

***Weekly reflections***

Generate a weekly summary that identifies recurring emotional themes, highlights what you've been dealing with, and offers actionable tips tailored to your patterns.

***Voice journaling***

Don't feel like typing? Dictate your entries using the browser's built-in speech-to-text — no external service required.

***Document import***

Drag and drop a PDF, text file, CSV, Markdown, JSON, or TSV file into the journal to analyze its emotional content. Useful for essays, therapy notes, survey responses, or any written material.

***Onboarding questionnaire***

On first sign-in, a short onboarding flow collects your occupation, age range, journaling purpose, and interests so the AI can tailor its tone and suggestions to you.

***Dark mode***

Full dark mode support across every page and component.

---

## Architecture

Eunoia is a monorepo with two top-level directories:

```
eunoia/
├── web/        ← Next.js web application (active)
└── mobile/     ← Flutter mobile app (deferred)
```

The web app uses Next.js's App Router, meaning both the frontend and the backend API live in the same project — there is no separate server process.

### Web Application (`web/`)

```
web/src/
├── app/
│   ├── page.js                   ← Public landing page (server component)
│   ├── layout.js                 ← Root layout with theme provider
│   ├── auth/page.js              ← Sign in / sign up
│   ├── journal/page.js           ← Main dashboard (entries, charts, chat, onboarding)
│   └── api/
│       ├── sentiment/route.js    ← Analyzes emotional tone of a journal entry
│       ├── analyze/route.js      ← Deep per-entry AI analysis
│       ├── chat/route.js         ← AI chat companion responses
│       ├── insights/route.js     ← Weekly mood summary generation
│       └── parse-file/route.js   ← Server-side file parsing (PDF, TXT, CSV, etc.)
├── components/
│   ├── AuthForm.js               ← Sign in / sign up form
│   ├── Navbar.js                 ← Authenticated app navbar
│   ├── ThemeToggle.js            ← Light / dark mode switch
│   ├── EntryForm.js              ← Journal entry editor (voice + file upload)
│   ├── JournalEntry.js           ← Displays a single entry with AI analysis
│   ├── SentimentBadge.js         ← Mood label chip (positive / neutral / negative)
│   ├── ChatSidebar.js            ← AI chat panel
│   ├── ChatMessage.js            ← Individual chat bubble
│   ├── ChatToggleButton.js       ← Button to open/close chat
│   ├── TypingIndicator.js        ← Animated "AI is typing" indicator
│   ├── MoodPieChart.js           ← Mood distribution pie chart
│   ├── MoodTimeline.js           ← Sentiment score over time chart
│   ├── WeeklyInsights.js         ← Weekly AI reflection card
│   ├── OnboardingModal.js        ← First-time onboarding questionnaire
│   ├── OnboardingBanner.js       ← Nudge to complete onboarding
│   └── landing/
│       ├── LandingNavbar.js
│       ├── HeroSection.js
│       ├── FeaturesSection.js
│       ├── HowItWorksSection.js
│       └── CTASection.js
└── lib/
    ├── supabase.js               ← Browser Supabase client + full in-memory demo mock
    ├── supabase-server.js        ← Server-side Supabase client (for API routes)
    ├── gemini.js                 ← Gemini config, model helpers, retry logic, prompts
    └── sentiment.js              ← Client-side fetch helper for sentiment endpoint
```

---

## Tech Stack

### Languages

| Language | Role |
|----------|------|
| **JavaScript** | All frontend components and backend API routes |
| **CSS** | Styling via Tailwind utility classes and custom animations |
| **SQL** | Database schema, RLS policies, and migration scripts |
| **Dart** | Flutter mobile app (deferred) |

### Frontend

| Technology | Role |
|------------|------|
| **Next.js** | App Router for routing, server-side rendering, and API endpoints |
| **React** | Component-based UI across all pages |
| **Tailwind CSS** | Utility-first styling with full dark mode support |
| **Web Speech API** | Browser-native speech-to-text — no external dependency |

### Backend

| Technology | Role |
|------------|------|
| **Next.js API Routes** | Server-side endpoints for AI features and file parsing |
| **Google Gemini** | Powers all AI — sentiment analysis, chat companion, entry analysis, weekly insights |
| **Supabase** | PostgreSQL database, user authentication, and row-level security |
| **pdf-parse** | Server-side PDF text extraction for document uploads |

### Infrastructure & Services

| Service | Role |
|---------|------|
| **Supabase Auth** | Email/password authentication with JWT sessions |
| **Supabase PostgreSQL** | Persistent storage for journal entries and user profiles |
| **Google Gemini API** | Primary AI model with automatic fallback and retry logic |

---

## Database Schema

The database has two tables, both protected by Row Level Security so users can only ever access their own data.

### `journal_entries`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | References `auth.users` — links the entry to its owner |
| `content` | TEXT | The raw journal entry text |
| `sentiment_label` | TEXT | Mood classification: `positive`, `neutral`, or `negative` |
| `sentiment_score` | FLOAT | Numeric sentiment intensity (-1.0 to 1.0) |
| `created_at` | TIMESTAMPTZ | When the entry was written |
| `updated_at` | TIMESTAMPTZ | Auto-updated on any change |

### `user_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | References `auth.users` — one profile per user |
| `occupation` | TEXT | Collected during onboarding |
| `purpose` | TEXT | Why the user wants to journal |
| `age_range` | TEXT | User's age bracket |
| `interests` | JSONB | Array of selected interest tags |
| `onboarding_completed` | BOOLEAN | Whether the user finished onboarding |
| `created_at` | TIMESTAMPTZ | Profile creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto-updated on any change |

Both tables have `BEFORE UPDATE` triggers that automatically keep `updated_at` current. The `journal_entries` table also has an index on `user_id` for fast per-user queries.

---

## Data Flow

Here is how a journal entry moves through the system from submission to display:

```
User writes entry
       │
       ▼
EntryForm.js (React)
  ├── Optional: speech-to-text via Web Speech API
  └── Optional: file drag-and-drop → POST /api/parse-file → extracted text
       │
       ▼
POST /api/sentiment
  └── Gemini analyzes text → returns { label, score, insight }
       │
       ▼
Entry saved to Supabase (journal_entries table)
       │
       ▼
JournalEntry.js renders entry with SentimentBadge
       │
       ▼
MoodPieChart.js + MoodTimeline.js update from new entry list

User opens chat sidebar
       │
       ▼
ChatSidebar.js → POST /api/chat
  └── Gemini generates empathetic reply with journal context
       │
       ▼
ChatMessage.js renders response with TypingIndicator

User requests weekly insights
       │
       ▼
WeeklyInsights.js → POST /api/insights
  └── Gemini summarizes the week's entries → returns themed reflection
```

---

## AI & Reliability

All AI features are powered by the Google Gemini API. Eunoia is built to stay functional even when the API is slow or rate-limited.

**Model strategy**: The primary model is `gemini-2.5-flash`. If it becomes unavailable, the app automatically falls back to `gemini-2.0-flash`.

**Retry logic**: The `generateWithRetry()` and `chatWithRetry()` functions in `lib/gemini.js` retry up to three times with exponential backoff (2s → 4s → 8s) on 429 rate-limit errors before switching to the fallback model.

**Graceful degradation**: If Gemini fails entirely, every API route falls back to a usable default — keyword-based sentiment for entries, pre-written empathetic responses for chat, and a static placeholder for weekly insights. The app never breaks for the user.

**Response parsing**: Gemini responses are cleaned of markdown code fences and parsed as JSON, with a substring search to extract the JSON object even if the model adds extra surrounding text.

---

## Demo Mode

Eunoia can run fully offline without any external accounts. If the Supabase environment variables are left as placeholders, the app automatically switches into demo mode:

- Any email and password will work for sign-in
- Journal entries are stored in memory for the session (reset on page refresh)
- Sentiment analysis falls back to keyword matching
- The AI chat uses pre-written empathetic responses
- All features — charts, onboarding, file upload, voice — remain fully functional

This makes it easy to explore the app or develop locally without setting up a Supabase project.

---

## Getting Started

### Prerequisites

- Node.js installed
- A Supabase project (or use demo mode without one)
- A Google Gemini API key

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/eunoia.git
cd eunoia/web

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Gemini credentials

# 4. Set up the database (if using Supabase)
# Open supabase-migration.sql and run it in your Supabase SQL Editor

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Other Commands

```bash
npm run build    # Production build
npm run lint     # Run ESLint
```

---

## Environment Variables

Create `web/.env.local` with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
```

| Variable | Where to find it | Required |
|----------|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API | No (demo mode if omitted) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API | No (demo mode if omitted) |
| `GOOGLE_GEMINI_API_KEY` | Google AI Studio | No (keyword fallback if omitted) |

`GOOGLE_GEMINI_API_KEY` is server-side only and is never exposed to the browser.

---

## Project Structure

```
eunoia/
├── web/                        ← Next.js web application
│   ├── public/                 ← Static assets (favicon, images)
│   ├── src/
│   │   ├── app/                ← Pages and API routes (App Router)
│   │   ├── components/         ← React components
│   │   └── lib/                ← Shared utilities and API clients
│   ├── package.json
│   └── tailwind.config.js
├── mobile/                     ← Flutter mobile app (deferred)
├── supabase-migration.sql      ← Database schema and RLS policies
└── README.md
```

---

## License

ISC
