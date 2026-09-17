import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* ------------------------------------------------------------------ *
 * TaskMate — Supabase client
 * ------------------------------------------------------------------ *
 * Credentials come from Vite env vars (see `.env`):
 *   VITE_SUPABASE_URL       = https://ulvamposfhvbvwsfxbpr.supabase.co
 *   VITE_SUPABASE_ANON_KEY  = sb_publishable_...   (PUBLIC key, safe in browser)
 *
 * IMPORTANT: never place the service-role / secret key in this file.
 * ------------------------------------------------------------------ */

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

/** True when both values look usable. Publishable keys are ~48 chars. */
export const isSupabaseConfigured: boolean =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;

/* ------------------------------------------------------------------ *
 * Fallback records — only used if the DB is empty or unreachable.
 * ------------------------------------------------------------------ */

export interface TaskMateListing {
  id: number | string;
  title: string;
  features: string[];
  rating: number | string;
  price: string;
  type?: string;
}

export const MOCK_TASKMATES: TaskMateListing[] = [
  {
    id: 1,
    title: 'TaskMate — 2 Hours',
    features: ['Up to 2 hours', 'Flexible everyday assistance', 'Local availability'],
    rating: 4.8,
    price: '₹299',
    type: 'package',
  },
  {
    id: 2,
    title: 'TaskMate — 3 Hours',
    features: ['Up to 3 hours', 'Flexible everyday assistance', 'Local availability'],
    rating: 4.7,
    price: '₹399',
    type: 'package',
  },
  {
    id: 3,
    title: 'TaskMate — 5 Hours',
    features: ['Up to 5 hours', 'Flexible everyday assistance', 'Local availability'],
    rating: 4.9,
    price: '₹599',
    type: 'package',
  },
  {
    id: 4,
    title: 'Flexible TaskMate',
    features: ['No fixed duration', 'Pay according to hours worked', 'Suitable for longer tasks'],
    rating: 4.8,
    price: '₹150 / hour',
    type: 'hourly',
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ *
 * Offline / demo fallback client.
 * Implements only the surface TaskMate uses so the UI never crashes
 * when credentials are missing.
 * ------------------------------------------------------------------ */

function createDemoClient() {
  const applications: any[] = [];
  const listeners = new Set<(event: string) => void>();
  let current: { email: string } | null = null;
  const notify = (e: string) => listeners.forEach((cb) => cb(e));

  return {
    __demo: true,
    auth: {
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        await delay(500);
        if (!email || !password) {
          return { data: { user: null, session: null }, error: { message: 'Please enter both email and password.' } };
        }
        current = { email };
        notify('SIGNED_IN');
        return { data: { user: { email }, session: { user: { email } } }, error: null };
      },
      async signUp({ email, password }: { email: string; password: string }) {
        await delay(700);
        if (!email || !password) {
          return { data: { user: null, session: null }, error: { message: 'Please enter both email and password.' } };
        }
        current = { email };
        notify('SIGNED_IN');
        return { data: { user: { email }, session: null }, error: null };
      },
      async signOut() {
        current = null;
        notify('SIGNED_OUT');
        return { error: null };
      },
      async getUser() {
        return { data: { user: current }, error: null };
      },
      async getSession() {
        return { data: { session: current ? { user: current } : null }, error: null };
      },
      onAuthStateChange(cb: (event: string) => void) {
        listeners.add(cb);
        return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
      },
    },
    from(table: string) {
      return {
        async select() {
          await delay(400);
          if (table === 'taskmates') return { data: [...MOCK_TASKMATES], error: null };
          return { data: [...applications], error: null };
        },
        async insert(payload: any) {
          await delay(600);
          const rows = Array.isArray(payload) ? payload : [payload];
          if (table === 'applications') {
            applications.push(...rows.map((r, i) => ({ id: applications.length + i + 1, ...r })));
          }
          return { data: rows, error: null, status: 201, count: rows.length };
        },
        update() {
          return { eq: async () => ({ data: null, error: null }) };
        },
        delete() {
          return { eq: async () => ({ data: null, error: null }) };
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ *
 * Exported singleton
 * ------------------------------------------------------------------ */

export const supabase: SupabaseClient | any = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'taskmate-auth',
      },
      global: { headers: { 'x-application-name': 'taskmate-web' } },
      db: { schema: 'public' },
    })
  : (() => {
      console.warn(
        '[TaskMate] Supabase env vars missing — running in DEMO MODE.\n' +
          'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
      );
      return createDemoClient();
    })();

export default supabase;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Normalises a Postgres `numeric` (may arrive as string) to "4.8". */
export const formatRating = (rating: unknown): string => {
  const n = typeof rating === 'number' ? rating : parseFloat(String(rating));
  return Number.isFinite(n) ? n.toFixed(1) : '—';
};

/** Coerces `features` into a string array whether it's text[] or JSON. */
export const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === 'string' && value.length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return [value];
    }
  }
  return [];
};

/** Maps supabase-js errors onto friendly, human-readable messages. */
export const friendlyError = (err: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  const message = (err as { message?: string } | null)?.message?.trim();
  if (!message) return fallback;

  const m = message.toLowerCase();

  if (m.includes('invalid login credentials')) return 'Incorrect email or password. Please try again.';
  if (m.includes('email not confirmed')) return 'Please confirm your email address before logging in.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'An account with this email already exists. Try logging in instead.';
  if (m.includes('password should be at least')) return 'Passwords must be at least 6 characters long.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'That email address looks invalid.';
  if (m.includes('row-level security') || m.includes('permission denied'))
    return 'Database permission denied — check the RLS policies on this table.';
  if (m.includes('could not find the table') || m.includes('does not exist'))
    return 'The required database table is missing. Please run the Supabase setup SQL.';
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('network request failed'))
    return 'Network error — could not reach Supabase. Check your connection.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a moment and retry.';

  return message;
};
