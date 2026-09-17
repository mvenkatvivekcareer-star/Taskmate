import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured, friendlyError } from '../lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'signup';
type Phase = 'form' | 'busy' | 'done';

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<Mode>('login');
  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  // Reset whenever the modal is opened/closed.
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setSuccess(null);
      setNeedsConfirmation(false);
      setPhase('form');
      setMode('login');
    }
  }, [isOpen]);

  // Esc to close.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setNeedsConfirmation(false);

    if (!email.trim() || !password) {
      setError('Please enter both an email address and a password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Passwords must be at least 6 characters long.');
      return;
    }

    setPhase('busy');
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;

        setSuccess('Logged in successfully!');
        setTimeout(onClose, 1100);
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (err) throw err;

        // If email confirmation is enabled there is no session yet.
        if (data?.session && data?.user) {
          setSuccess('Account created — you are now logged in!');
          setTimeout(onClose, 1400);
        } else {
          setNeedsConfirmation(true);
          setSuccess(null);
        }
      }
    } catch (err) {
      setError(friendlyError(err));
      setPhase('form');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
              <p className="text-gray-500 mt-2">
                Please log in or create an account to continue with your booking.
              </p>
            </div>

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            {/* Email-confirmation notice */}
            {needsConfirmation && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl px-4 py-4 text-sm">
                <Mail className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Check your inbox</p>
                  <p className="mt-1">
                    We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it to activate
                    your account, then log in here.
                  </p>
                  <button
                    onClick={() => {
                      setNeedsConfirmation(false);
                      setMode('login');
                    }}
                    className="mt-3 text-xs font-bold underline hover:text-blue-900"
                  >
                    I&rsquo;ve confirmed — take me to login
                  </button>
                </div>
              </div>
            )}

            {!success && !needsConfirmation && (
              <>
                <div className="space-y-3">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <input
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mt-4">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-4 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={phase === 'busy'}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {phase === 'busy' && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === 'login' ? 'Login' : 'Create Account'}
                  </button>

                  <button
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setError(null);
                    }}
                    className="w-full bg-white text-indigo-600 border border-indigo-200 py-3 rounded-xl font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                  >
                    {mode === 'login' ? 'Create Account' : 'I already have an account'}
                  </button>
                </div>
              </>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              {isSupabaseConfigured
                ? "By continuing, you agree to TaskMate's Terms of Service and Privacy Policy."
                : 'Demo mode: authentication is simulated until Supabase credentials are configured.'}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
