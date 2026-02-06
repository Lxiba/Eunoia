'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import EntryForm from '../../components/EntryForm';
import JournalEntry from '../../components/JournalEntry';
import ChatSidebar from '../../components/ChatSidebar';
import ChatToggleButton from '../../components/ChatToggleButton';
import OnboardingModal from '../../components/OnboardingModal';
import OnboardingBanner from '../../components/OnboardingBanner';
import MoodPieChart from '../../components/MoodPieChart';
import MoodTimeline from '../../components/MoodTimeline';
import WeeklyInsights from '../../components/WeeklyInsights';

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/auth');
        return;
      }

      setUser(session.user);

      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) setEntries(data);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', session.user.id)
        .single();

      const completed = profile?.onboarding_completed ?? false;
      setOnboardingCompleted(completed);
      if (!completed) setShowOnboardingModal(true);

      setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/auth');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  function handleEntryCreated(newEntry) {
    setEntries((prev) => [newEntry, ...prev]);
  }

  function handleEntryDeleted(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleOnboardingComplete() {
    setOnboardingCompleted(true);
    setShowOnboardingModal(false);
  }

  function handleOnboardingSkip() {
    setShowOnboardingModal(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
          <p className="text-gray-500 dark:text-gray-400">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        userEmail={user?.email}
        chatToggle={
          <ChatToggleButton
            isOpen={chatOpen}
            onClick={() => setChatOpen(!chatOpen)}
          />
        }
      />

      {onboardingCompleted === false && !showOnboardingModal && (
        <OnboardingBanner onOpen={() => setShowOnboardingModal(true)} />
      )}

      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Entry form */}
            <section aria-label="New journal entry" className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <EntryForm userId={user.id} onEntryCreated={handleEntryCreated} />
            </section>

            {/* Mood analytics */}
            {entries.length > 0 && (
              <section aria-label="Mood analytics" className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold dark:text-gray-200">Your Mood</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <MoodPieChart entries={entries} title="Overall Sentiment" />
                  <MoodTimeline entries={entries} />
                </div>
                <WeeklyInsights entries={entries} />
              </section>
            )}

            {/* Entries list */}
            <section aria-label="Journal entries">
              <h2 className="mb-4 text-lg font-semibold dark:text-gray-200">Your Entries</h2>

              {entries.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
                  <svg viewBox="0 0 48 48" fill="none" className="mx-auto mb-3 h-12 w-12" aria-hidden="true">
                    <rect x="8" y="4" width="32" height="40" rx="4" className="fill-gray-100 dark:fill-gray-800" />
                    <path d="M16 16h16M16 24h12M16 32h8" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">No entries yet</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Write your first thought above to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <JournalEntry
                      key={entry.id}
                      entry={entry}
                      onDeleted={handleEntryDeleted}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Chat sidebar */}
        <ChatSidebar isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>

      {/* Onboarding modal */}
      {showOnboardingModal && (
        <OnboardingModal
          userId={user.id}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
