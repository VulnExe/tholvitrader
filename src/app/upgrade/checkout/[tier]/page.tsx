'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA } from '@/lib/tierSystem';
import { UserTier } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Copy,
    CheckCircle2,
    Upload,
    ShieldCheck,
    AlertCircle,
    QrCode,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const { user, siteSettings, fetchSiteSettings, uploadFile, submitPayment } = useStore();

    const tierId = params.tier as UserTier;
    const tierInfo = TIER_DATA[tierId];

    const [txId, setTxId] = useState('');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchSiteSettings();
    }, [fetchSiteSettings]);

    if (!tierInfo || (user && user.tier === tierId)) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-white/40">Invalid tier or already subscribed.</p>
                    <button onClick={() => router.push('/upgrade')} className="mt-4 text-purple-400">Back to Plans</button>
                </div>
            </DashboardLayout>
        );
    }

    const handleCopy = () => {
        if (siteSettings.binanceId) {
            navigator.clipboard.writeText(siteSettings.binanceId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = async () => {
        if (!siteSettings.binanceQrUrl) return;
        try {
            const response = await fetch(siteSettings.binanceQrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'tholvitrader-binance-qr.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txId || !file) {
            setError('Transaction ID/Order ID and Payment Screenshot are required.');
            return;
        }

        setLoading(true);
        setError('');

        const fileName = `${user?.id}_${Date.now()}_${file.name}`;
        const { publicUrl, error: uploadError } = await uploadFile('uploads', `payments/${fileName}`, file);

        if (uploadError) {
            setError('Failed to upload screenshot. Please try again.');
            setLoading(false);
            return;
        }

        const result = await submitPayment(tierId, txId, notes);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to submit payment.');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <DashboardLayout>
                <div className="max-w-2xl mx-auto py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Payment Submitted!</h1>
                    <p className="text-white/40 mb-8">
                        Your payment is now being reviewed by our team. This usually takes 1-6 hours.
                        You will receive a notification once your access is upgraded.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Plans
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">Upgrade to {tierInfo.name}</h1>
                            <p className="text-white/40">Complete the Binance Pay payment below.</p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-[#111113] border border-white/5 space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <span className="text-sm text-white/60">Amount to Pay</span>
                                <span className="text-xl font-bold text-white">{tierInfo.price} USDT</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-bold text-xs text-white/40">1</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">Scan QR or Copy Binance ID</p>
                                        <p className="text-xs text-white/30 mt-1 mb-4">Pay using Binance App for instant verification.</p>

                                        {siteSettings.binanceQrUrl && (
                                            <div className="mb-4 space-y-3">
                                                <div className="p-3 bg-white w-fit rounded-xl">
                                                    <img src={siteSettings.binanceQrUrl} alt="QR Code" className="w-32 h-32 object-contain" />
                                                </div>
                                                <button
                                                    onClick={handleDownload}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all border border-white/5"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    Download QR Code
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2.5 font-mono text-[11px] text-white/50 truncate">
                                                ID: {siteSettings.binanceId || 'Not Configured'}
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                            >
                                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-bold text-xs text-white/40">2</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">Important Instructions</p>
                                        <ul className="text-xs text-white/30 mt-2 space-y-2 list-disc ml-4">
                                            <li>Ensure you send <strong className="text-white">EXACTLY {tierInfo.price} USDT</strong>.</li>
                                            <li>Use <strong className="text-white">Binance Pay</strong> for fastest processing.</li>
                                            <li>Take a screenshot of the successful payment confirmation.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-[11px] text-blue-400/80 leading-relaxed font-medium">
                                    Your payment is verified manually by the team.
                                </p>
                                {!user?.telegramUsername && (
                                    <p className="text-[10px] text-red-400 mt-2 font-black uppercase tracking-wider bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/10">
                                        ⚠️ Action Required: Please set your Telegram @username in <button onClick={() => router.push('/settings')} className="underline">Settings</button> so we can add you to the group.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:pt-20">
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-6 shadow-2xl shadow-black/50"
                        >
                            <h3 className="text-lg font-bold text-white mb-2">Submit Payment Details</h3>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Transaction ID / Order ID</label>
                                <input
                                    type="text"
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                    required
                                    placeholder="Enter Binance Order ID"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Payment Screenshot</label>
                                <label className={`
                                    w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                                    ${file ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'}
                                `}>
                                    {file ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                            <span className="text-xs text-white/60 truncate max-w-[200px]">{file.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-white/10" />
                                            <span className="text-xs text-white/30">Click to upload screenshot</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*" />
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Additional Info</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Any details to help us verify?"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : 'Submit Confirmation'}
                            </button>

                            <p className="text-[10px] text-white/20 text-center uppercase tracking-widest font-bold">
                                ⚡ TholviTrader Security Verification
                            </p>
                        </motion.form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
