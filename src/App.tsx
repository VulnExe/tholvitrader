import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

// Auth pages
import AuthLayout from '@/pages/auth/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// User pages
import DashboardPage from '@/pages/DashboardPage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import ToolsPage from '@/pages/ToolsPage';
import ToolDetailPage from '@/pages/ToolDetailPage';
import BlogPage from '@/pages/BlogPage';
import BlogDetailPage from '@/pages/BlogDetailPage';
import SettingsPage from '@/pages/SettingsPage';
import MyAccessPage from '@/pages/MyAccessPage';
import UpgradePage from '@/pages/UpgradePage';
import CheckoutPage from '@/pages/CheckoutPage';

// Public pages
import LandingPage from '@/pages/LandingPage';

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import AdminContentPage from '@/pages/admin/AdminContentPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

// Branded loading screen shown only during initial auth check
function AppLoader() {
  return (
    <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center gap-6">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-5"
      >
        <img
          src="/Tholvitrader.png"
          alt="TholviTrader"
          className="h-14 w-auto object-contain opacity-80"
        />

        {/* Animated loading bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '40%' }}
          />
        </div>

        <p className="text-white/20 text-xs font-medium tracking-widest uppercase">Loading</p>
      </motion.div>
    </div>
  );
}

// Auth initializer: runs auth once, shows branded loader while waiting
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initAuth, isInitialized } = useStore();

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, [initAuth]);

  // Safety: if initialization hasn't completed in 5s, force it
  useEffect(() => {
    if (!isInitialized) {
      const timer = setTimeout(() => {
        if (!useStore.getState().isInitialized) {
          console.warn('Auth initialization timed out, forcing completion');
          useStore.setState({ isInitialized: true, isAuthenticated: false, user: null });
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <AppLoader />;
  }

  return <>{children}</>;
}

// Route guard: if user IS authenticated, redirect away from auth pages
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

// Route guard: if user is NOT authenticated, redirect to login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

// Page transition wrapper for smooth transitions
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { isAuthenticated, user } = useStore();

  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          {/* Auth routes — logged-in users get redirected to dashboard */}
          <Route path="/auth" element={<AuthRoute><AuthLayout /></AuthRoute>}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route index element={<Navigate to="login" replace />} />
          </Route>

          {/* Protected user routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
          <Route path="/tools/:id" element={<ProtectedRoute><ToolDetailPage /></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/my-access" element={<ProtectedRoute><MyAccessPage /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
          <Route path="/upgrade/checkout/:tier" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute><AdminPaymentsPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><AdminContentPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />

          {/* Smart redirects */}
          <Route path="/" element={
            isAuthenticated
              ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
              : <LandingPage />
          } />
          <Route path="*" element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/auth/login" replace />
          } />
        </Routes>
      </AuthInitializer>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#a855f7', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  );
}
