import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, PartyPopper } from 'lucide-react';
import { supabase, isSupabaseConfigured, friendlyError } from '../lib/supabaseClient';

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';
const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

const BecomeTaskMate = () => {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    age: '',
    skills: '',
    hours: '',
    description: '',
    agree: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ---- client-side validation before touching the database ----
    if (!formData.fullName.trim()) return setError('Please enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      return setError('Please enter a valid email address.');
    if (formData.phone.replace(/\D/g, '').length < 7)
      return setError('Please enter a valid phone number.');
    if (!formData.city.trim()) return setError('Please enter your city or location.');

    const age = parseInt(formData.age, 10);
    if (!Number.isFinite(age) || age < 18 || age > 100)
      return setError('You must be at least 18 years old to apply.');

    if (!formData.skills.trim()) return setError('Please describe the work you can help with.');
    if (!formData.hours.trim()) return setError('Please tell us your available hours.');
    if (!formData.description.trim()) return setError('Please add a short description about yourself.');

    if (!formData.agree) {
      setError('You must agree to the TaskMate terms and conditions.');
      return;
    }

    // ---- insert into public.applications ----
    setBusy(true);
    try {
      const { error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            age,
            skills: formData.skills.trim(),
            available_hours: formData.hours.trim(),
            description: formData.description.trim(),
          },
      ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[TaskMate] application insert failed:', err);
      setError(friendlyError(err, 'Could not save your application. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white p-10 sm:p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-40" />
            <div className="relative w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            Application Received! <PartyPopper className="h-7 w-7 text-amber-500" />
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for your interest in becoming a TaskMate. We&rsquo;ll contact you using the information you
            provided.
          </p>
          {isSupabaseConfigured ? (
            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 mb-6">
              <CheckCircle className="h-3.5 w-3.5" /> Saved to your Supabase
              <code className="bg-green-100 px-1 rounded">applications</code> table.
            </p>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-6">
              Demo mode — this submission wasn&rsquo;t saved to a server.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  city: '',
                  age: '',
                  skills: '',
                  hours: '',
                  description: '',
                  agree: false,
                });
              }}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Submit another
            </button>
            <a
              href="#/"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Back to home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Want to Earn by Helping People?</h1>
          <p className="text-gray-600">Join TaskMate and get opportunities to work on flexible everyday tasks.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Flexible hours', emoji: '🕒' },
            { label: 'Weekly payouts', emoji: '💸' },
            { label: 'Work locally', emoji: '📍' },
          ].map((b) => (
            <div
              key={b.label}
              className="bg-white border border-gray-100 rounded-2xl px-3 py-4 text-center shadow-sm"
            >
              <div className="text-xl mb-1">{b.emoji}</div>
              <p className="text-xs font-semibold text-gray-600">{b.label}</p>
            </div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                placeholder="Rahul Sharma"
                className={inputClass}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                placeholder="+91 98765 43210"
                className={inputClass}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="city">
                City / Location
              </label>
              <input
                id="city"
                type="text"
                name="city"
                required
                placeholder="Bengaluru"
                className={inputClass}
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                name="age"
                min={18}
                max={80}
                required
                placeholder="28"
                className={inputClass}
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="hours">
                Available Hours
              </label>
              <input
                id="hours"
                type="text"
                name="hours"
                required
                placeholder="e.g. 20 hours per week"
                className={inputClass}
                value={formData.hours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="skills">
              Skills / Type of Work You Can Help With
            </label>
            <textarea
              id="skills"
              name="skills"
              required
              rows={3}
              placeholder="Moving furniture, loading & unloading, shop assistance…"
              className={inputClass}
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="description">
              Short Description About Yourself
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Tell customers a bit about your experience and the kind of work you're looking for…"
              className={inputClass}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              required
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to the <span className="text-indigo-600 underline">TaskMate terms and conditions</span>.
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="h-5 w-5 animate-spin" />}
            {busy ? 'Submitting…' : 'Submit Application'}
          </button>

          <p className="text-center text-xs text-gray-400">
            {isSupabaseConfigured
              ? 'Your details are stored securely in our Supabase database.'
              : 'Demo mode: submissions are simulated and not stored.'}
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default BecomeTaskMate;
