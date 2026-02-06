export default function HowItWorksSection() {
  const steps = [
    { number: '1', title: 'Write', description: 'Open your journal and write whatever is on your mind. No prompts needed — just be yourself.' },
    { number: '2', title: 'Analyze', description: 'AI instantly reads the emotional tone and gives you a sentiment score with a visual mood breakdown.' },
    { number: '3', title: 'Reflect', description: 'Chat with your AI companion, track your mood over time, and get personalized weekly insights.' },
  ];

  return (
    <section className="bg-gray-50 py-20 px-4 dark:bg-gray-900/50 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Three simple steps to a more mindful you.
        </p>

        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
