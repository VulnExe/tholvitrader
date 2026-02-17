import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { getTierLabel } from '@/lib/tierSystem';
import PaymentDetailsModal from '@/components/payment/PaymentDetailsModal';
import { Payment } from '@/lib/types';
import { ShieldCheck, Clock, CheckCircle, XCircle, Send, CreditCard, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MyAccessPage() {
    const { user, payments, fetchPayments, isInitialized, isAuthenticated } = useStore();
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchPayments();
        }
    }, [isInitialized, isAuthenticated, fetchPayments]);

    const userPayments = payments.filter(p => p.userId === user?.id);

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white">My Access</h1>
                    <p className="text-white/40 text-sm mt-1">Manage your subscription and payment history</p>
                </motion.div>

                {/* Current Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-7 h-7 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Current Plan</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xl font-bold text-white">{getTierLabel(user?.tier || 'free')}</span>
                                    <TierBadge tier={user?.tier || 'free'} />
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/upgrade"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all text-sm"
                        >
                            Upgrade Plan
                        </Link>
                    </div>

                    {/* Telegram Access */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Send className="w-4 h-4 text-white/30" />
                            <span className="text-sm text-white/50">Telegram Access</span>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${user?.telegramAccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                            {user?.telegramAccess ? 'Active' : 'Inactive'}
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
                    <div className="flex items-center gap-3 px-1">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Payment History</h2>
                    </div>

                    {userPayments.length === 0 ? (
                        <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
                            <CreditCard className="w-10 h-10 text-white/5 mx-auto mb-3" />
                            <p className="text-white/20 text-sm">No payment history</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userPayments.map(payment => (
                                <div
                                    key={payment.id}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment.status === 'approved' ? 'bg-green-500/10' : payment.status === 'rejected' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                                            {payment.status === 'approved' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                                                payment.status === 'rejected' ? <XCircle className="w-5 h-5 text-red-400" /> :
                                                    <Clock className="w-5 h-5 text-yellow-400" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">
                                                    {payment.tierRequested.toUpperCase()} Upgrade
                                                </span>
                                                <TierBadge tier={payment.tierRequested} size="sm" />
                                            </div>
                                            <p className="text-[11px] text-white/30 mt-0.5">
                                                {new Date(payment.createdAt).toLocaleDateString()} · TX: {payment.transactionId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${payment.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : payment.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                            {payment.status}
                                        </span>
                                        <button
                                            onClick={() => setSelectedPayment(payment)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
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
