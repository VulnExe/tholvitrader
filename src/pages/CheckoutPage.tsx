import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA } from '@/lib/tierSystem';
import FileUpload from '@/components/ui/FileUpload';
import TierBadge from '@/components/ui/TierBadge';
import { UserTier } from '@/lib/types';
import { ArrowLeft, Loader2, CheckCircle, Copy, QrCode, MessageCircle, AlertCircle, Download, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { tier } = useParams<{ tier: string }>();
    const navigate = useNavigate();
    const { user, submitPayment, siteSettings, fetchSiteSettings, isInitialized, isAuthenticated } = useStore();
    const [transactionId, setTransactionId] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [copiedId, setCopiedId] = useState(false);
    const [qrZoomed, setQrZoomed] = useState(false);

    const tierData = TIER_DATA[tier as keyof typeof TIER_DATA];

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchSiteSettings();
        }
    }, [isInitialized, isAuthenticated, fetchSiteSettings]);

    if (!tierData || tier === 'free') {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <p className="text-white/40">Invalid tier selected</p>
                    <button onClick={() => navigate('/upgrade')} className="mt-4 text-purple-400 hover:text-purple-300">
                        Back to Upgrade
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const copyBinanceId = () => {
        navigator.clipboard.writeText(siteSettings.binanceId);
        setCopiedId(true);
        toast.success('Binance ID copied!');
        setTimeout(() => setCopiedId(false), 2000);
    };

    const downloadQrCode = async () => {
        if (!siteSettings.binanceQrUrl) return;
        try {
            const response = await fetch(siteSettings.binanceQrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tholvitrader-payment-qr-${tier}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('QR code downloaded!');
        } catch {
            // Fallback: open in new tab
            window.open(siteSettings.binanceQrUrl, '_blank');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!transactionId) {
            toast.error('Please enter your transaction ID');
            return;
        }
        if (!screenshotUrl) {
            toast.error('Please upload payment proof');
            return;
        }

        setSubmitting(true);
        const result = await submitPayment(tier as UserTier, transactionId, screenshotUrl, notes);
        if (result.success) {
            setSubmitted(true);
        } else {
            toast.error(result.error || 'Failed to submit');
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <DashboardLayout>
                <div className="max-w-lg mx-auto text-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-3">Payment Submitted!</h2>
                    <p className="text-white/40 mb-8">
                        Your payment is being reviewed. You&apos;ll be notified once approved. This usually takes 1-24 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/my-access')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                        >
                            View My Access
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <button onClick={() => navigate('/upgrade')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Plans
                </button>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white mb-1">Checkout</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-white/40 text-sm">Upgrading to</p>
                        <TierBadge tier={tier as UserTier} />
                        <span className="text-white font-bold">${tierData.price}/month</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Instructions - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-purple-400" />
                                Step 1: Send Payment
                            </h3>

                            {/* Amount */}
                            <div className="p-4 bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.04] rounded-xl border border-purple-500/10">
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Amount to Pay</p>
                                <p className="text-3xl font-bold text-white">${tierData.price} <span className="text-sm font-medium text-white/40">USDT</span></p>
                            </div>

                            {/* Binance ID */}
                            <div className="p-4 bg-[#0a0a0c] rounded-xl border border-white/5">
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-2">Send to Binance ID</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-white font-mono bg-white/5 px-3 py-2.5 rounded-lg flex-1 truncate border border-white/[0.04]">
                                        {siteSettings.binanceId || 'Loading...'}
                                    </span>
                                    <button
                                        onClick={copyBinanceId}
                                        className="p-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all shrink-0 border border-purple-500/10"
                                    >
                                        {copiedId ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code — Big and prominent */}
                            {siteSettings.binanceQrUrl && (
                                <div className="space-y-3">
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Scan QR Code</p>
                                    <div className="relative group flex justify-center">
                                        <div className="relative bg-white p-4 rounded-2xl shadow-2xl shadow-black/30 cursor-pointer" onClick={() => setQrZoomed(true)}>
                                            <img
                                                src={siteSettings.binanceQrUrl}
                                                alt="Payment QR Code"
                                                className="w-72 h-72 object-contain rounded-xl"
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <ZoomIn className="w-5 h-5 text-white" />
                                                <span className="text-white font-medium text-sm">Click to enlarge</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download button */}
                                    <button
                                        onClick={downloadQrCode}
                                        className="w-full py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/60 font-medium flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download QR Code
                                    </button>
                                </div>
                            )}

                            {/* Warning */}
                            <div className="p-3.5 rounded-xl bg-yellow-500/[0.05] border border-yellow-500/10 flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200/60 leading-relaxed">Only send <span className="font-bold text-yellow-300/80">USDT</span> via Binance Pay. Other tokens or networks may result in lost funds.</p>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                                <p className="text-xs text-white/40">Need help with payment?</p>
                                {siteSettings.telegramBotLink && (
                                    <a href={siteSettings.telegramBotLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                        Contact us on Telegram →
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit Form - Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-5 sticky top-8">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-400" />
                                Step 2: Submit Proof
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Transaction ID</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Paste your Binance transaction ID"
                                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/15 transition-all font-mono text-sm"
                                />
                            </div>

                            <FileUpload
                                label="Payment Screenshot"
                                onUploadComplete={setScreenshotUrl}
                                value={screenshotUrl}
                                type="image"
                                accept="image/*"
                                bucket="payment-screenshots"
                            />

                            <div>
                                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional info..."
                                    rows={3}
                                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/15 transition-all text-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 transition-all"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Payment Proof'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* QR Code Zoom Modal */}
            <AnimatePresence>
                {qrZoomed && siteSettings.binanceQrUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 cursor-pointer"
                        onClick={() => setQrZoomed(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

                        {/* Content */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setQrZoomed(false)}
                                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* QR Image */}
                            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-purple-500/10">
                                <img
                                    src={siteSettings.binanceQrUrl}
                                    alt="Payment QR Code - Full Size"
                                    className="w-[400px] h-[400px] max-w-[80vw] max-h-[80vh] object-contain rounded-xl"
                                />
                            </div>

                            {/* Actions below QR */}
                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={downloadQrCode}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl text-white font-medium flex items-center gap-2 text-sm transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
