'use client';

export default function MoodTimeline({ entries }) {
  if (!entries || entries.length < 2) return null;

  // Show last 14 entries (most recent on right)
  const recent = entries.slice(0, 14).reverse();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Mood Timeline</h3>

      <div className="flex items-end gap-1" role="img" aria-label="Mood timeline showing recent entries">
        {recent.map((entry, i) => {
          const isPositive = entry.sentiment_label === 'POSITIVE';
          const height = Math.round(entry.sentiment_score * 100);
          const date = new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={entry.id || i} className="group flex flex-1 flex-col items-center gap-1">
              {/* Tooltip */}
              <div className="invisible absolute -mt-16 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-600">
                {isPositive ? 'Positive' : 'Negative'} {height}%
              </div>
              {/* Bar */}
              <div
                className={`w-full min-w-[6px] max-w-[24px] rounded-t transition-all ${
                  isPositive
                    ? 'bg-green-400 dark:bg-green-500'
                    : 'bg-red-400 dark:bg-red-500'
                }`}
                style={{ height: `${Math.max(height * 0.6, 8)}px` }}
                title={`${date}: ${isPositive ? 'Positive' : 'Negative'} ${height}%`}
              />
              {/* Date label (only show for some) */}
              {(i === 0 || i === recent.length - 1 || i === Math.floor(recent.length / 2)) && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{date}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
