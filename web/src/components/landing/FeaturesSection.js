export default function FeaturesSection() {
  const features = [
    {
      title: 'AI-Powered Journal',
      description: 'Write freely and let AI understand the emotional undertone of your thoughts. No prompts needed — just be yourself.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
          <rect x="8" y="4" width="32" height="40" rx="4" className="fill-indigo-100 dark:fill-indigo-900/40" />
          <path d="M16 16h16M16 24h12M16 32h8" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Sentiment Analysis',
      description: 'Instantly see whether your entries lean positive or negative with AI confidence scores and mood tracking over time.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
          <circle cx="24" cy="24" r="20" className="fill-green-100 dark:fill-green-900/40" />
          <circle cx="18" cy="20" r="2" className="fill-green-600 dark:fill-green-400"/>
          <circle cx="30" cy="20" r="2" className="fill-green-600 dark:fill-green-400"/>
          <path d="M16 30 C18 34 30 34 32 30" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
    {
      title: 'AI Chat Companion',
      description: 'Talk to an empathetic AI that offers supportive perspectives, healthy coping strategies, and weekly mood insights.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
          <rect x="4" y="8" width="28" height="20" rx="4" className="fill-purple-100 dark:fill-purple-900/40"/>
          <rect x="16" y="20" width="28" height="18" rx="4" className="fill-purple-200 dark:fill-purple-800/40"/>
          <circle cx="24" cy="29" r="1.5" className="fill-purple-600 dark:fill-purple-400"/>
          <circle cx="30" cy="29" r="1.5" className="fill-purple-600 dark:fill-purple-400"/>
          <circle cx="36" cy="29" r="1.5" className="fill-purple-600 dark:fill-purple-400"/>
        </svg>
      ),
    },
    {
      title: 'Mood Tracking',
      description: 'Visualize your emotional patterns with mood pie charts, timelines, and personalized weekly motivation tips.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden="true">
          <circle cx="24" cy="24" r="20" className="fill-amber-100 dark:fill-amber-900/40"/>
          <path d="M24 4 A20 20 0 0 1 44 24 L24 24 Z" className="fill-green-500 dark:fill-green-400"/>
          <path d="M44 24 A20 20 0 0 1 24 44 L24 24 Z" className="fill-indigo-500 dark:fill-indigo-400"/>
          <circle cx="24" cy="24" r="6" className="fill-white dark:fill-gray-800"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need for mindful journaling
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Eunoia combines the power of AI with the simplicity of a journal.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
