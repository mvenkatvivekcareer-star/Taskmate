import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
  Store,
  HelpCircle,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';

interface HomeProps {
  onHireClick: () => void;
}

const Home = ({ onHireClick }: HomeProps) => {
  const steps = [
    {
      title: 'Post or Search',
      description: "Tell us what you need help with. Whether it's moving a couch or grocery runs.",
      icon: <HelpCircle className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Hire',
      description: 'Choose a suitable TaskMate based on availability, time and rating.',
      icon: <Star className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Get It Done',
      description: 'The TaskMate completes the work and you pay for the time they spent.',
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
    },
  ];

  const exampleTasks: { title: string; icon: ReactElement; color: string }[] = [
    { title: 'Moving & Shifting', icon: <Truck className="h-6 w-6" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Carrying Items', icon: <Package className="h-6 w-6" />, color: 'bg-green-100 text-green-600' },
    { title: 'Loading / Unloading', icon: <Package className="h-6 w-6" />, color: 'bg-amber-100 text-amber-600' },
    { title: 'Shop Assistance', icon: <Store className="h-6 w-6" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Grocery Assistance', icon: <ShoppingBag className="h-6 w-6" />, color: 'bg-rose-100 text-rose-600' },
    { title: 'Other Tasks', icon: <HelpCircle className="h-6 w-6" />, color: 'bg-gray-100 text-gray-600' },
  ];

  const comingSoon = [
    { title: 'Location-based matching', emoji: '📍', desc: 'Find help right in your neighbourhood.' },
    { title: 'Worker ratings & reviews', emoji: '⭐', desc: 'Trust vetted, reviewed TaskMates.' },
    { title: 'Secure online payments', emoji: '💳', desc: 'Pay safely through the platform.' },
    { title: 'Customer-worker chat', emoji: '💬', desc: 'Coordinate details in real time.' },
    { title: 'AI-powered matching', emoji: '🤖', desc: 'Smart recommendations for your task.' },
    { title: 'Mobile application', emoji: '📱', desc: 'Hire help on the go.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/70 via-white to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                Hire a person, not a predefined service
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
              >
                Need a Helping Hand?
                <br />
                <span className="text-indigo-600">Hire Someone for the Task.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                From moving furniture to carrying groceries, get a helping hand whenever you need one.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              >
                <Link
                  to="/hire"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Find a TaskMate
                </Link>
                <Link
                  to="/become-taskmate"
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:-translate-y-0.5"
                >
                  Become a TaskMate
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-10 text-sm text-gray-500"
              >
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> 4.8 average rating
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-indigo-500" /> Local availability
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" /> No booking complexity
                </span>
              </motion.div>
            </div>

            {/* Illustration */}
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="bg-white border border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-indigo-100/60 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-200 rounded-full blur-3xl opacity-40" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-40" />

                  <div className="relative">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                          S
                        </div>
                        <p className="mt-2 text-xs font-semibold text-gray-500">Customer</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center text-lg font-bold shadow-sm">
                          T
                        </div>
                        <p className="mt-2 text-xs font-semibold text-gray-500">TaskMate</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-5 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <span className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white" />
                        <span className="w-7 h-7 rounded-full bg-indigo-400 border-2 border-white" />
                      </div>
                      <Package className="h-6 w-6 text-indigo-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">Moving boxes &amp; a wooden table</p>
                        <p className="text-xs text-gray-500">2 hours · today · 1 person</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
                        <p className="text-2xl font-extrabold text-gray-900">₹299</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5" /> Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get the help you need in three simple steps.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <span className="absolute top-5 right-6 text-5xl font-black text-gray-100 select-none">
                  {idx + 1}
                </span>
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Tasks */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Whatever the task, find a helping hand.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flexible help for the things that don&rsquo;t fit into a category.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {exampleTasks.map((task) => (
              <motion.button
                key={task.title}
                whileHover={{ y: -6 }}
                onClick={onHireClick}
                className="p-6 rounded-2xl border border-gray-100 bg-white text-center hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${task.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  {task.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700 block leading-snug">{task.title}</span>
              </motion.button>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/hire"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
            >
              Browse available TaskMates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 lg:py-24 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Coming Soon</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">
              We&rsquo;re building a better way to get things done. Here&rsquo;s what&rsquo;s next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoon.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex gap-4 items-start hover:bg-white/15 transition-colors"
              >
                <span className="text-2xl leading-none">{feature.emoji}</span>
                <div>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-indigo-100 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl px-8 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get it done?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Post your task and get a reliable helping hand today — or start earning by helping others.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/hire"
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all"
              >
                Hire Someone
              </Link>
              <Link
                to="/become-taskmate"
                className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white rounded-full font-bold hover:bg-white/10 hover:border-gray-400 transition-all"
              >
                Work With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
