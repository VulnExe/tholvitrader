import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import { Users, CreditCard, BookOpen, FileText, Wrench, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { adminStats, fetchAdminStats, courses, tools, fetchCourses, fetchTools, isInitialized, isAuthenticated } = useStore();

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchAdminStats();
            fetchCourses();
            fetchTools();
        }
    }, [isInitialized, isAuthenticated]);

    const stats = [
        { label: 'Total Users', value: adminStats.totalUsers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Pending Payments', value: adminStats.pendingPayments, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Total Revenue', value: `$${adminStats.totalRevenue}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Courses & Tools', value: courses.length + tools.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    const chartData = [
        { name: 'Free', count: adminStats.freeUsers },
        { name: 'Tier 1', count: adminStats.tier1Users },
        { name: 'Tier 2', count: adminStats.tier2Users },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1">Platform overview and management</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-white/30 font-medium uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-lg font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                    >
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            User Distribution
                        </h3>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#a855f7" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                    >
                        {[
                            { label: 'Manage Users', desc: `${adminStats.totalUsers} registered users`, icon: Users, href: '/admin/users' },
                            { label: 'Review Payments', desc: `${adminStats.pendingPayments} pending`, icon: CreditCard, href: '/admin/payments' },
                            { label: 'Manage Courses & Tools', desc: `${courses.length + tools.length} items`, icon: BookOpen, href: '/admin/content' },
                            { label: 'Site Settings', desc: 'Binance, Telegram config', icon: TrendingUp, href: '/admin/settings' },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={item.href}
                                className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/[0.08] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                                    <item.icon className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{item.label}</p>
                                    <p className="text-[11px] text-white/30">{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
