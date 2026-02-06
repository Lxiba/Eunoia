import { createBrowserClient } from '@supabase/ssr';

let client;

function isConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && url !== 'your_supabase_url_here' && url.startsWith('http');
}

function createDemoClient() {
  const DEMO_USER = {
    id: 'demo-user-00000000-0000-0000-0000-000000000000',
    email: 'demo@eunoia.local',
  };

  let session = null;
  let entries = [];
  let profiles = {};
  const listeners = new Set();

  function notify() {
    const event = session ? 'SIGNED_IN' : 'SIGNED_OUT';
    listeners.forEach((cb) => cb(event, session));
  }

  function journalEntriesTable() {
    return {
      select: () => ({
        eq: (col, val) => ({
          order: (orderCol, opts) => {
            const sorted = [...entries].sort((a, b) =>
              opts?.ascending
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at)
            );
            return Promise.resolve({ data: sorted, error: null });
          },
          single: () => {
            const found = entries.find((e) => e[col] === val) || null;
            return Promise.resolve({ data: found, error: null });
          },
        }),
      }),
      insert: (row) => ({
        select: () => ({
          single: async () => {
            const newEntry = {
              ...row,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            entries.push(newEntry);
            return { data: newEntry, error: null };
          },
        }),
      }),
      delete: () => ({
        eq: (col, val) => {
          entries = entries.filter((e) => e[col] !== val);
          return Promise.resolve({ error: null });
        },
      }),
    };
  }

  function userProfilesTable() {
    return {
      select: () => ({
        eq: (col, val) => ({
          single: () => {
            const profile = profiles[val] || null;
            return Promise.resolve({ data: profile, error: null });
          },
        }),
      }),
      upsert: (row) => {
        profiles[row.user_id] = {
          ...profiles[row.user_id],
          ...row,
          updated_at: new Date().toISOString(),
        };
        return Promise.resolve({ data: profiles[row.user_id], error: null });
      },
      insert: (row) => ({
        select: () => ({
          single: async () => {
            profiles[row.user_id] = { ...row, created_at: new Date().toISOString() };
            return { data: profiles[row.user_id], error: null };
          },
        }),
      }),
    };
  }

  return {
    _demo: true,
    auth: {
      getSession: async () => ({ data: { session } }),
      onAuthStateChange: (cb) => {
        listeners.add(cb);
        return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
      },
      signUp: async ({ email }) => {
        session = { user: { ...DEMO_USER, email } };
        setTimeout(notify, 0);
        return { data: { session }, error: null };
      },
      signInWithPassword: async ({ email }) => {
        session = { user: { ...DEMO_USER, email } };
        setTimeout(notify, 0);
        return { data: { session }, error: null };
      },
      signOut: async () => {
        session = null;
        entries = [];
        profiles = {};
        setTimeout(notify, 0);
      },
    },
    from: (tableName) => {
      switch (tableName) {
        case 'user_profiles':
          return userProfilesTable();
        case 'journal_entries':
        default:
          return journalEntriesTable();
      }
    },
  };
}

export function createClient() {
  if (client) return client;

  if (!isConfigured()) {
    client = createDemoClient();
    return client;
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return client;
}

export function isDemoMode() {
  return !isConfigured();
}
