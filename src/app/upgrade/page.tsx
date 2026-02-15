'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA, TIER_COMPARISON } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpgradePage() {
    const { user, payments } = useStore();
    const router = useRouter();

    if (!user) return null;

    // Check if user already has a pending payment
    const pendingPayment = payments.find(p => p.userId === user.id && p.status === 'pending');

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6 tracking-widest uppercase"
                    >
                        <Sparkles className="w-4 h-4" />
                        Ascend to Elite Trading
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Access Institutional Assets</h1>
                    <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
                        Unlock restricted crack tools, full bundles of premium courses, and join the exclusive Telegram community.
                    </p>
                </div>

                {/* Pending payment warning */}
                {pendingPayment && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-500 font-bold">Verification in Progress</p>
                            <p className="text-xs text-white/40 mt-1 leading-relaxed">
                                You have a pending request for <strong className="text-white">{pendingPayment.tierRequested.toUpperCase()}</strong>.
                                Our admins are verifying your transaction. You will gain access immediately upon approval.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Tier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {Object.values(TIER_DATA).map((tier, i) => {
                        const isCurrentTier = user.tier === tier.id;
                        const tierIndex = ['free', 'tier1', 'tier2'].indexOf(tier.id);
                        const currentIndex = ['free', 'tier1', 'tier2'].indexOf(user.tier);
                        const isHigher = tierIndex > currentIndex;

                        return (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`
                                    relative p-8 rounded-2xl border transition-all duration-500 flex flex-col
                                    ${tier.highlighted
                                        ? 'border-purple-500/30 bg-purple-500/[0.03] shadow-2xl shadow-purple-500/10 scale-105 z-10'
                                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}
                                    ${isCurrentTier ? 'ring-1 ring-white/20' : ''}
                                `}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-[10px] text-white font-black tracking-widest uppercase">
                                        Recommended
                                    </div>
                                )}

                                <div className="mb-6">
                                    <TierBadge tier={tier.id} size="md" />
                                    <h3 className="text-xl font-bold text-white mt-4">{tier.name}</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-3xl font-black text-white">${tier.price}</span>
                                        {tier.id !== 'free' && <span className="text-xs text-white/30 font-medium">USD</span>}
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {tier.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-3 text-xs text-white/50 leading-tight">
                                            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-green-400" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={!isHigher}
                                    onClick={() => router.push(`/upgrade/checkout/${tier.id}`)}
                                    className={`
                                        w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                                        ${isHigher
                                            ? 'bg-white text-black hover:bg-purple-500 hover:text-white shadow-xl hover:shadow-purple-500/20'
                                            : 'bg-white/5 text-white/20 cursor-not-allowed'}
                                    `}
                                >
                                    {isCurrentTier ? 'Current Plan' : isHigher ? 'Upgrade Now' : 'Unlocked'}
                                    {isHigher && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-sm font-bold text-white/20 uppercase tracking-[0.2em] text-center mb-8">Detailed Comparison</h3>
                    <div className="rounded-3xl border border-white/5 bg-[#0a0a0c] overflow-hidden overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="text-left p-4 md:p-6 text-white/40 font-bold uppercase tracking-wider">Capabilities</th>
                                    <th className="text-center p-4 md:p-6 text-white/40 font-bold uppercase tracking-wider">Free</th>
                                    <th className="text-center p-4 md:p-6 text-purple-400 font-bold uppercase tracking-wider">Pro</th>
                                    <th className="text-center p-4 md:p-6 text-blue-400 font-bold uppercase tracking-wider">Elite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TIER_COMPARISON.map((row, i) => (
                                    <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6 text-white/60 font-medium">{row.feature}</td>
                                        <td className="p-6 text-center">
                                            {row.free ? <Check className="w-5 h-5 text-green-500/40 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-white/10 mx-auto" />}
                                        </td>
                                        <td className="p-6 text-center">
                                            {row.tier1 ? <Check className="w-5 h-5 text-purple-500 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-white/10 mx-auto" />}
                                        </td>
                                        <td className="p-6 text-center">
                                            {row.tier2 ? <Check className="w-5 h-5 text-blue-500 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-white/10 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* FAQ Style note */}
                <div className="mt-20 text-center pb-20">
                    <p className="text-sm text-white/20">
                        Have questions? Contact our <a href="#" className="text-purple-400/60 hover:text-purple-400 transition-colors">Support Team</a> for 24/7 assistance.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
