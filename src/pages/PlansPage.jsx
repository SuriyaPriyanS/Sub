import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlans, subscribeToPlan, clearMessages, fetchMySubscription } from '../store/slices/subscriptionSlice';
import { FiCheck, FiZap, FiStar, FiShield, FiUsers, FiX } from 'react-icons/fi';

const featureIcons = {
  'Basic': FiZap,
  'Popular': FiStar,
  'Pro': FiShield,
  'Enterprise': FiUsers,
};

export default function PlansPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, loading, subscribeLoading, error, successMessage, mySubscription, subscriptionLoading: subLoading } = useSelector((s) => s.subscription);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [selectedBase, setSelectedBase] = useState('monthly');

  useEffect(() => {
    dispatch(fetchPlans());
    if (isAuthenticated) {
      dispatch(fetchMySubscription());
    }
    return () => dispatch(clearMessages());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  }, [successMessage]);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) return navigate('/login');
    setSelectedPlan(planId);
    setShowBaseModal(true);
  };

  const handleBaseSelect = async () => {
    if (selectedPlan) {
      await dispatch(subscribeToPlan({ planId: selectedPlan, base: selectedBase }));
      setShowBaseModal(false);
      setSelectedPlan(null);
    }
  };

  const handleCloseModal = () => {
    setShowBaseModal(false);
    setSelectedPlan(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-slate-500">Loading plans...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-left mb-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Choose a plan
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
          Flexible options for every team. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* No active subscription message */}
      {isAuthenticated && !subLoading && mySubscription === null && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/40 rounded-xl text-red-700 dark:text-red-400 text-sm">
          You don't have an active subscription. Choose a plan to get started.
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => {
          const isCurrentPlan = mySubscription && (
            (typeof mySubscription.plan_id === 'object' && mySubscription.plan_id?._id === plan._id) ||
            (typeof mySubscription.plan_id === 'string' && mySubscription.plan_id === plan._id)
          );
          const isLoading = subscribeLoading && selectedPlan === plan._id;

          return (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded-2xl border-2 transition-all duration-300 animate-fade-in ${
                isCurrentPlan
                  ? 'border-red-500/80 bg-white dark:bg-surface-dark-50 shadow-xl shadow-red-500/5 scale-[1.01]'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-dark-50'
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="p-7 flex flex-col flex-1">
                {isCurrentPlan && (
                  <div className="px-2.5 py-1 rounded bg-[#162e2a] text-[#34d399] border border-[#1e5847]/40 text-[10px] font-bold tracking-wider w-fit mb-3">
                    YOUR PLAN
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-0.5 mt-2">
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">$</span>
                    <span className="text-4xl md:text-5xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    per month · {plan.duration === 365 ? 'annual billing' : 'monthly billing'}
                  </div>
                </div>

                <ul className="space-y-3.5 flex-1 mb-8 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-slate-600 dark:text-slate-300 font-medium">
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-slate-100 dark:bg-surface-dark-100 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent'
                      : 'bg-[#eb4b5f] hover:bg-[#e13b50] text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Subscribing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current plan'
                  ) : (
                    `Get ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-12 text-sm text-slate-400 dark:text-slate-500">
        All plans include a 14-day money-back guarantee.
      </p>

      {/* Base Selection Modal */}
      {showBaseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-surface-dark-50 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white">
                Choose your plan base
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiX size={20} className="text-slate-500" />
              </button>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Select your preferred billing cycle for the subscription.
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <input
                  type="radio"
                  name="base"
                  value="monthly"
                  checked={selectedBase === 'monthly'}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="w-4 h-4 text-[#eb4b5f] focus:ring-[#eb4b5f]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">Monthly</p>
                  <p className="text-xs text-slate-500">Billed every month</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <input
                  type="radio"
                  name="base"
                  value="yearly"
                  checked={selectedBase === 'yearly'}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="w-4 h-4 text-[#eb4b5f] focus:ring-[#eb4b5f]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">Yearly</p>
                  <p className="text-xs text-slate-500">Billed annually (save 20%)</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBaseSelect}
                disabled={subscribeLoading}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-[#eb4b5f] hover:bg-[#e13b50] text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {subscribeLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
