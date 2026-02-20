'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabase';

const OCCUPATIONS = ['Student', 'Professional', 'Creative', 'Homemaker', 'Retired', 'Other'];
const PURPOSES = [
  'Track my mood over time',
  'Manage stress and anxiety',
  'Build a journaling habit',
  'Explore my thoughts with AI',
  'Self-improvement',
  'Other',
];
const AGE_RANGES = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];
const INTERESTS = ['Mindfulness', 'Meditation', 'Fitness', 'Reading', 'Creative Writing', 'Therapy', 'Self-Care', 'Productivity'];

export default function OnboardingModal({ userId, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    occupation: '',
    purpose: '',
    age_range: '',
    interests: [],
  });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  function updateAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInterest(interest) {
    setAnswers((prev) => {
      const current = prev.interests;
      const next = current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest];
      return { ...prev, interests: next };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await supabase.from('user_profiles').upsert({
        user_id: userId,
        occupation: answers.occupation,
        purpose: answers.purpose,
        age_range: answers.age_range,
        interests: answers.interests,
        onboarding_completed: true,
      });
      onComplete();
    } catch {
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    {
      title: 'What do you do?',
      subtitle: 'This helps us personalize your experience.',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {OCCUPATIONS.map((occ) => (
            <button
              key={occ}
              type="button"
              onClick={() => updateAnswer('occupation', occ)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                answers.occupation === occ
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Why are you here?',
      subtitle: 'Select the main reason you want to use Eunoia.',
      content: (
        <div className="space-y-2">
          {PURPOSES.map((purpose) => (
            <button
              key={purpose}
              type="button"
              onClick={() => updateAnswer('purpose', purpose)}
              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                answers.purpose === purpose
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'What is your age range?',
      subtitle: 'This stays private and helps us tailor content.',
      content: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AGE_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => updateAnswer('age_range', range)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                answers.age_range === range
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'What are you interested in?',
      subtitle: 'Select all that apply.',
      content: (
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                answers.interests.includes(interest)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Onboarding questionnaire">
      <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i <= step ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{current.title}</h2>
        <p className="mt-1 mb-6 text-sm text-gray-500 dark:text-gray-400">{current.subtitle}</p>

        {current.content}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Skip for now
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? handleSave() : setStep(step + 1))}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
