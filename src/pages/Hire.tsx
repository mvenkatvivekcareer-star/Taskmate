import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Check,
  AlertCircle,
  RefreshCw,
  Database,
} from 'lucide-react';
import { supabase, isSupabaseConfigured, MOCK_TASKMATES, formatRating, toArray, friendlyError } from '../lib/supabaseClient';
import type { TaskMateListing } from '../lib/supabaseClient';

interface HirePageProps {
  onHireClick: () => void;
}

type Status = 'loading' | 'ready' | 'error';

const Hire = ({ onHireClick }: HirePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const [listings, setListings] = useState<TaskMateListing[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setStatus('loading');

    try {
      const { data, error } = await supabase.from('taskmates').select('*').order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setListings(data as TaskMateListing[]);
        setIsLive(true);
        setStatus('ready');
      } else {
        // Table reachable but empty — show the prototype packages.
        setListings(MOCK_TASKMATES);
        setIsLive(false);
        setStatus('ready');
      }
    } catch (err) {
      console.error('[TaskMate] Failed to load taskmates:', err);
      setListings(MOCK_TASKMATES);
      setIsLive(false);
      setErrorMsg(friendlyError(err, 'Could not load TaskMates from the database.'));
      setStatus('error');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What do you need help with?</h1>
          <p className="text-gray-600">Find the perfect TaskMate for your specific needs.</p>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Describe your task... (e.g. I need someone to help me move a wooden table)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Time"
                  className="w-full pl-9 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  className="w-full pl-9 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {status === 'ready' && isLive && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Database className="h-3.5 w-3.5" /> Live from Supabase · {listings.length} options
              </span>
            )}
            {status === 'ready' && !isLive && isSupabaseConfigured && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                <AlertCircle className="h-3.5 w-3.5" /> Table empty — showing sample options
              </span>
            )}
            {status === 'ready' && !isSupabaseConfigured && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                Demo mode — sample options
              </span>
            )}
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* Error banner */}
        {status === 'error' && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 mb-8">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Couldn&rsquo;t load TaskMates from the database.</p>
              <p className="mt-0.5 text-red-600">{errorMsg}</p>
              <button
                onClick={() => load()}
                className="mt-2 text-xs font-bold underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Worker Cards */}
        {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-pulse">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-6 bg-gray-200 rounded-lg w-40" />
                  <div className="h-6 bg-gray-200 rounded-lg w-14" />
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="flex justify-between pt-6 border-t border-gray-50">
                  <div className="h-8 bg-gray-200 rounded-lg w-20" />
                  <div className="h-11 bg-gray-200 rounded-xl w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((worker, idx) => {
                const features = toArray(worker.features);
                return (
                  <motion.div
                    key={worker.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.06, 0.3) }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-6">
                        <h3 className="text-xl font-bold text-gray-900">{worker.title}</h3>
                        <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
                          <Star className="h-4 w-4 fill-yellow-700 mr-1" />
                          {formatRating(worker.rating)}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center text-gray-600 text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="text-2xl font-bold text-gray-900">{worker.price}</div>
                      <button
                        onClick={onHireClick}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
                      >
                        Hire Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-3xl border border-gray-100">
                <Search className="h-8 w-8 text-gray-300 mb-3" />
                <p className="text-sm font-medium">No TaskMate options available right now.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hire;
