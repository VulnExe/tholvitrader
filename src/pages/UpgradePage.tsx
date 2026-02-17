import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { TIER_DATA, TIER_COMPARISON, getTierGradient } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserTier } from '@/lib/types';

export default function UpgradePage() {
    const navigate = useNavigate();
    const { user } = useStore();

    const tiers = Object.values(TIER_DATA);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-10">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Upgrade Your Access</h1>
                    <p className="text-white/40 max-w-lg mx-auto">Unlock premium trading tools, full course bundles, and exclusive content</p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier, i) => {
                        const isCurrent = user?.tier === tier.id;
                        const isUpgrade = !isCurrent && tier.id !== 'free';

                        return (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border relative overflow-hidden ${tier.highlighted ? 'bg-purple-500/5 border-purple-500/20 shadow-lg shadow-purple-500/5' : 'bg-white/5 border-white/10'}`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                                )}

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                                        <TierBadge tier={tier.id} size="sm" />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">${tier.price}</span>
                                        <span className="text-white/30 text-sm">/month</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {tier.features.map((f, fi) => (
                                        <div key={fi} className="flex items-center gap-3 text-sm text-white/60">
                                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                {isCurrent ? (
                                    <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-white/40 text-sm font-medium">
                                        Current Plan
                                    </div>
                                ) : isUpgrade ? (
                                    <button
                                        onClick={() => navigate(`/upgrade/checkout/${tier.id}`)}
                                        className={`w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg bg-gradient-to-r ${getTierGradient(tier.id)}`}
                                    >
                                        <Zap className="w-4 h-4" />
                                        Upgrade to {tier.name}
                                    </button>
                                ) : (
                                    <div className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-center text-white/20 text-sm">
                                        Free
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="overflow-x-auto"
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 px-4 text-white/30 font-medium">Feature</th>
                                <th className="text-center py-4 px-4 text-white/30 font-medium">Free</th>
                                <th className="text-center py-4 px-4 text-purple-400 font-medium">Tier 1</th>
                                <th className="text-center py-4 px-4 text-white/30 font-medium">Tier 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TIER_COMPARISON.map((row, i) => (
                                <tr key={i} className="border-b border-white/5">
                                    <td className="py-3 px-4 text-white/60">{row.feature}</td>
                                    <td className="text-center py-3 px-4">{row.free ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/10 mx-auto" />}</td>
                                    <td className="text-center py-3 px-4">{row.tier1 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/10 mx-auto" />}</td>
                                    <td className="text-center py-3 px-4">{row.tier2 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/10 mx-auto" />}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
