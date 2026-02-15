'use client';

import { X, Check, Sparkles } from 'lucide-react';
import { TIER_DATA, TIER_COMPARISON } from '@/lib/tierSystem';
import { UserTier } from '@/lib/types';
import TierBadge from './TierBadge';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: UserTier;
    onUpgrade: (tier: UserTier) => void;
}

export default function UpgradeModal({ isOpen, onClose, currentTier, onUpgrade }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-4xl mx-auto bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/20 animate-scale-in overflow-hidden">
                {/* Gradient header */}
                <div className="relative px-8 pt-8 pb-6">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="relative text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-3">
                            <Sparkles className="w-3 h-3" />
                            UPGRADE YOUR ACCESS
                        </div>
                        <h2 className="text-2xl font-bold text-white">Unlock Premium Content</h2>
                        <p className="text-white/50 text-sm mt-2">Choose the plan that fits your trading journey</p>
                    </div>
                </div>

                {/* Tier Cards */}
                <div className="px-8 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.values(TIER_DATA).map(tier => {
                            const isCurrentTier = currentTier === tier.id;
                            const isHigher = ['free', 'tier1', 'tier2'].indexOf(tier.id) > ['free', 'tier1', 'tier2'].indexOf(currentTier);

                            return (
                                <div
                                    key={tier.id}
                                    className={`
                    relative rounded-xl border p-5 transition-all duration-300
                    ${tier.highlighted
                                            ? 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/10'
                                            : 'border-white/5 bg-white/[0.02]'}
                    ${isCurrentTier ? 'ring-2 ring-blue-500/50' : ''}
                  `}
                                >
                                    {tier.highlighted && (
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                            Popular
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <TierBadge tier={tier.id} size="sm" />
                                    </div>
                                    <h3 className="text-white font-semibold">{tier.name}</h3>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {tier.price}
                                    </p>

                                    <ul className="mt-4 space-y-2">
                                        {tier.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                                <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => isHigher && onUpgrade(tier.id)}
                                        disabled={isCurrentTier || !isHigher}
                                        className={`
                      w-full mt-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                      ${isCurrentTier
                                                ? 'bg-white/5 text-white/30 cursor-default'
                                                : isHigher
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'
                                                    : 'bg-white/5 text-white/20 cursor-default'}
                    `}
                                    >
                                        {isCurrentTier ? 'Current Plan' : isHigher ? 'Upgrade' : 'Included'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="px-8 pb-8 pt-4">
                    <h4 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Feature Comparison</h4>
                    <div className="border border-white/5 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-3 text-white/40 font-medium">Feature</th>
                                    <th className="text-center p-3 text-white/40 font-medium">Free</th>
                                    <th className="text-center p-3 text-white/40 font-medium">Tier 1</th>
                                    <th className="text-center p-3 text-white/40 font-medium">Tier 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TIER_COMPARISON.map((row, i) => (
                                    <tr key={i} className="border-b border-white/[0.03] last:border-0">
                                        <td className="p-3 text-white/60">{row.feature}</td>
                                        <td className="p-3 text-center">
                                            {row.free ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/20">—</span>}
                                        </td>
                                        <td className="p-3 text-center">
                                            {row.tier1 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/20">—</span>}
                                        </td>
                                        <td className="p-3 text-center">
                                            {row.tier2 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-white/20">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
