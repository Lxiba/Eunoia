'use client';

import { useState, useRef, useCallback } from 'react';
import { analyzeSentiment } from '../lib/sentiment';
import { createClient } from '../lib/supabase';

export default function EntryForm({ userId, onEntryCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listening, setListening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const supabase = createClient();

  // ── Speech-to-text ──
  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  function toggleSpeech() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = content;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
          setContent(finalTranscript);
        } else {
          interim += transcript;
        }
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  // ── File upload ──
  async function parseFile(file) {
    setUploading(true);
    setError(null);

    try {
      // Client-side for plain text files
      const name = file.name.toLowerCase();
      if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') || name.endsWith('.json') || name.endsWith('.tsv')) {
        const text = await file.text();
        if (!text.trim()) throw new Error('File appears to be empty');
        setContent((prev) => (prev ? prev + '\n\n' : '') + text.trim());
      } else {
        // Server-side for PDFs and other formats
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/parse-file', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to parse file');
        setContent((prev) => (prev ? prev + '\n\n' : '') + data.text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = '';
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }, []);

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }

    setLoading(true);
    setError(null);

    try {
      const sentiment = await analyzeSentiment(content);

      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          content: content.trim(),
          sentiment_label: sentiment.label,
          sentiment_score: sentiment.score,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setContent('');
      onEntryCreated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="journal-entry" className="block text-sm font-medium dark:text-gray-300">
        How are you feeling today?
      </label>

      {/* Textarea with drop zone */}
      <div
        className={`relative rounded-lg border-2 transition-colors ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/10'
            : 'border-transparent'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          id="journal-entry"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts, paste text, or drop a file here..."
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />

        {dragOver && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-indigo-50/80 dark:bg-indigo-900/30">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Drop file to import</p>
          </div>
        )}
      </div>

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Speech-to-text */}
        {speechSupported && (
          <button
            type="button"
            onClick={toggleSpeech}
            aria-label={listening ? 'Stop listening' : 'Start voice input'}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              listening
                ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {listening ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Listening... (click to stop)
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                  <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                </svg>
                Voice
              </>
            )}
          </button>
        )}

        {/* File upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600
                     hover:bg-gray-50 disabled:opacity-50
                     dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          {uploading ? 'Reading...' : 'Upload File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.csv,.json,.tsv,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />

        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          .txt .pdf .csv .md supported
        </span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   dark:focus:ring-offset-gray-900"
      >
        {loading ? 'Analyzing...' : 'Save Entry'}
      </button>
    </form>
  );
}
