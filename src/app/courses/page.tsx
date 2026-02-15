'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { Lock, PlayCircle, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
    const { user, courses, fetchCourses } = useStore();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    if (!user) return null;

    const publishedCourses = courses.filter(c => c.published);

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">All Courses</h1>
                        <p className="text-white/40 text-sm mt-1">{publishedCourses.length} courses available</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {publishedCourses.map((course, i) => {
                        const isAccessible = canAccessContent(user.tier, course.tierRequired);

                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <div
                                    className={`
                    relative rounded-xl border overflow-hidden group cursor-pointer hover-lift
                    ${isAccessible ? 'border-white/5 bg-[#111113]' : 'border-white/5 bg-[#0e0e10]'}
                  `}
                                    onClick={() => {
                                        if (isAccessible) {
                                            router.push(`/courses/${course.id}`);
                                        } else {
                                            setShowUpgrade(true);
                                        }
                                    }}
                                >
                                    {/* Thumbnail Area */}
                                    <div className={`h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center relative ${!isAccessible ? 'filter blur-[1px]' : ''}`}>
                                        <BookOpen className={`w-10 h-10 ${isAccessible ? 'text-purple-400/40' : 'text-white/10'}`} />
                                        {!isAccessible && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                                    <Lock className="w-5 h-5 text-white/60" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TierBadge tier={course.tierRequired} size="sm" />
                                            <span className="flex items-center gap-1 text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                                                <PlayCircle className="w-3 h-3" />
                                                {course.videoCount} videos
                                            </span>
                                        </div>
                                        <h3 className={`font-semibold mb-1 ${isAccessible ? 'text-white group-hover:text-purple-400' : 'text-white/40'} transition-colors`}>
                                            {course.title}
                                        </h3>
                                        <p className={`text-xs leading-relaxed line-clamp-2 ${isAccessible ? 'text-white/40' : 'text-white/20'}`}>
                                            {course.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                                                <Clock className="w-3 h-3" />
                                                <span>Self-paced</span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase text-purple-400">View Lessons</span>
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
