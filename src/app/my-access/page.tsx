'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle, Send, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function MyAccessPage() {
    const { user, payments, fetchPayments, siteSettings, fetchSiteSettings } = useStore();

    useEffect(() => {
        fetchPayments();
        fetchSiteSettings();
    }, [fetchPayments, fetchSiteSettings]);

    if (!user) return null;

    const userPayments = payments.filter(p => p.userId === user.id);

    const statusConfig = {
        pending: { icon: AlertCircle, label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        approved: { icon: CheckCircle, label: 'Verified', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Access Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-white">Access & Subscriptions</h1>
                        <p className="text-white/40 text-sm mt-1">Manage your membership and view transaction history</p>
                    </div>

                    {/* Current Plan Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-2xl bg-gradient-to-br from-[#111113] to-black border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">Active Membership</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <h3 className="text-2xl font-bold text-white capitalize">{user.tier} Plan</h3>
                                        <TierBadge tier={user.tier} size="md" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Telegram Status */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border transition-all ${user.telegramAccess ? 'bg-green-500/5 border-green-500/10' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <Send className={`w-4 h-4 ${user.telegramAccess ? 'text-green-400' : 'text-white/20'}`} />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Premium Channel</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                    {user.telegramAccess ? 'Access to live signals and insights.' : 'Gain access by upgrading to Tier 1 or Tier 2.'}
                                </p>
                                {user.telegramAccess ? (
                                    <a
                                        href={siteSettings.telegramChannelLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2 bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all"
                                    >
                                        Join Channel <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <button disabled className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-white/20 text-xs font-bold">Locked</button>
                                )}
                            </div>

                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageSquare className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Support Bot</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                    Direct communication with TholviTrader analysts for tier 2 members.
                                </p>
                                <a
                                    href={siteSettings.telegramBotLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-500/30 transition-all"
                                >
                                    Message Admin <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment History */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-white/20" />
                            Transaction History
                        </h2>

                        {userPayments.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                <p className="text-white/20 text-sm">No transactions found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {userPayments.map((payment, i) => {
                                    const status = statusConfig[payment.status];
                                    return (
                                        <motion.div
                                            key={payment.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 rounded-xl bg-[#111113] border border-white/5 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-white/10" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-white">{payment.tierRequested.toUpperCase()} Upgrade</span>
                                                        <TierBadge tier={payment.tierRequested} size="sm" />
                                                    </div>
                                                    <p className="text-[10px] text-white/30 font-mono mt-0.5">Hash: {payment.transactionId.slice(0, 16)}...</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
                                                    <status.icon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                                <p className="text-[10px] text-white/20 mt-1 font-medium italic">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Security info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2">Secure Membership</h3>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Every payment is processed with end-to-end verification. If you have any issues with your access, please contact our support bot with your Transaction Hash.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Next Step</h3>
                        <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                            Check out the latest insights in our blog or start your next lesson in the courses section.
                        </p>
                        <button
                            onClick={() => window.location.href = '/courses'}
                            className="text-xs font-bold text-purple-400 flex items-center gap-2 hover:text-purple-300 transition-all"
                        >
                            Open Courses <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
