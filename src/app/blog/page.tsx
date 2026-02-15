'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { Lock, FileText, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
    const { user, blogs, fetchBlogs } = useStore();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    if (!user) return null;

    const publishedBlogs = blogs.filter(b => b.published);

    return (
        <DashboardLayout>
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Market Insights</h1>
                    <p className="text-white/40 text-sm mt-1">Daily analysis, trading tips, and educational articles</p>
                </div>

                <div className="space-y-4">
                    {publishedBlogs.map((post, i) => {
                        const isAccessible = canAccessContent(user.tier, post.tierRequired);

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                                <div
                                    className={`
                    flex flex-col md:flex-row gap-6 p-5 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isAccessible ? 'bg-[#111113] border-white/5 hover:border-white/10' : 'bg-[#0e0e10] border-white/5'}
                  `}
                                    onClick={() => {
                                        if (isAccessible) {
                                            router.push(`/blog/${post.id}`);
                                        } else {
                                            setShowUpgrade(true);
                                        }
                                    }}
                                >
                                    <div className={`md:w-48 h-32 md:h-full rounded-xl bg-gradient-to-br from-green-500/10 to-blue-500/10 flex items-center justify-center shrink-0 ${!isAccessible ? 'filter blur-[1px]' : ''}`}>
                                        <FileText className={`w-8 h-8 ${isAccessible ? 'text-green-400/40' : 'text-white/10'}`} />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TierBadge tier={post.tierRequired} size="sm" />
                                            <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime} min read
                                            </div>
                                        </div>
                                        <h2 className={`text-xl font-bold mb-2 transition-colors ${isAccessible ? 'text-white' : 'text-white/40'}`}>
                                            {post.title}
                                        </h2>
                                        <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${isAccessible ? 'text-white/40' : 'text-white/20'}`}>
                                            {post.preview}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/40 border border-white/10">
                                                    {post.author.charAt(0)}
                                                </div>
                                                <span className="text-[10px] text-white/30 font-medium">{post.author}</span>
                                            </div>
                                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${isAccessible ? 'text-green-400 opacity-0 group-hover:opacity-100' : 'text-red-400'}`}>
                                                {isAccessible ? (
                                                    <>Read Article <ChevronRight className="w-3 h-3" /></>
                                                ) : (
                                                    <><Lock className="w-3 h-3" /> Upgrade to Read</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
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
