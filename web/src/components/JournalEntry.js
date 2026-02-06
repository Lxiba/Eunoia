'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabase';
import SentimentBadge from './SentimentBadge';

export default function JournalEntry({ entry, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const supabase = createClient();

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entry.id);

    if (error) {
      setDeleting(false);
      return;
    }
    onDeleted(entry.id);
  }

  async function handleAnalyze() {
    if (analysis) {
      setShowAnalysis(!showAnalysis);
      return;
    }

    setAnalyzing(true);
    setShowAnalysis(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: entry.content,
          sentiment_label: entry.sentiment_label,
          sentiment_score: entry.sentiment_score,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze');

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch {
      setAnalysis('Could not generate analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  const date = new Date(entry.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  // Truncate long content for display
  const isLong = entry.content.length > 300;
  const [expanded, setExpanded] = useState(false);
  const displayContent = isLong && !expanded ? entry.content.slice(0, 300) + '...' : entry.content;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={entry.created_at} className="text-xs text-gray-500 dark:text-gray-400">
            {date}
          </time>
          <SentimentBadge label={entry.sentiment_label} score={entry.sentiment_score} />
        </div>

        <div className="flex items-center gap-1">
          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            aria-label="AI analysis of this entry"
            title="Get AI analysis"
            className={`rounded p-1 transition-colors ${
              showAnalysis && analysis
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400'
            } disabled:opacity-50`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete entry"
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600
                       disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {displayContent}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* AI Analysis panel */}
      {showAnalysis && (
        <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-800/30 dark:bg-indigo-900/10">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            AI Analysis
          </div>
          {analyzing ? (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-indigo-500" />
              Analyzing your entry...
            </div>
          ) : (
            <div className="prose-sm text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {analysis?.split('\n').filter(Boolean).map((line, i) => {
                // Bold markdown-style headers
                if (line.startsWith('**') && line.includes('**:')) {
                  const [header, ...rest] = line.split('**:');
                  return (
                    <p key={i} className="mt-2 first:mt-0">
                      <strong className="text-gray-900 dark:text-white">
                        {header.replace(/\*\*/g, '')}:
                      </strong>
                      {rest.join('**:')}
                    </p>
                  );
                }
                if (line.startsWith('• ') || line.startsWith('- ')) {
                  return (
                    <p key={i} className="ml-3 mt-0.5">
                      <span className="text-indigo-500 dark:text-indigo-400">&#8226;</span> {line.slice(2)}
                    </p>
                  );
                }
                return <p key={i} className="mt-1.5 first:mt-0">{line}</p>;
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
