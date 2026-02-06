import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/20" />
        <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/15" />
      </div>

      <div className="relative z-10">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          AI-Powered Mental Health Journal
        </span>

        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
          Your thoughts deserve{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            beautiful thinking
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Eunoia helps you journal mindfully with AI-powered sentiment analysis
          and a compassionate chat companion that understands how you feel.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:shadow-indigo-900/30 dark:focus:ring-offset-gray-900"
          >
            Start Journaling Free
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="relative z-10 mt-12 w-full max-w-lg" aria-hidden="true">
        <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <rect x="60" y="40" width="280" height="180" rx="8" className="fill-white stroke-gray-200 dark:fill-gray-800 dark:stroke-gray-700" strokeWidth="2"/>
          <line x1="200" y1="40" x2="200" y2="220" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2"/>
          <line x1="80" y1="70" x2="180" y2="70" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1.5"/>
          <line x1="80" y1="90" x2="175" y2="90" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1.5"/>
          <line x1="80" y1="110" x2="165" y2="110" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1.5"/>
          <line x1="80" y1="130" x2="170" y2="130" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1.5"/>
          <line x1="80" y1="150" x2="155" y2="150" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1.5"/>
          <circle cx="280" cy="110" r="25" className="fill-indigo-100 dark:fill-indigo-900/40"/>
          <path d="M280 90 L283 105 L298 108 L283 111 L280 126 L277 111 L262 108 L277 105 Z" className="fill-indigo-500 dark:fill-indigo-400"/>
          <circle cx="240" cy="75" r="3" className="fill-purple-400 dark:fill-purple-500 animate-pulse"/>
          <circle cx="310" cy="155" r="2.5" className="fill-indigo-400 dark:fill-indigo-500 animate-pulse"/>
          <circle cx="255" cy="170" r="2" className="fill-pink-400 dark:fill-pink-500 animate-pulse"/>
        </svg>
      </div>
    </section>
  );
}
