export default function OnboardingBanner({ onOpen }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center dark:border-amber-800/30 dark:bg-amber-900/20" role="status">
      <p className="text-sm text-amber-800 dark:text-amber-300">
        Complete your profile to personalize your experience.{' '}
        <button
          onClick={onOpen}
          className="font-medium underline hover:text-amber-900 dark:hover:text-amber-200"
        >
          Finish setup
        </button>
      </p>
    </div>
  );
}
