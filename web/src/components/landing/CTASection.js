import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10 text-center shadow-xl sm:px-8 sm:py-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Ready to start your journey?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-indigo-100 sm:text-lg">
          Join Eunoia and discover a more mindful way to understand your thoughts and emotions.
        </p>
        <Link
          href="/auth"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-md hover:bg-gray-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
        >
          Get Started Free
        </Link>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Eunoia. Built with care for your mental well-being.</p>
      </footer>
    </section>
  );
}
