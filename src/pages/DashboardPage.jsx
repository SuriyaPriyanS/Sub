import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMySubscription } from '../store/slices/subscriptionSlice';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { FiCalendar, FiTrendingUp, FiPieChart, FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function daysRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function progressPercent(start, end) {
  const total = new Date(end) - new Date(start);
  const elapsed = new Date() - new Date(start);
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Generate mock usage data for the chart
function generateUsageData(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const data = [];
  
  for (let i = 0; i <= totalDays; i += Math.max(1, Math.floor(totalDays / 10))) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const usage = (i / totalDays) * 100;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      usage: Math.min(100, usage),
    });
  }
  return data;
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { mySubscription, loading } = useSelector((s) => s.subscription);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMySubscription()); }, []);

  const remaining = mySubscription ? daysRemaining(mySubscription.end_date) : 0;
  const progress = mySubscription ? progressPercent(mySubscription.start_date, mySubscription.end_date) : 0;
  const usageData = mySubscription ? generateUsageData(mySubscription.start_date, mySubscription.end_date) : [];

  // Plan distribution data
  const planData = mySubscription ? [
    { name: 'Used', value: progress },
    { name: 'Remaining', value: 100 - progress },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your subscription overview.</p>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      ) : mySubscription ? (
        <div className="space-y-6 animate-slide-up">
          {/* Active Plan Card */}
          <div className="card p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge badge-active text-sm px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Active
                  </span>
                  {mySubscription.plan_id?.badge && (
                    <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                      {mySubscription.plan_id.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1">
                  {mySubscription.plan_id?.name} Plan
                </h2>
                <p className="text-3xl font-display font-bold text-brand-600 dark:text-brand-400">
                  ${mySubscription.plan_id?.price}
                  <span className="text-base font-normal text-slate-400">
                    /{mySubscription.base === 'yearly' ? 'year' : 'mo'}
                  </span>
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Days remaining</p>
                <p className="text-4xl font-display font-bold text-slate-900 dark:text-white">{remaining}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Renews {new Date(mySubscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{new Date(mySubscription.start_date).toLocaleDateString()}</span>
                <span>{Math.round(progress)}% used</span>
                <span>{new Date(mySubscription.end_date).toLocaleDateString()}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Timeline Chart */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-brand-500" size={20} />
                <h3 className="font-display font-bold text-slate-900 dark:text-white">Usage Timeline</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution Chart */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiPieChart className="text-brand-500" size={20} />
                <h3 className="font-display font-bold text-slate-900 dark:text-white">Plan Usage Distribution</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiBarChart2 className="text-brand-500" size={20} />
              <h3 className="font-display font-bold text-slate-900 dark:text-white">Plan features</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mySubscription.plan_id?.features?.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/plans" className="btn-primary">Upgrade plan</Link>
          </div>
        </div>
      ) : (
        /* No subscription */
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">No active subscription</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You don't have an active plan yet. Browse our plans to get started.</p>
          <Link to="/plans" className="btn-primary inline-flex">View plans</Link>
        </div>
      )}

      {/* Account info card */}
      <div className="card p-6 mt-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-brand-500" size={20} />
          <h3 className="font-display font-bold text-slate-900 dark:text-white">Account</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
          <span className={`ml-auto badge ${user?.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
}
