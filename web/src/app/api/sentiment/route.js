import { NextResponse } from 'next/server';
import { isGeminiConfigured, generateWithRetry, SENTIMENT_PROMPT } from '../../../lib/gemini';

function keywordFallback(text) {
  const positiveWords = ['happy', 'good', 'great', 'love', 'wonderful', 'amazing', 'joy', 'grateful', 'excited', 'hopeful', 'calm', 'peaceful', 'proud', 'better', 'smile', 'beautiful', 'nice', 'thank', 'blessed', 'fun', 'enjoy', 'awesome', 'fantastic', 'brilliant', 'confident'];
  const negativeWords = ['sad', 'angry', 'upset', 'hate', 'terrible', 'awful', 'stressed', 'anxious', 'depressed', 'frustrated', 'worried', 'afraid', 'scared', 'lonely', 'tired', 'exhausted', 'hopeless', 'overwhelmed', 'hurt', 'pain', 'cry', 'fail', 'lost', 'broken', 'miserable'];
  const lower = text.toLowerCase();
  const posCount = positiveWords.filter((w) => lower.includes(w)).length;
  const negCount = negativeWords.filter((w) => lower.includes(w)).length;

  const isPositive = posCount > negCount;
  const dominant = Math.max(posCount, negCount);
  const score = dominant === 0 ? 0.55 : Math.min(0.60 + dominant * 0.08, 0.98);

  return {
    label: isPositive ? 'POSITIVE' : 'NEGATIVE',
    score,
    all: [
      { label: 'POSITIVE', score: isPositive ? score : 1 - score },
      { label: 'NEGATIVE', score: isPositive ? 1 - score : score },
    ],
  };
}

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(keywordFallback(text));
    }

    try {
      // For long documents, only analyze first 4000 chars for sentiment
      const trimmedText = text.length > 4000 ? text.slice(0, 4000) : text;
      const responseText = await generateWithRetry(SENTIMENT_PROMPT + trimmedText);

      let cleaned = responseText;
      // Strip markdown code blocks if present
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      }
      // Extract JSON substring
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned);
      const label = parsed.label.toUpperCase();
      const score = Math.max(0.5, Math.min(0.99, parsed.score));

      return NextResponse.json({
        label,
        score,
        all: [
          { label: 'POSITIVE', score: label === 'POSITIVE' ? score : 1 - score },
          { label: 'NEGATIVE', score: label === 'NEGATIVE' ? score : 1 - score },
        ],
      });
    } catch (geminiError) {
      console.warn('Gemini sentiment failed, using keyword fallback:', geminiError.message);
      return NextResponse.json(keywordFallback(text));
    }
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
