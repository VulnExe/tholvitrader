'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect, useMemo } from 'react';
import { Lock, FileText, Clock, ChevronRight, Search, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserTier } from '@/lib/types';

export default function BlogPage() {
    const { user, blogs, fetchBlogs } = useStore();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [localQuery, setLocalQuery] = useState('');
    const [tierFilter, setTierFilter] = useState<UserTier | 'all'>('all');
    const router = useRouter();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const filteredBlogs = useMemo(() => {
        return blogs.filter(b => {
            if (!b.published) return false;
            const matchesSearch = b.title.toLowerCase().includes(localQuery.toLowerCase()) ||
                b.preview.toLowerCase().includes(localQuery.toLowerCase());
            const matchesTier = tierFilter === 'all' || b.tierRequired === tierFilter;
            return matchesSearch && matchesTier;
        });
    }, [blogs, localQuery, tierFilter]);

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Newspaper className="w-4 h-4 text-green-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400/60">Journal</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Market Insights</h1>
                            <p className="text-white/40 text-sm mt-1">Institutional analysis and trading wisdom</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-green-400 transition-colors" />
                                <input
                                    type="text"
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    placeholder="Search insights..."
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-green-500/50 transition-all w-64"
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
                            Latest Posts
                        </button>
                        {(['free', 'tier1', 'tier2'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTierFilter(t)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${tierFilter === t ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <span className="capitalize">{t === 'free' ? 'Public' : t === 'tier1' ? 'Premium' : 'Inner Circle'}</span>
                            </button>
                        ))}
                    </div>
                </header>

                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No articles found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredBlogs.map((post, i) => {
                                const isAccessible = canAccessContent(user.tier, post.tierRequired);

                                return (
                                    <motion.div
                                        layout
                                        key={post.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                    >
                                        <div
                                            className={`
                                                group flex flex-col md:flex-row gap-6 p-6 rounded-2xl border transition-all duration-500 cursor-pointer
                                                ${isAccessible ? 'bg-[#111113] border-white/5 hover:border-green-500/30' : 'bg-[#0e0e10] border-white/5'}
                                            `}
                                            onClick={() => {
                                                if (isAccessible) {
                                                    router.push(`/blog/${post.id}`);
                                                } else {
                                                    setShowUpgrade(true);
                                                }
                                            }}
                                        >
                                            <div className="md:w-56 h-40 rounded-xl relative overflow-hidden shrink-0 border border-white/5">
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-60 group-hover:scale-110 transition-transform duration-700" />

                                                {post.thumbnailUrl ? (
                                                    <img src={post.thumbnailUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <FileText className={`w-10 h-10 transition-all duration-500 ${isAccessible ? 'text-green-400/40 group-hover:scale-110 group-hover:rotate-6' : 'text-white/5'}`} />
                                                    </div>
                                                )}

                                                {!isAccessible && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                                        <Lock className="w-5 h-5 text-white/30" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <TierBadge tier={post.tierRequired} size="sm" />
                                                        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-widest bg-white/[0.03] px-2 py-1 rounded-md">
                                                            <Clock className="w-3 h-3" />
                                                            {post.readTime} min read
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-white/10 font-bold uppercase tracking-tighter">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>

                                                <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isAccessible ? 'text-white group-hover:text-green-400' : 'text-white/30'}`}>
                                                    {post.title}
                                                </h2>
                                                <p className={`text-sm leading-relaxed line-clamp-2 mb-6 ${isAccessible ? 'text-white/40' : 'text-white/10'}`}>
                                                    {post.preview}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{post.author}</span>
                                                    </div>

                                                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isAccessible ? 'text-green-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100' : 'text-white/10'}`}>
                                                        {isAccessible ? 'Read Insight' : 'Locked'}
                                                        <ChevronRight className="w-3.5 h-3.5" />
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
