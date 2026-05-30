import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlansPage from './pages/PlansPage';
import DashboardPage from './pages/DashboardPage';
import AdminSubscriptionsPage from './pages/AdminSubscriptionsPage';
import AdminPlansPage from './pages/AdminPlansPage';
import 'react-toastify/dist/ReactToastify.css';

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/subscriptions" element={<ProtectedRoute adminOnly><AdminSubscriptionsPage /></ProtectedRoute>} />
          <Route path="/admin/plans" element={<ProtectedRoute adminOnly><AdminPlansPage /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="text-center py-24">
              <h1 className="text-6xl font-display font-bold text-slate-200 dark:text-slate-700 mb-4">404</h1>
              <p className="text-slate-500">Page not found.</p>
            </div>
          } />
        </Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastClassName="dark:bg-surface-dark-0"
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}
