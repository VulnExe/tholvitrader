'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, getCourse } = useStore();
    const [course, setCourse] = useState<any>(null);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            const data = await getCourse(params.id as string);
            setCourse(data);
            setLoading(false);
        };
        fetchCourse();
    }, [params.id, getCourse]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user || !course) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-white/40">Course not found</p>
                </div>
            </DashboardLayout>
        );
    }

    const isAccessible = canAccessContent(user.tier, course.tierRequired);

    if (!isAccessible) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </button>

                    <div className="rounded-2xl border border-white/5 overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                                    <Lock className="w-7 h-7 text-white/60" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-semibold">This course requires {course.tierRequired.toUpperCase()}</p>
                                    <p className="text-white/40 text-sm mt-1">Upgrade your plan to unlock full access</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <button
                                onClick={() => setShowUpgrade(true)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                            >
                                Upgrade to Unlock
                            </button>
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
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <TierBadge tier={course.tierRequired} size="md" />
                        <span className="text-xs text-white/30">{course.content?.length || 0} Lessons</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                    <p className="text-white/50 mt-2 max-w-2xl">{course.description}</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-72 shrink-0">
                        <div className="sticky top-24 p-4 rounded-xl bg-[#111113] border border-white/5">
                            <h3 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Course Syllabus</h3>
                            <div className="space-y-1">
                                {course.content?.map((section: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveSection(i)}
                                        className={`
                      w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all
                      ${activeSection === i
                                                ? 'bg-purple-500/10 text-white border border-purple-500/20'
                                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
                    `}
                                    >
                                        <div className="shrink-0 transition-colors">
                                            {activeSection > i ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : activeSection === i ? (
                                                <Circle className="w-4 h-4 text-purple-400" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-white/10" />
                                            )}
                                        </div>
                                        <span className="truncate">{section.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-xl bg-[#111113] border border-white/5"
                        >
                            {course.content?.[activeSection] && (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-white">{course.content[activeSection].title}</h2>
                                        {course.content[activeSection].videoUrl && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3" /> Video included
                                            </span>
                                        )}
                                    </div>

                                    {/* Video Player if available */}
                                    {course.content[activeSection].videoUrl && (
                                        <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 border border-white/5 bg-black">
                                            <iframe
                                                src={course.content[activeSection].videoUrl.replace('watch?v=', 'embed/')}
                                                className="w-full h-full"
                                                title="Video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}

                                    <div className="prose prose-invert max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: course.content[activeSection].content.replace(/\n/g, '<br/>') }} />
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-between">
                                        <button
                                            disabled={activeSection === 0}
                                            onClick={() => setActiveSection(activeSection - 1)}
                                            className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-0"
                                        >
                                            Previous Lesson
                                        </button>
                                        <button
                                            disabled={activeSection === course.content.length - 1}
                                            onClick={() => setActiveSection(activeSection + 1)}
                                            className="px-6 py-2 bg-purple-600 rounded-lg text-sm text-white font-medium hover:bg-purple-700 disabled:opacity-0 transition-colors"
                                        >
                                            Next Lesson
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
