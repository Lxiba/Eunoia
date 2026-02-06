'use client';

import Link from 'next/link';
import { createClient } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ userEmail, chatToggle }) {
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          Eunoia
        </Link>

        <div className="flex items-center gap-3">
          {chatToggle}
          <ThemeToggle />
          {userEmail && (
            <>
              <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:inline">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600
                           hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
