import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { getTierLabel, getUnlockPercentage } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, ArrowUpCircle, TrendingUp, Clock, Sparkles, Wrench, Zap, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const stagger = {
    container: {
        animate: { transition: { staggerChildren: 0.06 } }
    },
    item: {
        initial: { opacity: 0, y: 12 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
            }
        }
    }
};

export default function DashboardPage() {
    const { user, courses, blogs } = useStore();

    if (!user) return (
        <DashboardLayout>
            <DashboardSkeleton />
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <DashboardContent user={user} courses={courses} blogs={blogs} />
        </DashboardLayout>
    );
}

// Skeleton loader instead of just a spinner
function DashboardSkeleton() {
    return (
        <div className="max-w-5xl space-y-8">
            <div className="space-y-2">
                <div className="skeleton h-8 w-64" />
                <div className="skeleton h-4 w-40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton h-32 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="skeleton h-48 rounded-2xl" />
                <div className="skeleton h-48 rounded-2xl" />
            </div>
        </div>
    );
}

function DashboardContent({ user, courses, blogs }: { user: any, courses: any[], blogs: any[] }) {
    const totalContent = courses.length + blogs.length;
    const freeContent = courses.filter(c => c.tierRequired === 'free').length + blogs.filter(b => b.tierRequired === 'free').length;
    const tier1Content = courses.filter(c => c.tierRequired === 'tier1').length + blogs.filter(b => b.tierRequired === 'tier1').length;
    const unlockPercent = getUnlockPercentage(user.tier, totalContent, freeContent, tier1Content);

    const latestCourse = courses.filter(c => c.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const latestBlog = blogs.filter(b => b.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <motion.div
            className="max-w-5xl space-y-8"
            variants={stagger.container}
            initial="initial"
            animate="animate"
        >
            {/* Welcome Header */}
            <motion.div variants={stagger.item} className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative">
                    <p className="text-white/30 text-xs font-medium uppercase tracking-[0.2em] mb-1">{greeting()}</p>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="text-gradient">{user.name}</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-2">Here&apos;s your trading education overview</p>
                </div>
            </motion.div>

            {/* Quick Stats - 3 column */}
            <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier Card */}
                <div className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-purple-600/10 transition-all" />
                    <div className="relative flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">Current Tier</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-lg font-bold text-white leading-none">{getTierLabel(user.tier)}</span>
                                <TierBadge tier={user.tier} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-blue-600/10 transition-all" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">Content Unlocked</p>
                            </div>
                            <span className="text-sm font-bold text-white">{unlockPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${unlockPercent}%` }}
                                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            />
                        </div>
                        <p className="text-[10px] text-white/20 mt-2">
                            {unlockPercent < 100
                                ? <>{100 - unlockPercent}% more to unlock</>
                                : <>All content accessible</>
                            }
                        </p>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <Link
                    to="/upgrade"
                    className="group p-5 bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.04] border border-purple-500/10 rounded-2xl hover:border-purple-500/20 transition-all duration-300 relative overflow-hidden flex items-center gap-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/10 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="relative flex-1">
                        <p className="text-sm font-bold text-white">Upgrade Plan</p>
                        <p className="text-[11px] text-white/30 mt-0.5">Unlock more content</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all relative" />
                </Link>
            </motion.div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest Course */}
                <motion.div variants={stagger.item} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <h2 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Latest Course</h2>
                    </div>

                    {latestCourse ? (
                        <Link to={`/courses/${latestCourse.id}`} className="group block">
                            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl group-hover:bg-white/[0.06] group-hover:border-white/10 transition-all duration-300 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-purple-600/10 transition-all" />

                                {/* Hover indicator */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                        <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TierBadge tier={latestCourse.tierRequired} size="sm" />
                                        <span className="text-[10px] text-white/25 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(latestCourse.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">{latestCourse.title}</h3>
                                    <p className="text-white/35 text-xs line-clamp-2 leading-relaxed">{latestCourse.description}</p>
                                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                                        <BookOpen className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] text-white/20 font-medium">{latestCourse.videoCount} sections</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="p-12 border border-dashed border-white/[0.04] rounded-2xl flex flex-col items-center justify-center text-center">
                            <BookOpen className="w-8 h-8 text-white/[0.06] mb-2" />
                            <p className="text-xs text-white/15 font-medium">No courses yet</p>
                        </div>
                    )}
                </motion.div>

                {/* Latest Blog */}
                <motion.div variants={stagger.item} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <h2 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em]">Recent Market Insights</h2>
                    </div>

                    {latestBlog ? (
                        <Link to={`/blog/${latestBlog.id}`} className="group block">
                            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl group-hover:bg-white/[0.06] group-hover:border-white/10 transition-all duration-300 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-600/10 transition-all" />

                                {/* Hover indicator */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TierBadge tier={latestBlog.tierRequired} size="sm" />
                                        <span className="text-[10px] text-white/25 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(latestBlog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">{latestBlog.title}</h3>
                                    <p className="text-white/35 text-xs line-clamp-2 leading-relaxed">{latestBlog.preview}</p>
                                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                                        <FileText className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] text-white/20 font-medium">Market insights</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="p-12 border border-dashed border-white/[0.04] rounded-2xl flex flex-col items-center justify-center text-center">
                            <FileText className="w-8 h-8 text-white/[0.06] mb-2" />
                            <p className="text-xs text-white/15 font-medium">No articles yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Quick Nav Cards */}
            <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { to: '/courses', icon: BookOpen, label: 'Courses', color: 'purple', count: courses.length },
                    { to: '/tools', icon: Wrench, label: 'Tools', color: 'blue', count: null },
                    { to: '/blog', icon: FileText, label: 'Blog', color: 'green', count: blogs.length },
                    { to: '/my-access', icon: Shield, label: 'My Access', color: 'amber', count: null },
                ].map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="group p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-300 flex items-center gap-3"
                    >
                        <div className={`w-9 h-9 rounded-lg bg-${item.color}-500/10 flex items-center justify-center shrink-0`}>
                            <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white/70 group-hover:text-white transition-colors truncate">{item.label}</p>
                            {item.count !== null && (
                                <p className="text-[10px] text-white/20">{item.count} items</p>
                            )}
                        </div>
                    </Link>
                ))}
            </motion.div>

            {/* Upgrade CTA for free users */}
            {user.tier === 'free' && (
                <motion.div
                    variants={stagger.item}
                    className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/[0.06] via-transparent to-blue-500/[0.06] border border-white/[0.06] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Unlock Your Full Potential</h3>
                            <p className="text-white/35 text-sm max-w-md leading-relaxed">
                                You&apos;re on the <span className="text-white font-semibold">Free Tier</span>.
                                Upgrade to access <span className="text-purple-400 font-semibold">{100 - unlockPercent}%</span> more exclusive trading content, crack tools, and premium strategies.
                            </p>
                        </div>
                        <Link
                            to="/upgrade"
                            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 shrink-0"
                        >
                            <Zap className="w-4 h-4" />
                            View Upgrade Options
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
