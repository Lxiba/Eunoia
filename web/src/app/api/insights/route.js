import { NextResponse } from 'next/server';
import { isGeminiConfigured, generateWithRetry, WEEKLY_INSIGHTS_PROMPT } from '../../../lib/gemini';

function demoInsights(entries) {
  const positiveCount = entries.filter((e) => e.sentiment_label === 'POSITIVE').length;
  const total = entries.length;
  const ratio = positiveCount / total;

  if (ratio >= 0.7) {
    return `Great week! Out of your ${total} entries, ${positiveCount} were positive. You seem to be in a good headspace. Keep nurturing what's working — whether it's the people around you, your routines, or your mindset.\n\nTip: Try to identify what specifically made your good days good. Writing that down can help you recreate those conditions when things get tough.\n\nKeep going — you're doing wonderfully.`;
  } else if (ratio >= 0.4) {
    return `This week was a mix — ${positiveCount} positive and ${total - positiveCount} negative entries out of ${total} total. That's completely normal. Life has ups and downs, and the fact that you're tracking them shows real self-awareness.\n\nTips:\n• On tough days, try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.\n• Set one small intention each morning — even something as simple as "I'll take a 10-minute walk."\n\nYou're showing up for yourself, and that matters.`;
  } else {
    return `This has been a challenging week — ${total - positiveCount} of your ${total} entries leaned negative. First, I want you to know: it's okay to have hard weeks. What matters is that you're here, reflecting on it.\n\nTips:\n• Be gentle with yourself. You don't need to "fix" everything at once.\n• Try to connect with someone you trust this week, even briefly.\n• Consider a small act of self-care each day — a warm drink, a favorite song, a few deep breaths.\n\nYou're stronger than you think. Next week is a fresh start.`;
  }
}

export async function POST(request) {
  try {
    const { entries } = await request.json();

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'Entries array is required' }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({ content: demoInsights(entries) });
    }

    try {
      const entriesText = entries
        .map((e, i) => `Entry ${i + 1} (${e.sentiment_label}, ${Math.round(e.sentiment_score * 100)}%): "${e.content}"`)
        .join('\n\n');

      const responseText = await generateWithRetry(WEEKLY_INSIGHTS_PROMPT + entriesText);
      return NextResponse.json({ content: responseText });
    } catch (geminiError) {
      console.warn('Gemini insights failed, using fallback:', geminiError.message);
      return NextResponse.json({ content: demoInsights(entries) });
    }
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
