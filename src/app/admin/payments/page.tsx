'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    ExternalLink,
    Search,
    Filter,
    MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentStatus } from '@/lib/types';

export default function AdminPaymentsPage() {
    const { payments, reviewPayment, fetchPayments } = useStore();
    const [filter, setFilter] = useState<PaymentStatus | 'all'>('pending');
    const [search, setSearch] = useState('');

    // Rejection Modal State
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const filteredPayments = payments.filter(p => {
        const matchesFilter = filter === 'all' || p.status === filter;
        const matchesSearch = p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
            (p.userName || '').toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleApprove = async (id: string) => {
        if (confirm('Approve this payment and upgrade user tier?')) {
            await reviewPayment(id, 'approved');
        }
    };

    const openRejectModal = (id: string) => {
        setSelectedPaymentId(id);
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (selectedPaymentId && rejectionReason) {
            await reviewPayment(selectedPaymentId, 'rejected', rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedPaymentId(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Payment Review</h1>
                    <p className="text-white/40 text-sm mt-1">Verify manual transactions and approve access</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search by transaction ID or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                  px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                  ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}
                `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-white/30">
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Requested Tier</th>
                                    <th className="px-6 py-4 font-semibold">Transaction ID</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-white/20 italic text-sm">
                                            No payments found matching the criteria
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment, i) => (
                                        <motion.tr
                                            key={payment.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group hover:bg-white/[0.01] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-white">{payment.userName || 'Anonymous'}</p>
                                                <p className="text-xs text-white/30">{payment.userEmail}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <TierBadge tier={payment.tierRequested} size="sm" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs text-blue-400 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/10">
                                                    {payment.transactionId}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-white/40">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                          text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border
                          ${payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                          ${payment.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                          ${payment.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                        `}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payment.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApprove(payment.id)}
                                                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(payment.id)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : payment.screenshotUrl ? (
                                                    <a
                                                        href={payment.screenshotUrl}
                                                        target="_blank"
                                                        className="text-white/20 hover:text-white transition-colors flex items-center justify-end gap-1.5 text-xs"
                                                    >
                                                        Screenshot <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-white/10 text-[10px]">No Actions</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Payment"
            >
                <div className="space-y-4">
                    <p className="text-sm text-white/40">Please provide a reason for rejecting this payment. This will be visible to the user.</p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Transaction ID not found, Invalid screenshot..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="flex-1 py-2 rounded-lg text-sm text-white/40 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={!rejectionReason}
                            className="flex-1 py-2 bg-red-500 rounded-lg text-sm text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            Reject Payment
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
