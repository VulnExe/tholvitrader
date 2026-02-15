'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import {
    Users as UsersIcon,
    CreditCard,
    TrendingUp,
    Clock,
    ArrowRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminDashboard() {
    const { adminStats, payments, fetchAdminStats, fetchPayments } = useStore();

    useEffect(() => {
        fetchAdminStats();
        fetchPayments();
    }, [fetchAdminStats, fetchPayments]);

    const pendingPayments = payments.filter(p => p.status === 'pending');

    const stats = [
        { label: 'Total Users', value: adminStats.totalUsers, icon: UsersIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Pending Payments', value: pendingPayments.length, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Conversion Rate', value: `${adminStats.conversionRate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Tier 2 Users', value: adminStats.tier2Users, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1">Platform overview and management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 rounded-2xl bg-[#111113] border border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <span className="text-sm font-medium text-white/40">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-2xl bg-[#111113] border border-white/5">
                            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                User Growth
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={adminStats.userGrowth}>
                                        <defs>
                                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="rgba(255,255,255,0.1)"
                                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.1)"
                                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#a855f7"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorGrowth)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Pending Column */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-[#111113] border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold">Pending Review</h3>
                                <Link href="/admin/payments" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                    View All
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {pendingPayments.length === 0 ? (
                                    <p className="text-center py-4 text-sm text-white/20 italic">No pending payments</p>
                                ) : (
                                    pendingPayments.slice(0, 5).map((payment, i) => (
                                        <div key={payment.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-white">{payment.userName || 'Anonymous'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="w-3 h-3 text-white/30" />
                                                    <span className="text-[10px] text-white/30">{new Date(payment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <TierBadge tier={payment.tierRequested} size="sm" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
