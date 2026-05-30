import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiZap, FiShield, FiBarChart2, FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow"></span>
          SaaS Subscription Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-6">
          Manage subscriptions
          <br />
          <span className="text-brand-600 dark:text-brand-400">effortlessly</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          SubsHub gives you everything to handle subscription plans, user management, and billing in one clean dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/plans" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
            View plans
            <FiArrowRight size={16} />
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn-secondary text-base px-8 py-3 flex items-center gap-2">
              Get started free
              <FiArrowRight size={16} />
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="btn-secondary text-base px-8 py-3 flex items-center gap-2">
              Go to dashboard
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
        {[
          { icon: FiZap, title: 'Instant setup', desc: 'Register and subscribe to a plan in under 60 seconds.' },
          { icon: FiShield, title: 'Secure auth', desc: 'JWT + refresh token authentication with role-based access.' },
          { icon: FiBarChart2, title: 'Admin dashboard', desc: 'Full visibility into all subscriptions with filters & pagination.' },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="card p-6 text-left animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon className="text-brand-600 dark:text-brand-400" size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
