import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface SessionUser {
  id?: string;
  email: string;
}

/**
 * Tracks the current Supabase user, listening for auth changes.
 * Works with the real client and the offline demo client.
 */
export const useSession = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          const u = data?.user;
          setUser(u?.email ? { id: u.id, email: u.email } : null);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const { data } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      mounted = false;
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('[TaskMate] signOut failed:', e);
    }
    setUser(null);
  };

  return { user, loading, signOut, isDemoMode: !isSupabaseConfigured };
};

export default useSession;
