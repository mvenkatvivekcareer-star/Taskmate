import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut } from 'lucide-react';
import { useSession } from '../hooks/useSession';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useSession();
  const { pathname, hash } = useLocation();

  const close = () => setIsOpen(false);

  // "How It Works" scrolls to the section on the homepage.
  const howItWorksLink = pathname === '/' ? '#how-it-works' : '/#how-it-works';

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-colors ${
      active ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
    }`;

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    if (pathname !== '/') {
      window.location.hash = '#/'; // go home first via hash router
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2" onClick={close}>
            <Briefcase className="h-7 w-7 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">TaskMate</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-7">
            <Link to="/" className={navLinkClass(pathname === '/')} onClick={close}>
              Home
            </Link>
            <a href={howItWorksLink} onClick={scrollToHowItWorks} className={navLinkClass(false)}>
              How It Works
            </a>
            <Link
              to="/become-taskmate"
              className={navLinkClass(pathname === '/become-taskmate')}
              onClick={close}
            >
              Become a TaskMate
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-medium max-w-[160px] truncate">{user.email}</span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <button onClick={onLoginClick} className={navLinkClass(false)}>
                Login
              </button>
            )}

            <Link
              to="/hire"
              onClick={close}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Hire Someone
            </Link>
            <Link
              to="/become-taskmate"
              onClick={close}
              className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-all"
            >
              Work With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link to="/" onClick={close} className="block px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium">
              Home
            </Link>
            <a
              href={howItWorksLink}
              onClick={scrollToHowItWorks}
              className="block px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium"
            >
              How It Works
            </a>
            <Link
              to="/become-taskmate"
              onClick={close}
              className="block px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium"
            >
              Become a TaskMate
            </Link>

            {user ? (
              <div className="px-3 py-2.5">
                <p className="text-sm text-gray-700 font-medium truncate">{user.email}</p>
                <button
                  onClick={() => {
                    signOut();
                    close();
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 font-medium"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  close();
                }}
                className="block w-full text-left px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium"
              >
                Login
              </button>
            )}

            <div className="pt-3 pb-1 space-y-2">
              <Link
                to="/hire"
                onClick={close}
                className="block w-full text-center bg-indigo-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all"
              >
                Hire Someone
              </Link>
              <Link
                to="/become-taskmate"
                onClick={close}
                className="block w-full text-center border border-indigo-600 text-indigo-600 px-5 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-all"
              >
                Work With Us
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dev-mode ribbon */}
      {!user && (
        <div className="hidden" data-route={pathname + hash} />
      )}
    </nav>
  );
};

export default Navbar;
