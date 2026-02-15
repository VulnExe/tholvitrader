'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Shield,
    ShieldCheck,
    Settings,
    LogOut,
    Users,
    CreditCard,
    BarChart3,
    FolderOpen,
    ChevronLeft,
    Zap,
    Wrench,
    X,
} from 'lucide-react';
import TierBadge from '../ui/TierBadge';
import { useState } from 'react';

interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useStore();
    const [collapsed, setCollapsed] = useState(false);
    const isAdmin = user?.role === 'admin';
    const isAdminRoute = pathname?.startsWith('/admin');

    const userMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/courses', label: 'Courses', icon: BookOpen },
        { href: '/tools', label: 'Tools', icon: Wrench },
        { href: '/blog', label: 'Blog', icon: FileText },
        { href: '/my-access', label: 'My Access', icon: ShieldCheck },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const adminMenuItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
        { href: '/admin/payments', icon: CreditCard, label: 'Payment Review' },
        { href: '/admin/users', icon: Users, label: 'Users' },
        { href: '/admin/content', icon: FolderOpen, label: 'Content' },
        { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const menuItems = isAdminRoute ? adminMenuItems : userMenuItems;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen?.(false)}
            />

            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen z-50
                    bg-[#0a0a0c] border-r border-white/5
                    flex flex-col transition-all duration-300 ease-in-out shrink-0
                    ${collapsed ? 'w-[72px]' : 'w-[260px]'}
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Area */}
                <div className="px-5 h-16 flex items-center justify-between border-b border-white/5">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                            <img src="/Tholvitrader.png" alt="TholviTrader" className="h-8 w-auto object-contain" />
                        </Link>
                    )}
                    {collapsed && (
                        <img src="/Tholvitrader.png" alt="Logo" className="w-8 h-8 object-contain mx-auto" />
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={`
                                w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 hidden lg:flex items-center justify-center
                                text-white/30 hover:text-white/60 transition-all
                                ${collapsed ? 'rotate-180 mx-auto' : ''}
                            `}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setMobileOpen?.(false)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex lg:hidden items-center justify-center text-white/40 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* User Info */}
                {!collapsed && user && (
                    <div className="px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <TierBadge tier={user.tier} size="sm" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {/* Switch between admin/user */}
                    {isAdmin && (
                        <Link
                            href={isAdminRoute ? '/dashboard' : '/admin'}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-3 text-xs font-medium
                                bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors
                                ${collapsed ? 'justify-center' : ''}
                            `}
                        >
                            {isAdminRoute ? <LayoutDashboard className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0" />}
                            {!collapsed && (isAdminRoute ? 'User Dashboard' : 'Admin Panel')}
                        </Link>
                    )}

                    {menuItems.map(item => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen?.(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-all duration-200
                                    ${collapsed ? 'justify-center' : ''}
                                    ${isActive
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                                `}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                                {!collapsed && item.label}
                                {isActive && !collapsed && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full
                            text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut className="w-[18px] h-[18px] shrink-0" />
                        {!collapsed && 'Logout'}
                    </button>
                </div>
            </aside>
        </>
    );
}
