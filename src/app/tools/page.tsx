'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect, useMemo } from 'react';
import { Lock, Wrench, PlayCircle, Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserTier } from '@/lib/types';

export default function ToolsPage() {
    const { user, tools, fetchTools } = useStore();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [localQuery, setLocalQuery] = useState('');
    const [tierFilter, setTierFilter] = useState<UserTier | 'all'>('all');
    const router = useRouter();

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    const filteredTools = useMemo(() => {
        return tools.filter(t => {
            if (!t.published) return false;
            const matchesSearch = t.title.toLowerCase().includes(localQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(localQuery.toLowerCase());
            const matchesTier = tierFilter === 'all' || t.tierRequired === tierFilter;
            return matchesSearch && matchesTier;
        });
    }, [tools, localQuery, tierFilter]);

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60">Toolkit</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Trading Signal Tools</h1>
                            <p className="text-white/40 text-sm mt-1">Institutional-grade indicators and automation</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    placeholder="Find a tool..."
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setTierFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${tierFilter === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
                                }`}
                        >
                            All Categories
                        </button>
                        {(['free', 'tier1', 'tier2'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTierFilter(t)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${tierFilter === t ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <span className="capitalize">{t === 'free' ? 'Basic' : t === 'tier1' ? 'Premium' : 'Institutional'}</span>
                            </button>
                        ))}
                    </div>
                </header>

                {filteredTools.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <Wrench className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No specialized tools found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredTools.map((tool, i) => {
                                const isAccessible = canAccessContent(user.tier, tool.tierRequired);

                                return (
                                    <motion.div
                                        layout
                                        key={tool.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                    >
                                        <div
                                            className={`
                                                relative h-full rounded-2xl border overflow-hidden group cursor-pointer transition-all duration-500
                                                ${isAccessible ? 'border-white/5 bg-[#111113] hover:border-blue-500/30' : 'border-white/5 bg-[#0e0e10]'}
                                            `}
                                            onClick={() => {
                                                if (isAccessible) {
                                                    router.push(`/tools/${tool.id}`);
                                                } else {
                                                    setShowUpgrade(true);
                                                }
                                            }}
                                        >
                                            <div className="h-44 bg-[#0a0a0c] relative overflow-hidden flex items-center justify-center">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-60 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000" />

                                                {tool.thumbnailUrl ? (
                                                    <img src={tool.thumbnailUrl} alt={tool.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <Wrench className={`w-12 h-12 relative z-10 transition-all duration-500 ${isAccessible ? 'text-blue-400 group-hover:scale-110 group-hover:-rotate-12' : 'text-white/10'}`} />
                                                )}

                                                {!isAccessible && (
                                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                                            <Lock className="w-5 h-5 text-white/40" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Unlock Premium</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-4 right-4 z-30">
                                                    <TierBadge tier={tool.tierRequired} size="sm" />
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-bold uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-lg">
                                                        <PlayCircle className="w-3.5 h-3.5" />
                                                        <span>{tool.videoCount || 0} Modules</span>
                                                    </div>
                                                </div>

                                                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isAccessible ? 'text-white group-hover:text-blue-400' : 'text-white/30'}`}>
                                                    {tool.title}
                                                </h3>
                                                <p className={`text-xs leading-relaxed line-clamp-2 h-8 ${isAccessible ? 'text-white/40' : 'text-white/10'}`}>
                                                    {tool.description}
                                                </p>

                                                <div className="mt-6 pt-5 border-t border-white/[0.03] flex items-center justify-between">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isAccessible ? 'text-white/20' : 'text-white/10'}`}>
                                                        Launch Interface
                                                    </span>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAccessible ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-white/5 text-white/10'}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                currentTier={user.tier}
                onUpgrade={() => {
                    setShowUpgrade(false);
                    router.push('/upgrade');
                }}
            />
        </DashboardLayout>
    );
}
