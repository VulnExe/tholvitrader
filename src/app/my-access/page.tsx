'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyAccessPage() {
    const { user, payments } = useStore();

    if (!user) return null;

    const userPayments = payments.filter(p => p.userId === user.id);

    const statusConfig = {
        pending: { icon: AlertCircle, label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        approved: { icon: CheckCircle, label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">My Access</h1>
                    <p className="text-white/40 text-sm mt-1">View your current plan and payment history</p>
                </div>

                {/* Current Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-[#111113] border border-white/5 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/30 uppercase tracking-wider">Current Plan</p>
                            <div className="flex items-center gap-3 mt-1">
                                <TierBadge tier={user.tier} size="lg" />
                                <span className="text-white/40 text-sm">
                                    {user.tier === 'free' ? 'Limited access' : user.tier === 'tier1' ? 'Pro access' : 'Full access'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Telegram Access */}
                    <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60">Telegram Channel Access</p>
                            <p className="text-xs text-white/30 mt-0.5">
                                {user.telegramAccess ? 'You have access to the Telegram community' : 'Upgrade to get Telegram channel access'}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.telegramAccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                            {user.telegramAccess ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </motion.div>

                {/* Payment History */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>

                    {userPayments.length === 0 ? (
                        <div className="p-8 rounded-xl bg-[#111113] border border-white/5 text-center">
                            <Clock className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No payment history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userPayments.map((payment, i) => {
                                const status = statusConfig[payment.status];
                                return (
                                    <motion.div
                                        key={payment.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-xl bg-[#111113] border border-white/5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <TierBadge tier={payment.tierRequested} size="sm" />
                                                <div>
                                                    <p className="text-sm text-white/60">
                                                        TX: <code className="text-xs text-white/40">{payment.transactionId}</code>
                                                    </p>
                                                    <p className="text-xs text-white/20 mt-0.5">
                                                        {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </div>

                                        {payment.status === 'rejected' && payment.rejectionReason && (
                                            <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                                <p className="text-xs text-red-400">
                                                    <strong>Reason:</strong> {payment.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
