'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Clock, Calendar, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, getBlog } = useStore();
    const [post, setPost] = useState<any>(null);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const data = await getBlog(params.id as string);
            setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [params.id, getBlog]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user || !post) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-white/40">Article not found</p>
                </div>
            </DashboardLayout>
        );
    }

    const isAccessible = canAccessContent(user.tier, post.tierRequired);

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Insights
                </button>

                <article>
                    <motion.header
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <TierBadge tier={post.tierRequired} size="md" />
                            <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} min read</span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 w-fit">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white/60">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="pr-4">
                                <p className="text-xs text-white/30 font-medium leading-none mb-1">Author</p>
                                <p className="text-sm text-white font-semibold leading-none">{post.author}</p>
                            </div>
                        </div>
                    </motion.header>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert max-w-none"
                    >
                        {isAccessible ? (
                            <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8">
                                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Blurred Preview */}
                                <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 filter blur-[3px] pointer-events-none select-none">
                                    <p>{post.preview}</p>
                                    <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    <p className="mt-4">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>

                                {/* Upgrade Overlay */}
                                <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#050507] via-transparent to-transparent">
                                    <div className="bg-[#1a1a1d] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm text-center">
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Lock className="w-6 h-6 text-red-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Exclusive Article</h3>
                                        <p className="text-white/40 text-sm mb-6 leading-relaxed">
                                            Detailed analysis and strategies in this article are exclusive to <strong>{post.tierRequired.toUpperCase()}</strong> members.
                                        </p>
                                        <button
                                            onClick={() => setShowUpgrade(true)}
                                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                                        >
                                            Upgrade Your Tier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </article>

                <UpgradeModal
                    isOpen={showUpgrade}
                    onClose={() => setShowUpgrade(false)}
                    currentTier={user.tier}
                    onUpgrade={() => {
                        setShowUpgrade(false);
                        router.push('/upgrade');
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
