import { Payment } from "@/lib/types";
import Modal from "../ui/Modal";
import TierBadge from "../ui/TierBadge";
import { Clock, Shield, XCircle, CheckCircle, ExternalLink, Hash, Calendar, FileText, User } from "lucide-react";

const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending', icon: Clock },
    approved: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Approved', icon: CheckCircle },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected', icon: XCircle },
};

interface PaymentDetailsModalProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean; // To show extra admin info if needed
}

export default function PaymentDetailsModal({ payment, isOpen, onClose, isAdmin = false }: PaymentDetailsModalProps) {
    if (!payment) return null;

    const status = statusConfig[payment.status] || {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        label: 'Pending',
        icon: Clock
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="lg">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6 text-white/50" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                {payment.tierRequested.toUpperCase()} Upgrade
                                <TierBadge tier={payment.tierRequested} size="sm" />
                            </h4>
                            <p className="text-sm text-white/40">Request ID: <span className="font-mono text-white/60">{payment.id.slice(0, 8)}</span></p>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${status.bg} ${status.border} ${status.color}`}>
                        <status.icon className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">{status.label}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Details */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-4">
                            <h5 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Transaction Info</h5>

                            <div className="space-y-1">
                                <label className="text-xs text-white/40 flex items-center gap-1.5"><Hash className="w-3 h-3" /> Transaction ID</label>
                                <div className="p-2 rounded bg-white/5 border border-white/5 font-mono text-sm text-blue-400 break-all select-all">
                                    {payment.transactionId}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-white/40 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Submitted</label>
                                    <p className="text-sm text-white font-medium">{new Date(payment.createdAt).toLocaleString()}</p>
                                </div>
                                {payment.reviewedAt && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-white/40 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Reviewed</label>
                                        <p className="text-sm text-white font-medium">{new Date(payment.reviewedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="space-y-1 pt-2 border-t border-white/5 mt-2">
                                    <label className="text-xs text-white/40 flex items-center gap-1.5"><User className="w-3 h-3" /> User Details</label>
                                    <p className="text-sm text-white font-medium">{payment.userName} <span className="text-white/30 text-xs">({payment.userEmail})</span></p>
                                    <p className="text-xs text-white/30 font-mono">ID: {payment.userId}</p>
                                </div>
                            )}
                        </div>

                        {payment.notes && (
                            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5">
                                <h5 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> User Notes
                                </h5>
                                <p className="text-sm text-white/70 italic">"{payment.notes}"</p>
                            </div>
                        )}

                        {payment.rejectionReason && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <XCircle className="w-3 h-3" /> Rejection Reason
                                </h5>
                                <p className="text-sm text-white/80">{payment.rejectionReason}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Screenshot */}
                    <div className="flex flex-col h-full">
                        <label className="text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Payment Proof</label>
                        {payment.screenshotUrl ? (
                            <div className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-black relative group min-h-[300px]">
                                <img
                                    src={payment.screenshotUrl}
                                    alt="Payment Screenshot"
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a
                                        href={payment.screenshotUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open Full Size
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center min-h-[200px]">
                                <p className="text-white/20 text-sm">No screenshot provided</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
