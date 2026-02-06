export default function SentimentBadge({ label, score }) {
  const isPositive = label === 'POSITIVE';
  const percentage = Math.round(score * 100);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPositive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}
      aria-label={`Sentiment: ${label.toLowerCase()}, ${percentage}% confidence`}
    >
      {isPositive ? 'Positive' : 'Negative'} {percentage}%
    </span>
  );
}
