<p align="center">
  <img src="web/public/favicon.png" alt="Eunoia" width="80" height="80" />
</p>

<h1 align="center">Eunoia</h1>

<p align="center">
  Your AI-powered mental health journal — write freely, understand yourself deeply.
</p>

---

Eunoia is an intelligent journaling platform that helps you understand your emotional patterns through AI. Write about your day, talk to a supportive AI companion, and watch your mood trends unfold over time — all in one place.

## What Eunoia Does

**Journal with AI insights** — Write your thoughts and Eunoia instantly analyzes the emotional tone of each entry, giving you a quick mood reading and a personalized insight to help you reflect.

**Talk to an AI companion** — Open the chat sidebar anytime to have a supportive, judgment-free conversation. Eunoia listens, validates your feelings, and offers gentle coping strategies.

**Track your mood over time** — Visual charts (pie chart + timeline) show how your emotions shift day to day, helping you spot patterns you might not notice on your own.

**Get weekly reflections** — At the end of each week, generate a personalized analysis that summarizes your emotional patterns, identifies what you've been struggling with, and offers actionable tips.

**Use your voice** — Don't feel like typing? Dictate your journal entries using speech-to-text.

**Import documents** — Drop a PDF, text file, or CSV into the journal to analyze its emotional tone — useful for essays, survey responses, or any written content.

## Built With

Next.js | React | Tailwind CSS | Google Gemini AI | Supabase

## Getting Started

```bash
cd web
npm install
npm run dev
```

The app works out of the box in **demo mode** — no accounts or API keys needed. Sign in with any email and password to explore all features.

To enable real AI analysis, add a free [Google Gemini API key](https://aistudio.google.com/apikey) to `web/.env.local`:

```
GOOGLE_GEMINI_API_KEY=your_key_here
```

## License

ISC
