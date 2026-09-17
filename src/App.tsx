import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Hire from './pages/Hire';
import BecomeTaskMate from './pages/BecomeTaskMate';
import { isSupabaseConfigured } from './lib/supabaseClient';

/** Scrolls to the top whenever the route changes. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

const DemoBanner = () => {
  if (isSupabaseConfigured) return null;
  return (
    <div className="bg-gray-900 text-gray-100 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
        <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
        <p>
          <span className="font-semibold text-white">Demo mode</span> — no Supabase credentials detected. Data shown is
          sample data.
        </p>
      </div>
    </div>
  );
};

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <DemoBanner />
          <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />

          <main className="flex-grow">
            <ErrorBoundary>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home onHireClick={() => setIsLoginModalOpen(true)} />} />
                <Route path="/hire" element={<Hire onHireClick={() => setIsLoginModalOpen(true)} />} />
                <Route path="/become-taskmate" element={<BecomeTaskMate />} />
                <Route path="*" element={<Home onHireClick={() => setIsLoginModalOpen(true)} />} />
              </Routes>
            </ErrorBoundary>
          </main>

          <Footer />

          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
