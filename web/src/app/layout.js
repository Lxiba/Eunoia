'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

function ThemeInitializer({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Eunoia</title>
        <meta name="description" content="AI-powered mental health journal with sentiment analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeInitializer>
          {children}
        </ThemeInitializer>
        <Analytics />
      </body>
    </html>
  );
}
