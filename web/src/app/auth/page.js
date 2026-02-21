'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase';
import AuthForm from '../../components/AuthForm';
import ThemeToggle from '../../components/ThemeToggle';
import Link from 'next/link';

export default function AuthPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/journal');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/journal');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute left-4 top-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
          &larr; Back to home
        </Link>
      </div>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          Eunoia
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your AI-powered thought journal
        </p>
      </div>

      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
