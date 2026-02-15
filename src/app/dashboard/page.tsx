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

    if (!user) return null;

    const totalContent = courses.length + blogs.length;
    const freeContent = courses.filter(c => c.tierRequired === 'free').length + blogs.filter(b => b.tierRequired === 'free').length;
    const tier1Content = courses.filter(c => c.tierRequired === 'tier1').length + blogs.filter(b => b.tierRequired === 'tier1').length;
    const unlockPercent = getUnlockPercentage(user.tier, totalContent, freeContent, tier1Content);

    const latestCourse = courses.filter(c => c.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const latestBlog = blogs.filter(b => b.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

    return (
        <DashboardLayout>
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
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-[#111113] to-blue-500/5 border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-white/50 text-sm">Current Plan</p>
                                <TierBadge tier={user.tier} size="lg" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 max-w-xs">
                                    <div className="flex justify-between text-xs text-white/40 mb-1.5">
                                        <span>Content Unlocked</span>
                                        <span className="text-white/60 font-medium">{unlockPercent}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${unlockPercent}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            {user.tier === 'free' && (
                                <p className="text-xs text-white/30 mt-3">
                                    ✨ Upgrade to unlock {100 - unlockPercent}% more content
                                </p>
                            )}
                        </div>

                        {user.tier !== 'tier2' && (
                            <Link
                                href="/upgrade"
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5 shrink-0"
                            >
                                <Sparkles className="w-4 h-4" />
                                Upgrade Plan
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: BookOpen, label: 'Available Courses', value: courses.filter(c => c.published).length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { icon: FileText, label: 'Blog Articles', value: blogs.filter(b => b.published).length, color: 'text-green-400', bg: 'bg-green-500/10' },
                        { icon: TrendingUp, label: 'Your Progress', value: `${unlockPercent}%`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="p-5 rounded-xl bg-[#111113] border border-white/5 hover-lift"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-white/40">{stat.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Latest Course */}
                    {latestCourse && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <Link href={`/courses/${latestCourse.id}`} className="block p-5 rounded-xl bg-[#111113] border border-white/5 hover:border-purple-500/20 hover-lift group">
                                <div className="h-32 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-4 overflow-hidden">
                                    <BookOpen className="w-8 h-8 text-purple-400/50 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-white/30 uppercase tracking-wider">Latest Course</span>
                                    <TierBadge tier={latestCourse.tierRequired} size="sm" />
                                </div>
                                <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">{latestCourse.title}</h3>
                                <p className="text-sm text-white/30 mt-1 line-clamp-2">{latestCourse.description}</p>
                            </Link>
                        </motion.div>
                    )}

                    {/* Latest Blog */}
                    {latestBlog && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <Link href={`/blog/${latestBlog.id}`} className="block p-5 rounded-xl bg-[#111113] border border-white/5 hover:border-blue-500/20 hover-lift group">
                                <div className="h-32 rounded-lg bg-gradient-to-br from-blue-500/10 to-green-500/10 flex items-center justify-center mb-4 overflow-hidden">
                                    <FileText className="w-8 h-8 text-blue-400/50 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-white/30 uppercase tracking-wider">Latest Article</span>
                                    <TierBadge tier={latestBlog.tierRequired} size="sm" />
                                </div>
                                <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{latestBlog.title}</h3>
                                <p className="text-sm text-white/30 mt-1 line-clamp-2">{latestBlog.preview}</p>
                                <div className="flex items-center gap-2 mt-3 text-xs text-white/20">
                                    <Clock className="w-3 h-3" />
                                    {latestBlog.readTime} min read
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Upgrade CTA for free users */}
                {user.tier === 'free' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="p-6 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                                <ArrowUpCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-semibold">You&apos;re missing premium content!</h3>
                                <p className="text-sm text-white/40 mt-1">
                                    Upgrade to Tier 1 or Tier 2 to unlock exclusive courses, trading strategies, and community access.
                                </p>
                            </div>
                            <Link
                                href="/upgrade"
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5 shrink-0"
                            >
                                View Plans
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
