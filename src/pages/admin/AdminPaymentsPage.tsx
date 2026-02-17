import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import PaymentDetailsModal from '@/components/payment/PaymentDetailsModal';
import Pagination from '@/components/ui/Pagination';
import { Payment, PaymentStatus } from '@/lib/types';
import { CreditCard, CheckCircle, XCircle, Clock, Eye, Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminPaymentsPage() {
    const { payments, paymentsTotal, fetchPayments: fetchAllPayments, approvePayment, rejectPayment, isInitialized, isAuthenticated } = useStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isInitialized && isAuthenticated) {
                loadPayments();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter, page, isInitialized, isAuthenticated]);

    const loadPayments = async () => {
        setIsLoading(true);
        await fetchAllPayments(page, limit, search, statusFilter);
        setIsLoading(false);
    };

    const handleApprove = async (p: Payment) => {
        if (!confirm('Approve this payment?')) return;
        setActionLoading(p.id);
        const result = await approvePayment(p.id);
        if (result.success) {
            toast.success('Payment approved');
            loadPayments();
        } else {
            toast.error(result.error || 'Failed to approve');
        }
        setActionLoading(null);
    };

    const handleReject = async (p: Payment) => {
        if (!confirm('Reject this payment?')) return;
        setActionLoading(p.id);
        const result = await rejectPayment(p.id);
        if (result.success) {
            toast.success('Payment rejected');
            loadPayments();
        } else {
            toast.error(result.error || 'Failed to reject');
        }
        setActionLoading(null);
    };

    const totalPages = Math.ceil(paymentsTotal / limit);

    return (
        <DashboardLayout>
            <div className="max-w-6xl space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-purple-400" />
                            Manage Payments
                        </h1>
                        <p className="text-white/40 text-sm mt-1">{paymentsTotal} transactions found</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search Transaction ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 overflow-x-auto">
                            {['all', 'pending', 'approved', 'rejected'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setStatusFilter(t); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${statusFilter === t ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Transaction</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-white/20">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading payments...
                                        </td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-white/20">
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map(payment => (
                                        <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${payment.status === 'approved' ? 'bg-green-500/10' : payment.status === 'rejected' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                                                        {payment.status === 'approved' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                                                            payment.status === 'rejected' ? <XCircle className="w-4 h-4 text-red-400" /> :
                                                                <Clock className="w-4 h-4 text-yellow-400" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-xs text-white uppercase">{payment.transactionId}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <TierBadge tier={payment.tierRequested} size="sm" />
                                                            <span className="text-[10px] text-white/40">Upgrade</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-sm text-white">{payment.userName || 'Unknown'}</p>
                                                    <p className="text-xs text-white/40">{payment.userEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${payment.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : payment.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-white/40 font-mono">
                                                    {format(new Date(payment.createdAt), 'MMM d, HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {payment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(payment)}
                                                                disabled={!!actionLoading}
                                                                className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-all disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                {actionLoading === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(payment)}
                                                                disabled={!!actionLoading}
                                                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
                                                                title="Reject"
                                                            >
                                                                {actionLoading === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedPayment(payment)}
                                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>

            <PaymentDetailsModal
                payment={selectedPayment}
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                isAdmin
            />
        </DashboardLayout>
    );
}
