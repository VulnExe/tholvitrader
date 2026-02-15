'use client';

import { useStore } from '@/lib/store';
import { Bell, Search } from 'lucide-react';
import TierBadge from '../ui/TierBadge';
import { useState } from 'react';

export default function Topbar() {
    const { user, notifications, markNotificationRead } = useStore();
    const [showNotifs, setShowNotifs] = useState(false);
    const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

    return (
        <header className="h-16 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search courses, blogs..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Tier Badge */}
                {user && <TierBadge tier={user.tier} size="md" />}

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="absolute right-0 top-12 w-80 bg-[#111113] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5">
                                <h4 className="text-sm font-semibold text-white">Notifications</h4>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications
                                    .filter(n => n.userId === user?.id)
                                    .map(n => (
                                        <button
                                            key={n.id}
                                            onClick={() => {
                                                markNotificationRead(n.id);
                                            }}
                                            className={`w-full text-left px-4 py-3 border-b border-white/[0.03] hover:bg-white/5 transition-colors ${!n.read ? 'bg-purple-500/5' : ''}`}
                                        >
                                            <p className="text-sm text-white font-medium">{n.title}</p>
                                            <p className="text-xs text-white/40 mt-0.5">{n.message}</p>
                                        </button>
                                    ))}
                                {notifications.filter(n => n.userId === user?.id).length === 0 && (
                                    <div className="px-4 py-8 text-center text-white/20 text-sm">
                                        No notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                {user && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:border-purple-500/50 transition-colors">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </header>
    );
}
