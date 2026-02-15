'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA, TIER_COMPARISON } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import { useState, FormEvent } from 'react';
import { Check, Copy, CheckCircle, Upload, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserTier } from '@/lib/types';

export default function UpgradePage() {
    const { user, submitPayment, payments } = useStore();
    const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
    const [step, setStep] = useState<'select' | 'payment' | 'submitted'>('select');
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!user) return null;

    const walletAddress = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE';

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTier || !transactionId) return;

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        submitPayment(selectedTier, transactionId, notes);
        setIsSubmitting(false);
        setStep('submitted');
    };

    // Check if user already has a pending payment
    const pendingPayment = payments.find(p => p.userId === user.id && p.status === 'pending');

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
                        <Sparkles className="w-3 h-3" />
                        UPGRADE YOUR PLAN
                    </div>
                    <h1 className="text-3xl font-bold text-white">Choose Your Level</h1>
                    <p className="text-white/40 mt-2">Unlock premium content and accelerate your trading journey</p>
                </div>

                {/* Pending payment warning */}
                {pendingPayment && step === 'select' && (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-400 font-medium">Payment Under Review</p>
                            <p className="text-xs text-white/40 mt-1">
                                You have a pending payment for {pendingPayment.tierRequested.toUpperCase()}. We&apos;re reviewing your transaction. You&apos;ll be notified once approved.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'select' && (
                    <>
                        {/* Tier Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                            {Object.values(TIER_DATA).map((tier, i) => {
                                const isCurrentTier = user.tier === tier.id;
                                const tierIndex = ['free', 'tier1', 'tier2'].indexOf(tier.id);
                                const currentIndex = ['free', 'tier1', 'tier2'].indexOf(user.tier);
                                const isHigher = tierIndex > currentIndex;

                                return (
                                    <motion.div
                                        key={tier.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        onClick={() => isHigher && setSelectedTier(tier.id)}
                                        className={`
                      relative p-6 rounded-xl border cursor-pointer transition-all duration-300
                      ${selectedTier === tier.id
                                                ? 'border-purple-500/50 bg-purple-500/5 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                                                : tier.highlighted
                                                    ? 'border-purple-500/20 bg-purple-500/5'
                                                    : 'border-white/5 bg-white/[0.02]'}
                      ${isCurrentTier ? 'opacity-50' : ''}
                      ${!isHigher ? 'cursor-default' : 'hover:border-purple-500/30'}
                    `}
                                    >
                                        {tier.highlighted && (
                                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] text-white font-bold">
                                                POPULAR
                                            </div>
                                        )}

                                        {isCurrentTier && (
                                            <div className="absolute -top-2.5 right-4 px-3 py-0.5 bg-white/10 rounded-full text-[10px] text-white/60 font-bold">
                                                CURRENT
                                            </div>
                                        )}

                                        <TierBadge tier={tier.id} size="sm" />
                                        <h3 className="text-white font-semibold mt-3">{tier.name}</h3>
                                        <p className="text-2xl font-bold text-white mt-1">{tier.price}</p>

                                        <ul className="mt-4 space-y-2">
                                            {tier.features.map((f, j) => (
                                                <li key={j} className="flex items-start gap-2 text-xs text-white/50">
                                                    <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Feature Comparison */}
                        <div className="mb-10">
                            <h3 className="text-sm font-medium text-white/30 uppercase tracking-wider mb-4">Feature Comparison</h3>
                            <div className="rounded-xl border border-white/5 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-white/[0.02]">
                                            <th className="text-left p-3 text-white/30 font-medium">Feature</th>
                                            <th className="text-center p-3 text-white/30 font-medium">Free</th>
                                            <th className="text-center p-3 text-white/30 font-medium">Tier 1</th>
                                            <th className="text-center p-3 text-white/30 font-medium">Tier 2</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIER_COMPARISON.map((row, i) => (
                                            <tr key={i} className="border-t border-white/[0.03]">
                                                <td className="p-3 text-white/50">{row.feature}</td>
                                                <td className="p-3 text-center">{row.free ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/10">—</span>}</td>
                                                <td className="p-3 text-center">{row.tier1 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/10">—</span>}</td>
                                                <td className="p-3 text-center">{row.tier2 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/10">—</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedTier && (
                            <div className="text-center">
                                <button
                                    onClick={() => setStep('payment')}
                                    className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                                >
                                    Continue with {TIER_DATA[selectedTier].name}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 'payment' && selectedTier && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto"
                    >
                        <div className="p-6 rounded-xl bg-[#111113] border border-white/5">
                            {/* Selected tier */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                <div>
                                    <p className="text-xs text-white/30 uppercase tracking-wider">Selected Plan</p>
                                    <p className="text-white font-semibold mt-1">{TIER_DATA[selectedTier].name}</p>
                                </div>
                                <p className="text-xl font-bold text-white">{TIER_DATA[selectedTier].price}</p>
                            </div>

                            {/* QR Code Section */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-white/50 mb-4">Scan the QR code or copy the wallet address to send payment</p>

                                {/* QR Placeholder */}
                                <div className="w-48 h-48 mx-auto rounded-xl bg-white p-3 mb-4">
                                    <div className="w-full h-full bg-[#111113] rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-xs text-white/30">Binance QR</p>
                                            <p className="text-[10px] text-white/20 mt-1">USDT (TRC20)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet Address */}
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <code className="text-xs text-white/60 flex-1 truncate">{walletAddress}</code>
                                    <button
                                        onClick={handleCopy}
                                        className="shrink-0 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                                    >
                                        {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                <p className="text-[10px] text-yellow-400/60 mt-3 flex items-center justify-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Make sure to enter the correct transaction ID
                                </p>
                            </div>

                            {/* Payment Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Transaction ID *</label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. 0xabc123..."
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Screenshot (optional)</label>
                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors cursor-pointer">
                                        <Upload className="w-6 h-6 text-white/20 mx-auto mb-2" />
                                        <p className="text-xs text-white/30">Click to upload or drag and drop</p>
                                        <p className="text-[10px] text-white/15 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Notes (optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any additional information..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep('select')}
                                        className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm font-medium hover:bg-white/10 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !transactionId}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Payment'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 'submitted' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center"
                    >
                        <div className="p-8 rounded-2xl bg-[#111113] border border-white/5">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Payment Submitted!</h2>
                            <p className="text-white/40 mt-3">
                                Your payment is under review. This usually takes 1-24 hours.
                                You&apos;ll be notified once your upgrade is approved.
                            </p>

                            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/30">Plan</span>
                                    <span className="text-white">{selectedTier && TIER_DATA[selectedTier].name}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/30">Transaction ID</span>
                                    <span className="text-white/60 text-xs truncate max-w-[150px]">{transactionId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/30">Status</span>
                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded-full font-medium">Pending Review</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStep('select');
                                    setTransactionId('');
                                    setNotes('');
                                    setSelectedTier(null);
                                }}
                                className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
