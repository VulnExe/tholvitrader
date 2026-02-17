import { Payment } from "@/lib/types";
import Modal from "../ui/Modal";
import TierBadge from "../ui/TierBadge";
import { getTierLabel } from "@/lib/tierSystem";
import { Clock, Shield, XCircle, CheckCircle, ExternalLink, Hash, Calendar, FileText, User, Copy, Download } from "lucide-react";
import toast from "react-hot-toast";

const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending Review', icon: Clock, desc: 'Your payment is being reviewed by our team.' },
    approved: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Approved', icon: CheckCircle, desc: 'Your payment has been approved successfully.' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected', icon: XCircle, desc: 'Your payment was not approved.' },
};

interface PaymentDetailsModalProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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

function formatDateShort(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function getTimeDifference(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
        return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins}m`;
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
}

export default function PaymentDetailsModal({ payment, isOpen, onClose, isAdmin = false }: PaymentDetailsModalProps) {
    if (!payment) return null;

    const status = statusConfig[payment.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
            <div className="space-y-6">
                {/* Status Banner */}
                <div className={`p-5 rounded-2xl ${status.bg} border ${status.border} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{
                        background: payment.status === 'approved' ? '#22c55e' : payment.status === 'rejected' ? '#ef4444' : '#eab308'
                    }} />
                    <div className="relative flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${status.bg} border ${status.border}`}>
                            <StatusIcon className={`w-7 h-7 ${status.color}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold ${status.color}`}>{status.label}</h3>
                            <p className="text-sm text-white/40 mt-0.5">{status.desc}</p>
                        </div>
                        <TierBadge tier={payment.tierRequested} size="lg" />
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left: Details */}
                    <div className="space-y-4">
                        {/* Tier Info */}
                        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                Upgrade Details
                            </h4>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-white">{getTierLabel(payment.tierRequested)} Plan</p>
                                    <p className="text-xs text-white/30 mt-0.5">Request ID: <span className="font-mono text-white/50">{payment.id.slice(0, 8)}...</span></p>
                                </div>
                                <TierBadge tier={payment.tierRequested} />
                            </div>
                        </div>

                        {/* Transaction Info */}
                        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-4">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                                <Hash className="w-3 h-3" />
                                Transaction Details
                            </h4>

                            <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1.5">Transaction ID</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 rounded-lg bg-[#0a0a0c] border border-white/[0.04] font-mono text-sm text-blue-400 break-all select-all">
                                        {payment.transactionId}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(payment.transactionId)}
                                        className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/30 hover:text-white transition-all shrink-0"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-4">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Timeline
                            </h4>

                            <div className="space-y-3">
                                {/* Submitted */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">Submitted</p>
                                        <p className="text-sm text-white/50">{formatDate(payment.createdAt)}</p>
                                        <p className="text-xs text-white/25">{formatTime(payment.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Connector line */}
                                <div className="ml-[15px] w-px h-3 bg-white/[0.06]" />

                                {/* Reviewed */}
                                {payment.reviewedAt ? (
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${payment.status === 'approved' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            {payment.status === 'approved'
                                                ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                                : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-white">Reviewed</p>
                                            <p className="text-sm text-white/50">{formatDate(payment.reviewedAt)}</p>
                                            <p className="text-xs text-white/25">{formatTime(payment.reviewedAt)} · {getTimeDifference(payment.createdAt, payment.reviewedAt)} after submission</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Clock className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-white/50">Awaiting Review</p>
                                            <p className="text-xs text-white/25">Usually reviewed within 1-24 hours</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin: User Info */}
                        {isAdmin && (
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    User Information
                                </h4>
                                <div>
                                    <p className="text-white font-semibold">{payment.userName}</p>
                                    <p className="text-sm text-white/40">{payment.userEmail}</p>
                                    <p className="text-xs text-white/20 font-mono mt-1">UID: {payment.userId}</p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {payment.notes && (
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    User Notes
                                </h4>
                                <p className="text-sm text-white/60 italic leading-relaxed">&ldquo;{payment.notes}&rdquo;</p>
                            </div>
                        )}

                        {/* Rejection Reason */}
                        {payment.rejectionReason && (
                            <div className="p-5 rounded-xl bg-red-500/[0.06] border border-red-500/15">
                                <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                    <XCircle className="w-3 h-3" />
                                    Rejection Reason
                                </h4>
                                <p className="text-sm text-white/70 leading-relaxed">{payment.rejectionReason}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Screenshot */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            Payment Proof
                        </h4>

                        {payment.screenshotUrl ? (
                            <div className="space-y-3">
                                <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-black relative group">
                                    <img
                                        src={payment.screenshotUrl}
                                        alt="Payment Screenshot"
                                        className="w-full object-contain max-h-[500px]"
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <a
                                            href={payment.screenshotUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2.5 bg-white text-black rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Full Size
                                        </a>
                                        <a
                                            href={payment.screenshotUrl}
                                            download
                                            className="px-4 py-2.5 bg-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                {/* Quick action buttons below */}
                                <div className="flex gap-2">
                                    <a
                                        href={payment.screenshotUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white/50 font-medium flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all text-xs"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Open Full Size
                                    </a>
                                    <a
                                        href={payment.screenshotUrl}
                                        download
                                        className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white/50 font-medium flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all text-xs"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-white/[0.06] flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
                                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
                                    <FileText className="w-6 h-6 text-white/10" />
                                </div>
                                <p className="text-white/15 text-sm font-medium">No screenshot provided</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
