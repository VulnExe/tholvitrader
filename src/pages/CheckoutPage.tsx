import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA } from '@/lib/tierSystem';
import FileUpload from '@/components/ui/FileUpload';
import TierBadge from '@/components/ui/TierBadge';
import { UserTier } from '@/lib/types';
import { ArrowLeft, Loader2, CheckCircle, Copy, QrCode, MessageCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
            <div className="max-w-3xl mx-auto space-y-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Payment Instructions */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-purple-400" />
                                Step 1: Send Payment
                            </h3>

                            <div className="p-4 bg-[#0a0a0c] rounded-xl border border-white/5">
                                <p className="text-xs text-white/30 mb-2">Send <span className="text-white font-bold">${tierData.price} USDT</span> to:</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-white font-mono bg-white/5 px-3 py-2 rounded-lg flex-1 truncate">
                                        {siteSettings.binanceId || 'Loading...'}
                                    </span>
                                    <button
                                        onClick={copyBinanceId}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shrink-0"
                                    >
                                        {copiedId ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {siteSettings.binanceQrUrl && (
                                <div className="flex justify-center">
                                    <img src={siteSettings.binanceQrUrl} alt="QR Code" className="w-48 h-48 rounded-xl border border-white/10" />
                                </div>
                            )}

                            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200/60">Only send USDT via Binance Pay. Other tokens or networks may result in lost funds.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                                <p className="text-xs text-white/50">Need help?</p>
                                {siteSettings.telegramBotLink && (
                                    <a href={siteSettings.telegramBotLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                                        Contact us on Telegram
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-400" />
                                Step 2: Submit Proof
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Transaction ID</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Paste your Binance transaction ID"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
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
                                <label className="block text-sm font-medium text-white/50 mb-2">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional info..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-sm resize-none"
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
        </DashboardLayout>
    );
}
