import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { getTierLabel } from '@/lib/tierSystem';
import PaymentDetailsModal from '@/components/payment/PaymentDetailsModal';
import { Payment } from '@/lib/types';
import { ShieldCheck, Clock, CheckCircle, XCircle, Send, CreditCard, Eye, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

function getRelativeTime(dateStr: string): string {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
}

export default function MyAccessPage() {
    const { user, payments, fetchPayments, isInitialized, isAuthenticated } = useStore();
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchPayments();
        }
    }, [isInitialized, isAuthenticated, fetchPayments]);

    const userPayments = payments
        .filter(p => p.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white">My Access</h1>
                    <p className="text-white/35 text-sm mt-1">Your subscription and payment history</p>
                </motion.div>

                {/* Current Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl -mr-8 -mt-8" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/10 border border-purple-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-7 h-7 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">Current Plan</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xl font-bold text-white">{getTierLabel(user?.tier || 'free')}</span>
                                    <TierBadge tier={user?.tier || 'free'} />
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/upgrade"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm flex items-center gap-2 group"
                        >
                            <Zap className="w-4 h-4" />
                            Upgrade Plan
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </Link>
                    </div>

                    {/* Telegram Access */}
                    <div className="relative mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Send className="w-4 h-4 text-white/25" />
                            <div>
                                <span className="text-sm text-white/50">Telegram Access</span>
                                {user?.telegramUsername && (
                                    <p className="text-xs text-white/20 mt-0.5">@{user.telegramUsername.replace('@', '')}</p>
                                )}
                            </div>
                        </div>
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${user?.telegramAccess
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-white/[0.03] text-white/25 border border-white/[0.06]'
                            }`}>
                            {user?.telegramAccess ? '✓ Active' : 'Inactive'}
                        </span>
                    </div>
                </motion.div>

                {/* Payment History */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-400" />
                            <h2 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Payment History</h2>
                        </div>
                        {userPayments.length > 0 && (
                            <span className="text-[10px] text-white/20 font-medium">{userPayments.length} transaction{userPayments.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {userPayments.length === 0 ? (
                        <div className="p-16 bg-white/[0.02] border border-dashed border-white/[0.06] rounded-2xl text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="w-7 h-7 text-white/[0.06]" />
                            </div>
                            <p className="text-white/15 text-sm font-medium">No payments yet</p>
                            <p className="text-white/10 text-xs mt-1">Your payment history will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userPayments.map((payment, index) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer"
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Status Icon */}
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${payment.status === 'approved'
                                                ? 'bg-green-500/10 border border-green-500/10'
                                                : payment.status === 'rejected'
                                                    ? 'bg-red-500/10 border border-red-500/10'
                                                    : 'bg-yellow-500/10 border border-yellow-500/10'
                                                }`}>
                                                {payment.status === 'approved'
                                                    ? <CheckCircle className="w-5 h-5 text-green-400" />
                                                    : payment.status === 'rejected'
                                                        ? <XCircle className="w-5 h-5 text-red-400" />
                                                        : <Clock className="w-5 h-5 text-yellow-400" />}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white">
                                                        {getTierLabel(payment.tierRequested)} Upgrade
                                                    </span>
                                                    <TierBadge tier={payment.tierRequested} size="sm" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-white/30">{formatDate(payment.createdAt)}</span>
                                                    <span className="text-white/10">·</span>
                                                    <span className="text-xs text-white/20">{formatTime(payment.createdAt)}</span>
                                                    <span className="text-white/10">·</span>
                                                    <span className="text-[10px] text-white/15 font-mono">TX: {payment.transactionId.slice(0, 12)}...</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${payment.status === 'approved'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/15'
                                                    : payment.status === 'rejected'
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                                <p className="text-[10px] text-white/15 mt-1">{getRelativeTime(payment.createdAt)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedPayment(payment); }}
                                                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-500/10 text-white/30 hover:text-purple-400 transition-all group-hover:bg-purple-500/10 group-hover:text-purple-400"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <PaymentDetailsModal
                payment={selectedPayment}
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
            />
        </DashboardLayout>
    );
}
