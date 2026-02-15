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
} from 'lucide-react';
import TierBadge from '../ui/TierBadge';
import { useState } from 'react';

export default function Sidebar() {
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
    ];

    const menuItems = isAdminRoute ? adminMenuItems : userMenuItems;

    return (
        <aside
            className={`
        h-screen sticky top-0 z-40
        bg-[#0a0a0c] border-r border-white/5
        flex flex-col transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
        >
            {/* Logo Area */}
            <div className="px-5 h-16 flex items-center justify-between border-b border-white/5">
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">
                            Tholvi<span className="text-purple-400">Trader</span>
                        </span>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`
            w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center
            text-white/30 hover:text-white/60 transition-all
            ${collapsed ? 'rotate-180 mx-auto mt-2' : ''}
          `}
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>
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
    );
}
