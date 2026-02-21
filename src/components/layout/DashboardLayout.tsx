import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, isAuthenticated, isInitialized, fetchNotifications } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [mobileOpen, setMobileOpen] = useState(false);

    // Fetch notifications and initial data when authenticated
    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchNotifications();
            useStore.getState().fetchCourses();
        }
    }, [isInitialized, isAuthenticated, fetchNotifications]);

    const isAdminRoute = pathname?.startsWith('/admin');
    const isAdmin = user?.role === 'admin';

    // Admin route protection
    if (isAdminRoute && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-center">
                <div>
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6V7a4 4 0 00-4-4H8a4 4 0 00-4 4v4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-white/40 mb-6">You don&apos;t have permission to access the admin panel.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050507] flex">
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar setMobileOpen={setMobileOpen} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
