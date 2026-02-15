'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { getTierLabel, getUnlockPercentage } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import Link from 'next/link';
import { BookOpen, FileText, ArrowUpCircle, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user, courses, blogs } = useStore();

    return (
        <DashboardLayout>
            {!user ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <DashboardContent user={user} courses={courses} blogs={blogs} />
            )}
        </DashboardLayout>
    );
}

function DashboardContent({ user, courses, blogs }: { user: any, courses: any[], blogs: any[] }) {
    const totalContent = courses.length + blogs.length;
    const freeContent = courses.filter(c => c.tierRequired === 'free').length + blogs.filter(b => b.tierRequired === 'free').length;
    const tier1Content = courses.filter(c => c.tierRequired === 'tier1').length + blogs.filter(b => b.tierRequired === 'tier1').length;
    const unlockPercent = getUnlockPercentage(user.tier, totalContent, freeContent, tier1Content);

    const latestCourse = courses.filter(c => c.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const latestBlog = blogs.filter(b => b.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

    return (
        <div className="max-w-5xl space-y-8">
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, <span className="text-gradient">{user.name}</span>
                </h1>
                <p className="text-white/40 text-sm mt-1">Here&apos;s your learning overview</p>
            </motion.div>

            {/* Tier + Progress */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Current Tier</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-white leading-none">{getTierLabel(user.tier)}</span>
                                <TierBadge tier={user.tier} />
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/upgrade"
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
                    >
                        Upgrade
                    </Link>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Platform Progress</p>
                        </div>
                        <span className="text-sm font-bold text-white">{unlockPercent}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${unlockPercent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                    </div>
                    <p className="text-[10px] text-white/30 mt-2">
                        You have unlocked <span className="text-white">{unlockPercent}%</span> of total content
                    </p>
                </div>
            </motion.div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest Course */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2 px-1">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Latest Course</h2>
                    </div>

                    {latestCourse ? (
                        <Link href={`/courses/${latestCourse.id}`} className="group block">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/[0.08] transition-all relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TierBadge tier={latestCourse.tierRequired} />
                                    <span className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {new Date(latestCourse.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{latestCourse.title}</h3>
                                <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">{latestCourse.description}</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="p-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <BookOpen className="w-8 h-8 text-white/10 mb-2" />
                            <p className="text-xs text-white/20 uppercase tracking-widest">No courses yet</p>
                        </div>
                    )}
                </motion.div>

                {/* Latest Blog */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2 px-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recent Market Insights</h2>
                    </div>

                    {latestBlog ? (
                        <Link href={`/blog/${latestBlog.id}`} className="group block">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/[0.08] transition-all relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <ArrowUpCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TierBadge tier={latestBlog.tierRequired} />
                                    <span className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {new Date(latestBlog.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{latestBlog.title}</h3>
                                <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">{latestBlog.preview}</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="p-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <FileText className="w-8 h-8 text-white/10 mb-2" />
                            <p className="text-xs text-white/20 uppercase tracking-widest">No articles yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Upgrade CTA for free users */}
            {user.tier === 'free' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Want to see more?</h3>
                            <p className="text-white/40 text-sm max-w-md">
                                You&apos;re currently on the <span className="text-white font-bold">Free Tier</span>.
                                Upgrade to unlock <span className="text-purple-400 font-bold">{100 - unlockPercent}%</span> more exclusive trading content and strategies.
                            </p>
                        </div>
                        <Link
                            href="/upgrade"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-0.5"
                        >
                            View Upgrade Options
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
