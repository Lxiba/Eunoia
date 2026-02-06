export async function analyzeSentiment(text) {
  try {
    const response = await fetch('/api/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze sentiment');
    }

    return response.json();
  } catch (err) {
    console.warn('Sentiment analysis failed, using fallback:', err.message);
    return {
      label: 'POSITIVE',
      score: 0.5,
      all: [
        { label: 'POSITIVE', score: 0.5 },
        { label: 'NEGATIVE', score: 0.5 },
      ],
    };
  }
}
