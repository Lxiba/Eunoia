import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

// Model priority: gemini-2.5-flash (best free tier quota) → gemini-2.0-flash (fallback)
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.0-flash';

export function isGeminiConfigured() {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  return key && key !== 'your_gemini_api_key_here' && key.length > 10;
}

export function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  }
  return genAI;
}

export function getSentimentModel() {
  return getGenAI().getGenerativeModel({ model: PRIMARY_MODEL });
}

export function getChatModel() {
  return getGenAI().getGenerativeModel({
    model: PRIMARY_MODEL,
    systemInstruction: `You are Eunoia, a compassionate and empathetic mental health journal companion.
Your role is to:
- Listen actively and validate the user's feelings
- Offer gentle, supportive perspectives without being preachy
- Suggest healthy coping strategies when appropriate
- Never diagnose conditions or replace professional help
- If someone expresses serious distress or self-harm ideation, gently encourage them to contact a crisis helpline (988 Suicide & Crisis Lifeline in the US)
- Keep responses concise (2-4 paragraphs max) and warm in tone
- Use the user's name if they share it
- Remember context within the current conversation`,
  });
}

export function getInsightsModel() {
  return getGenAI().getGenerativeModel({ model: PRIMARY_MODEL });
}

export function getAnalysisModel() {
  return getGenAI().getGenerativeModel({ model: PRIMARY_MODEL });
}

// ── Retry with exponential backoff + model fallback ──

/**
 * Calls Gemini generateContent with automatic retry on 429 rate limits.
 * Tries the primary model first, then falls back to the alternate model.
 * @param {string} prompt - The prompt to send
 * @param {object} [options] - Optional: { model, systemInstruction }
 * @returns {Promise<string>} The response text
 */
export async function generateWithRetry(prompt, options = {}) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  const maxRetries = 3;

  for (const modelName of models) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const modelConfig = { model: modelName };
        if (options.systemInstruction) {
          modelConfig.systemInstruction = options.systemInstruction;
        }
        const model = getGenAI().getGenerativeModel(modelConfig);
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error) {
        const isRateLimit = error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.includes('RESOURCE_EXHAUSTED') ||
          error?.message?.includes('quota');

        if (isRateLimit && attempt < maxRetries - 1) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt + 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (isRateLimit) {
          // Move to next model
          break;
        }

        // Non-rate-limit error — throw immediately
        throw error;
      }
    }
  }

  throw new Error('All Gemini models are currently rate-limited. Please try again in a minute.');
}

/**
 * Starts a Gemini chat with retry on rate limits.
 * @param {Array} history - Chat history in Gemini format
 * @param {string} message - The new message to send
 * @param {string} [systemInstruction] - System instruction for the chat
 * @returns {Promise<string>} The response text
 */
export async function chatWithRetry(history, message, systemInstruction) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  const maxRetries = 3;

  for (const modelName of models) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const modelConfig = { model: modelName };
        if (systemInstruction) {
          modelConfig.systemInstruction = systemInstruction;
        }
        const model = getGenAI().getGenerativeModel(modelConfig);
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        return result.response.text().trim();
      } catch (error) {
        const isRateLimit = error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.includes('RESOURCE_EXHAUSTED') ||
          error?.message?.includes('quota');

        if (isRateLimit && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt + 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (isRateLimit) {
          break;
        }

        throw error;
      }
    }
  }

  throw new Error('All Gemini models are currently rate-limited. Please try again in a minute.');
}

// ── Prompts ──

export const SENTIMENT_PROMPT = `You are a sentiment analysis expert. Analyze the emotional tone of the following text carefully.

Rules:
- Consider the OVERALL emotional tone, not just individual words.
- Sarcasm, irony, and context matter — "just great" after a complaint is NEGATIVE.
- Mixed feelings should lean toward whichever emotion is stronger.
- Survey data or factual content with no emotional language is NEUTRAL — classify as POSITIVE with a low score (0.50-0.55).
- For academic/essay content, analyze the emotional stance of the writer.

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks, no extra text):
{"label": "POSITIVE" or "NEGATIVE", "score": <confidence between 0.50 and 0.99>}

Text to analyze:
`;

export const WEEKLY_INSIGHTS_PROMPT = `You are Eunoia, a compassionate mental health journal companion. Based on the following journal entries from this week, write a brief, warm weekly reflection (3-4 paragraphs max).

Include:
1. A summary of the emotional patterns you notice
2. What the person seems to be struggling with most
3. 2-3 specific, actionable motivation tips tailored to their struggles
4. End with an encouraging note

Keep the tone warm, supportive, and non-judgmental. Do not diagnose anything.

Here are the journal entries from this week:
`;

export const ENTRY_ANALYSIS_PROMPT = `You are Eunoia, a compassionate mental health journal companion. Analyze this single journal entry deeply.

Provide:
1. **Emotional Breakdown**: What specific emotions are present (e.g., frustration, hope, anxiety, gratitude)? Go beyond just positive/negative.
2. **Root Cause**: What area/component of the person's life seems to be driving this mood? (work, relationships, self-esteem, health, finances, studies, etc.)
3. **Key Triggers**: What specific things mentioned seem to trigger the emotional response?
4. **Suggestions**: 2-3 specific, actionable tips to help them if the mood is negative, or to maintain/build on if positive.
5. **Reflection Question**: One thoughtful question they can journal about next to explore this further.

Keep it warm and concise (4-5 short paragraphs max). Do not diagnose.

The entry sentiment was classified as: {sentiment_label} ({sentiment_score}% confidence)

Journal entry:
`;

export const CHAT_SYSTEM_INSTRUCTION = `You are Eunoia, a compassionate and empathetic mental health journal companion.
Your role is to:
- Listen actively and validate the user's feelings
- Offer gentle, supportive perspectives without being preachy
- Suggest healthy coping strategies when appropriate
- Never diagnose conditions or replace professional help
- If someone expresses serious distress or self-harm ideation, gently encourage them to contact a crisis helpline (988 Suicide & Crisis Lifeline in the US)
- Keep responses concise (2-4 paragraphs max) and warm in tone
- Use the user's name if they share it
- Remember context within the current conversation`;
