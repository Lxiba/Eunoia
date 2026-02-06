'use client';

import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-950/80" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          Eunoia
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
