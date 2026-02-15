'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function AdminAnalyticsPage() {
    const { adminStats, allUsers, payments, courses, blogs, tools, fetchAdminStats, fetchAllUsers, fetchPayments, fetchCourses, fetchBlogs, fetchTools } = useStore();

    useEffect(() => {
        fetchAdminStats();
        fetchAllUsers();
        fetchPayments();
        fetchCourses();
        fetchBlogs();
        fetchTools();
    }, [fetchAdminStats, fetchAllUsers, fetchPayments, fetchCourses, fetchBlogs, fetchTools]);

    const tierDistribution = [
        { name: 'Free', value: allUsers.filter(u => u.tier === 'free').length, color: '#6b7280' },
        { name: 'Tier 1', value: allUsers.filter(u => u.tier === 'tier1').length, color: '#3b82f6' },
        { name: 'Tier 2', value: allUsers.filter(u => u.tier === 'tier2').length, color: '#a855f7' },
    ];

    const contentBreakdown = [
        { name: 'Courses', count: courses.length },
        { name: 'Tools', count: tools.length },
        { name: 'Blogs', count: blogs.length },
    ];

    const paymentStats = [
        { name: 'Pending', count: payments.filter(p => p.status === 'pending').length },
        { name: 'Approved', count: payments.filter(p => p.status === 'approved').length },
        { name: 'Rejected', count: payments.filter(p => p.status === 'rejected').length },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-white/40 text-sm mt-1">Platform insights and metrics</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: adminStats.totalUsers, change: '+12%', up: true },
                        { label: 'Conversion', value: `${adminStats.conversionRate}%`, change: '+5%', up: true },
                        { label: 'Content Items', value: courses.length + tools.length + blogs.length, change: '+3', up: true },
                        { label: 'Pending Payments', value: payments.filter(p => p.status === 'pending').length, change: 'Action needed', up: false },
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-xl bg-[#111113] border border-white/5"
                        >
                            <p className="text-xs text-white/30 uppercase tracking-wider">{metric.label}</p>
                            <p className="text-2xl font-bold text-white mt-2">{metric.value}</p>
                            <p className={`text-xs mt-1 ${metric.up ? 'text-green-400' : 'text-yellow-400'}`}>
                                {metric.change}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-xl bg-[#111113] border border-white/5"
                    >
                        <h3 className="text-white font-semibold mb-6">User Growth</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={adminStats.userGrowth}>
                                    <defs>
                                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                                    <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} fill="url(#colorGrowth)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Tier Distribution Pie */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-xl bg-[#111113] border border-white/5"
                    >
                        <h3 className="text-white font-semibold mb-6">Tier Distribution</h3>
                        <div className="h-56 flex items-center">
                            <ResponsiveContainer width="60%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tierDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {tierDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {tierDistribution.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs text-white/50">{item.name}</span>
                                        <span className="text-xs text-white/70 font-bold ml-auto">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
