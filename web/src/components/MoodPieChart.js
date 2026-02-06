'use client';

export default function MoodPieChart({ entries, title }) {
  if (!entries || entries.length === 0) return null;

  const positive = entries.filter((e) => e.sentiment_label === 'POSITIVE').length;
  const negative = entries.length - positive;
  const positivePercent = Math.round((positive / entries.length) * 100);
  const negativePercent = 100 - positivePercent;

  // SVG pie chart using stroke-dasharray
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const positiveArc = (positivePercent / 100) * circumference;
  const negativeArc = circumference - positiveArc;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      )}

      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {/* Positive arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeDasharray={`${positiveArc} ${circumference}`}
              className="text-green-500 dark:text-green-400"
            />
            {/* Negative arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeDasharray={`${negativeArc} ${circumference}`}
              strokeDashoffset={-positiveArc}
              className="text-red-400 dark:text-red-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{entries.length}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400" aria-hidden="true" />
            <span className="text-gray-700 dark:text-gray-300">
              Positive: {positive} ({positivePercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500" aria-hidden="true" />
            <span className="text-gray-700 dark:text-gray-300">
              Negative: {negative} ({negativePercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
