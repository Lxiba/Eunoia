import { NextResponse } from 'next/server';
import { isGeminiConfigured, generateWithRetry, ENTRY_ANALYSIS_PROMPT } from '../../../lib/gemini';

function demoAnalysis(sentiment_label) {
  const isPositive = sentiment_label === 'POSITIVE';
  const emotions = isPositive
    ? ['gratitude', 'hope', 'contentment', 'excitement']
    : ['frustration', 'worry', 'sadness', 'overwhelm'];
  const picked = emotions[Math.floor(Math.random() * 4)];
  return isPositive
    ? `**Mood**: ${picked} and a sense of satisfaction.\n\n**Insight**: This positivity seems connected to personal growth or a recent experience that went well.\n\n**Tip**: Take a moment to write down what specifically made this a good moment — revisiting it later can lift you up on harder days.`
    : `**Mood**: ${picked} and some emotional tension.\n\n**Insight**: The mood seems tied to external pressures or unmet expectations in your daily life.\n\n**Tip**: Try the 5-minute rule — commit to just 5 minutes of something that usually helps (a walk, music, deep breaths).`;
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
