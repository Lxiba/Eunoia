'use client';

import { useState } from 'react';

export default function WeeklyInsights({ entries }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter entries from the past 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekEntries = entries.filter((e) => new Date(e.created_at) >= weekAgo);

  if (weekEntries.length === 0) return null;

  async function generateInsights() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: weekEntries }),
      });

      if (!response.ok) throw new Error('Failed to generate insights');

      const data = await response.json();
      setInsights(data.content);
    } catch (err) {
      setError('Could not generate insights. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Insights</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {weekEntries.length} {weekEntries.length === 1 ? 'entry' : 'entries'} this week
        </span>
      </div>

      {insights ? (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {insights.split('\n').filter(Boolean).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          {error && <p className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            onClick={generateInsights}
            disabled={loading}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700
                       hover:bg-indigo-100 disabled:opacity-50
                       dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          >
            {loading ? 'Generating...' : 'Generate Weekly Analysis'}
          </button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            AI will analyze your mood patterns and give personalized tips.
          </p>
        </div>
      )}
    </div>
  );
}
