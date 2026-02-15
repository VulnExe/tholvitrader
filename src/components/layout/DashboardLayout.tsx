'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, isAuthenticated, checkAuth, fetchNotifications } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
        };
        if (mounted) {
            init();
        }
    }, [mounted, checkAuth]);

    useEffect(() => {
        if (mounted && !isAuthenticated && !pathname?.startsWith('/auth')) {
            // router.push('/auth/login');
        }
        if (mounted && isAuthenticated) {
            fetchNotifications();
        }
    }, [mounted, isAuthenticated, pathname, fetchNotifications, router]);

    const isAdminRoute = pathname?.startsWith('/admin');
    const isAdmin = user?.role === 'admin';

    if (!mounted || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (isAdminRoute && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-white/40 mb-6">You don&apos;t have permission to access the admin panel.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050507] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
