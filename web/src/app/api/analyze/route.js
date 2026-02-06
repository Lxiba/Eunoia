import { NextResponse } from 'next/server';
import { isGeminiConfigured, generateWithRetry, ENTRY_ANALYSIS_PROMPT } from '../../../lib/gemini';

function demoAnalysis(sentiment_label) {
  const isPositive = sentiment_label === 'POSITIVE';
  return isPositive
    ? `**Emotional Breakdown**: This entry carries a positive tone — there's a sense of ${['gratitude', 'hope', 'contentment', 'excitement'][Math.floor(Math.random() * 4)]} coming through.\n\n**Root Cause**: The positivity seems connected to personal growth or a recent experience that brought satisfaction.\n\n**Suggestions**:\n• Take a moment to savor this feeling — write down what specifically made this a good moment.\n• Share this positive energy with someone you care about.\n• Set a small intention to recreate similar conditions tomorrow.\n\n**Reflection Question**: What made today different from a harder day — and how can you build more of that into your routine?`
    : `**Emotional Breakdown**: This entry carries some heaviness — there may be ${['frustration', 'worry', 'sadness', 'overwhelm'][Math.floor(Math.random() * 4)]} beneath the surface.\n\n**Root Cause**: The mood seems tied to external pressures or unmet expectations in your daily life.\n\n**Key Triggers**: The language suggests you may be processing a challenging situation or feeling stuck.\n\n**Suggestions**:\n• Try the 5-minute rule: commit to just 5 minutes of something that usually helps (a walk, music, deep breaths).\n• Write down one thing you CAN control about this situation.\n• Be kind to yourself — having a tough moment doesn't define your whole day.\n\n**Reflection Question**: If you could change one small thing about this situation, what would it be?`;
}

export async function POST(request) {
  try {
    const { content, sentiment_label, sentiment_score } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({ analysis: demoAnalysis(sentiment_label) });
    }

    try {
      const prompt = ENTRY_ANALYSIS_PROMPT
        .replace('{sentiment_label}', sentiment_label || 'UNKNOWN')
        .replace('{sentiment_score}', Math.round((sentiment_score || 0.5) * 100))
        + content;

      const responseText = await generateWithRetry(prompt);
      return NextResponse.json({ analysis: responseText });
    } catch (geminiError) {
      console.warn('Gemini analysis failed, using fallback:', geminiError.message);
      return NextResponse.json({ analysis: demoAnalysis(sentiment_label) });
    }
  } catch (error) {
    console.error('Entry analysis error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
