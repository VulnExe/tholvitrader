'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { useState, useEffect } from 'react';
import {
    Search,
    MoreVertical,
    Ban,
    CheckCircle2,
    MessageCircle,
    ShieldCheck,
    ShieldOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserTier } from '@/lib/types';

export default function AdminUsersPage() {
    const { allUsers, fetchAllUsers, updateUserTier, setTelegramAccess, banUser, unbanUser } = useStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const filteredUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-white/40 text-sm mt-1">Manage user tiers, access levels, and moderation</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                {/* Users Table */}
                <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-white/30">
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Tier</th>
                                    <th className="px-6 py-4 font-semibold">Telegram</th>
                                    <th className="px-6 py-4 font-semibold text-center">Banned</th>
                                    <th className="px-6 py-4 font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredUsers.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-white/[0.01] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center text-xs font-bold text-white/60">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${user.banned ? 'text-white/20 line-through' : 'text-white'}`}>{user.name}</p>
                                                    <p className="text-xs text-white/30">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.tier}
                                                onChange={(e) => updateUserTier(user.id, e.target.value as UserTier)}
                                                className="bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                                            >
                                                <option value="free">Free</option>
                                                <option value="tier1">Tier 1</option>
                                                <option value="tier2">Tier 2</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => setTelegramAccess(user.id, !user.telegramAccess)}
                                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-all ${user.telegramAccess ? 'text-green-400' : 'text-white/20'}`}
                                                >
                                                    {user.telegramAccess ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                                                    {user.telegramAccess ? 'Access' : 'No Access'}
                                                </button>
                                                {user.telegramUsername && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-purple-400/60 font-mono bg-purple-500/5 px-2 py-0.5 rounded-md w-fit border border-purple-500/10">
                                                        <MessageCircle className="w-3 h-3" />
                                                        {user.telegramUsername}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`w-2 h-2 rounded-full mx-auto ${user.banned ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500/20'}`} />
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white/30">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => user.banned ? unbanUser(user.id) : banUser(user.id)}
                                                className={`p-2 rounded-lg transition-all ${user.banned ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                                                title={user.banned ? 'Unban User' : 'Ban User'}
                                            >
                                                {user.banned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
