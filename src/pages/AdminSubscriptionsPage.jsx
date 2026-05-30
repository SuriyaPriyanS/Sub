import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSubscriptions } from '../store/slices/subscriptionSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { FiUsers, FiActivity, FiPieChart, FiBarChart2, FiTrendingUp } from 'react-icons/fi';

const statusConfig = {
  active: { cls: 'badge-active', label: 'Active' },
  expired: { cls: 'badge-expired', label: 'Expired' },
  cancelled: { cls: 'badge-cancelled', label: 'Cancelled' },
};

const STATUS_COLORS = {
  active: '#10b981',
  expired: '#ef4444',
  cancelled: '#6b7280',
};

export default function AdminSubscriptionsPage() {
  const dispatch = useDispatch();
  const { allSubscriptions, pagination, loading } = useSelector((s) => s.subscription);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllSubscriptions({ page, limit: 10, ...(statusFilter && { status: statusFilter }) }));
  }, [page, statusFilter]);

  const stats = {
    total: pagination?.total || 0,
    active: allSubscriptions.filter(s => s.status === 'active').length,
    expired: allSubscriptions.filter(s => s.status === 'expired').length,
    cancelled: allSubscriptions.filter(s => s.status === 'cancelled').length,
  };

  // Status distribution for pie chart
  const statusData = [
    { name: 'Active', value: stats.active, color: STATUS_COLORS.active },
    { name: 'Expired', value: stats.expired, color: STATUS_COLORS.expired },
    { name: 'Cancelled', value: stats.cancelled, color: STATUS_COLORS.cancelled },
  ].filter(item => item.value > 0);

  // Revenue by plan for bar chart
  const planRevenue = allSubscriptions.reduce((acc, sub) => {
    const planName = sub.plan_id?.name || 'Unknown';
    const price = sub.plan_id?.price || 0;
    acc[planName] = (acc[planName] || 0) + price;
    return acc;
  }, {});

  const revenueData = Object.entries(planRevenue).map(([name, value]) => ({
    name,
    revenue: value,
  }));

  // Monthly subscription trend
  const monthlyData = allSubscriptions.reduce((acc, sub) => {
    const month = new Date(sub.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, subscriptions: count }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">Admin</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Subscriptions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all user subscriptions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Subscriptions', value: pagination?.total || 0, color: 'text-brand-600 dark:text-brand-400', icon: FiUsers },
          { label: 'Active', value: stats.active, color: 'text-emerald-600 dark:text-emerald-400', icon: FiActivity },
          { label: 'Expired', value: stats.expired, color: 'text-red-500', icon: FiActivity },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-slate-500', icon: FiActivity },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={color} size={18} />
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
            <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-brand-500" size={20} />
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Status Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

        {/* Revenue by Plan */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-brand-500" size={20} />
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Revenue by Plan</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      {trendData.length > 0 && (
        <div className="card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-brand-500" size={20} />
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Subscription Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="subscriptions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Filter by status:</span>
        {['', 'active', 'expired', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-surface-dark-50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-dark-100/50">
                    {['User', 'Email', 'Plan', 'Price', 'Start Date', 'End Date', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">No subscriptions found.</td>
                    </tr>
                  ) : allSubscriptions.map((sub) => {
                    const sc = statusConfig[sub.status] || statusConfig.cancelled;
                    return (
                      <tr key={sub._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {sub.user_id?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{sub.user_id?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{sub.user_id?.email}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{sub.plan_id?.name} {sub.base && `(${sub.base})`}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">${sub.plan_id?.price}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {new Date(sub.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {new Date(sub.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${sc.cls}`}>{sc.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
