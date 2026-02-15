'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import PaymentDetailsModal from '@/components/payment/PaymentDetailsModal';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle, Send, ExternalLink, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Payment } from '@/lib/types';

export default function MyAccessPage() {
    const { user, payments, fetchPayments, siteSettings, fetchSiteSettings, isInitialized, isAuthenticated } = useStore();

    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!isInitialized || !isAuthenticated) return;

            setLoading(true);
            await Promise.all([
                fetchPayments(),
                fetchSiteSettings()
            ]);
            setLoading(false);
        };
        load();
    }, [fetchPayments, fetchSiteSettings, isInitialized, isAuthenticated]);

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
                            <div className={`p-5 rounded-2xl border transition-all ${user.telegramAccess && user.tier !== 'free' ? 'bg-green-500/5 border-green-500/10' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.telegramAccess && user.tier !== 'free' ? 'bg-green-500/20' : 'bg-white/5'}`}>
                                        <Send className={`w-4 h-4 ${user.telegramAccess && user.tier !== 'free' ? 'text-green-400' : 'text-white/20'}`} />
                                    </div>
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Premium Group</span>
                                </div>

                                <p className="text-[11px] text-white/40 leading-relaxed mb-6 font-medium">
                                    {user.tier === 'free'
                                        ? 'Exclusive for Tier 1 & Tier 2. This private group includes live trading signals and market analysis.'
                                        : user.telegramAccess
                                            ? 'Your access is verified. You should have been added to the private group manually by an admin.'
                                            : 'Payment verified! Admin will add you manually after verifying your @username in Settings.'}
                                </p>

                                <div className={`px-4 py-2.5 rounded-xl border flex items-center justify-between ${user.telegramAccess && user.tier !== 'free' ? 'bg-green-400/10 border-green-400/20' : 'bg-white/5 border-white/5'}`}>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.telegramAccess && user.tier !== 'free' ? 'text-green-400' : 'text-white/20'}`}>
                                        {user.tier === 'free' ? 'LOCKED' : user.telegramAccess ? 'ACTIVE' : 'PENDING'}
                                    </span>
                                </div>

                                {user.tier === 'free' && (
                                    <button
                                        onClick={() => window.location.href = '/upgrade'}
                                        className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Upgrade to Unlock →
                                    </button>
                                )}

                                {!user.telegramUsername && !user.telegramAccess && user.tier !== 'free' && (
                                    <button
                                        onClick={() => window.location.href = '/settings'}
                                        className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Set Username in Settings →
                                    </button>
                                )}
                            </div>

                            <div className={`p-5 rounded-2xl border transition-all ${user.tier === 'tier2' ? 'bg-purple-500/5 border-purple-500/10' : 'bg-white/5 border-white/5 opacity-60'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.tier === 'tier2' ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                                        <MessageSquare className={`w-4 h-4 ${user.tier === 'tier2' ? 'text-purple-400' : 'text-white/20'}`} />
                                    </div>
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Support Bot</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed mb-6 font-medium">
                                    Direct communication with TholviTrader analysts for Tier 2 Elite members.
                                </p>
                                {user.tier === 'tier2' ? (
                                    <a
                                        href={siteSettings.telegramBotLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2 bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-500/30 transition-all"
                                    >
                                        Message Admin <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/upgrade'}
                                        className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-white/20 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Upgrade to Tier 2
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment History */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-white/20" />
                            Transaction History
                        </h2>

                        {loading ? (
                            <div className="p-12 text-center border border-white/5 rounded-2xl bg-[#111113]">
                                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-white/30 text-xs">Loading history...</p>
                            </div>
                        ) : userPayments.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                <p className="text-white/20 text-sm">No transactions found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {userPayments.map((payment, i) => {
                                    const status = statusConfig[payment.status as keyof typeof statusConfig];
                                    return (
                                        <motion.div
                                            key={payment.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 rounded-xl bg-[#111113] border border-white/5 group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-1">
                                                        <Shield className="w-5 h-5 text-white/10" />
                                                    </div>
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-bold text-white whitespace-nowrap">{payment.tierRequested.toUpperCase()} Upgrade</span>
                                                            <TierBadge tier={payment.tierRequested} size="sm" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">TxID:</span>
                                                            <code className="text-[11px] text-blue-400 font-mono bg-blue-400/5 px-1.5 py-0.5 rounded border border-blue-400/10 truncate select-all">
                                                                {payment.transactionId}
                                                            </code>
                                                        </div>
                                                        {payment.notes && (
                                                            <p className="text-[11px] text-white/30 italic truncate max-w-md">"{payment.notes}"</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 sm:gap-6 pl-14 sm:pl-0">
                                                    {/* Screenshot Thumbnail for User */}
                                                    {payment.screenshotUrl && (
                                                        <a
                                                            href={payment.screenshotUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex flex-col items-center gap-1 group/proof"
                                                            title="View Payment Proof"
                                                        >
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 group-hover/proof:border-purple-500/50 transition-colors relative">
                                                                <img
                                                                    src={payment.screenshotUrl}
                                                                    alt="Proof"
                                                                    className="w-full h-full object-cover group-hover/proof:scale-110 transition-transform"
                                                                />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/proof:opacity-100 flex items-center justify-center transition-opacity">
                                                                    <ExternalLink className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-white/20 group-hover/proof:text-purple-400 transition-colors">View Proof</span>
                                                        </a>
                                                    )}

                                                    <div className="flex flex-col items-end gap-1 min-w-[80px]">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setSelectedPayment(payment)}
                                                                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                                                                title="View Full Details"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${status.bg} ${status.color} border ${status.border}`}>
                                                                <status.icon className="w-3 h-3" />
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-white/20 font-medium italic">
                                                            {new Date(payment.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
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
