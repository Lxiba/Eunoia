import { NextResponse } from 'next/server';
import { isGeminiConfigured, chatWithRetry, CHAT_SYSTEM_INSTRUCTION } from '../../../lib/gemini';

const demoResponses = [
  "I hear you. It sounds like you're going through a lot right now. Remember, it's okay to feel this way, and reaching out is a sign of strength.",
  "Thank you for sharing that with me. Your feelings are valid. What do you think might help you feel a little better right now?",
  "That's a really thoughtful reflection. Journaling about it was a great first step. Would you like to explore what's behind those feelings?",
  "I appreciate your openness. Sometimes just putting thoughts into words can bring clarity. How has writing about this made you feel?",
  "It takes courage to be honest with yourself. I'm here to listen whenever you need. Is there anything specific you'd like to talk through?",
];

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      const index = messages.length % demoResponses.length;
      return NextResponse.json({ role: 'assistant', content: demoResponses[index] });
    }

    try {
      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1].content;
      const responseText = await chatWithRetry(history, lastMessage, CHAT_SYSTEM_INSTRUCTION);

      return NextResponse.json({ role: 'assistant', content: responseText });
    } catch (geminiError) {
      console.warn('Gemini chat failed, using fallback:', geminiError.message);
      const index = messages.length % demoResponses.length;
      return NextResponse.json({ role: 'assistant', content: demoResponses[index] });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
