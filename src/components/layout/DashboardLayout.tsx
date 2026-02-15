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
    const { user, isAuthenticated, initAuth, fetchNotifications } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        console.log('[Layout] DashboardLayout mounted.');
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            console.log('[Layout] Initializing auth listener...');
            const unsubscribe = initAuth();
            return () => {
                console.log('[Layout] Unsubscribing from auth listener.');
                unsubscribe();
            };
        }
    }, [mounted, initAuth]);

    useEffect(() => {
        if (mounted) {
            console.log('[Layout] Auth state update:', { isAuthenticated, hasUser: !!user });
            if (isAuthenticated) {
                console.log('[Layout] User authenticated, fetching necessary data...');
                fetchNotifications();
                useStore.getState().fetchCourses();
                useStore.getState().fetchBlogs();
            }
        }
    }, [mounted, isAuthenticated, fetchNotifications, user]);

    const isAdminRoute = pathname?.startsWith('/admin');
    const isAdmin = user?.role === 'admin';

    console.log('[Layout] Rendering state:', { mounted, isAuthenticated, hasUser: !!user, isAdminRoute, isAdmin });

    if (!mounted || !isAuthenticated || (isAuthenticated && !user)) {
        console.log('[Layout] Rendering Loader (checking auth/profile)...');
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (isAdminRoute && !isAdmin) {
        console.log('[Layout] Access denied: User is not an admin.');
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
