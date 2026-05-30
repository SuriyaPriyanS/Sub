import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPlan, fetchPlans } from '../store/slices/subscriptionSlice';
import { FiPlus, FiX, FiCheck, FiZap, FiStar, FiShield, FiUsers } from 'react-icons/fi';

const planIcons = {
  'Basic': FiZap,
  'Popular': FiStar,
  'Pro': FiShield,
  'Enterprise': FiUsers,
};

const badgeOptions = ['Most Popular', 'New', 'Best Value', ''];

export default function AdminPlansPage() {
  const dispatch = useDispatch();
  const { createLoading, plans } = useSelector((s) => s.subscription);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 30,
    badge: '',
    features: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e) => {
    setFormData(prev => ({ ...prev, features: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const planData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      features: formData.features.split('\n').filter(f => f.trim()),
    };
    await dispatch(createPlan(planData));
    dispatch(fetchPlans());
    setShowModal(false);
    setFormData({ name: '', price: '', duration: 30, badge: '', features: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', price: '', duration: 30, badge: '', features: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">Admin</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Plans</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage subscription plans.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus size={16} />
            Create plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => {
          const isPopular = plan.badge === 'Most Popular';
          const Icon = planIcons[plan.name] || FiZap;

          return (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded-2xl border-2 transition-all duration-200 animate-fade-in ${
                isPopular
                  ? 'border-brand-500 bg-brand-600 text-white shadow-2xl shadow-brand-500/20 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50'
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isPopular ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'
                }`}>
                  <Icon size={12} />
                  {plan.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className={`text-lg font-display font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-display font-bold ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-sm ${isPopular ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      /{plan.duration === 365 ? 'year' : 'mo'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${isPopular ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${isPopular ? 'text-white' : 'text-brand-500'}`}>
                        <FiCheck size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark-50 rounded-2xl p-6 max-w-lg w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Create new plan
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiX size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Plan name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="e.g., Basic, Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value={30}>Monthly (30 days)</option>
                  <option value={365}>Yearly (365 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Badge
                </label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {badgeOptions.map(badge => (
                    <option key={badge} value={badge}>
                      {badge || 'None'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleFeatureChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark-50 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} />
                      Create plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}