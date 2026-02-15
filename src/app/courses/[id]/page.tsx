'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import {
    PlayCircle,
    Lock,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, getCourse } = useStore();
    const [course, setCourse] = useState<any>(null);
    const [activeSection, setActiveSection] = useState(0);
    const [showUpgrade, setShowUpgrade] = useState(false);
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
    const currentSection = course.content[activeSection];

    // Helper to extract YouTube ID
    const getYTId = (url: string) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n?#]+)/);
        return match ? match[1] : null;
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {isAccessible ? (
                            <div className="space-y-6">
                                {/* Video Player */}
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 relative group">
                                    {currentSection?.videoUrl ? (
                                        getYTId(currentSection.videoUrl) ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${getYTId(currentSection.videoUrl)}?autoplay=0&rel=0`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#0a0a0c]">
                                                <Youtube className="w-12 h-12 text-white/10" />
                                                <p className="text-white/30 text-sm">Invalid video URL</p>
                                                <a href={currentSection.videoUrl} target="_blank" className="px-4 py-2 bg-white/5 rounded-lg text-xs text-white/60">Open External Link</a>
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c]">
                                            <PlayCircle className="w-12 h-12 text-white/10 mb-4" />
                                            <p className="text-white/30 text-sm">No video for this section</p>
                                        </div>
                                    )}
                                </div>

                                {/* Section Title & Info */}
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-white">{currentSection?.title}</h1>
                                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        Lesson {activeSection + 1} of {course.content.length}
                                    </span>
                                </div>

                                {/* Lesson Description (Markdown) */}
                                <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 prose prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: currentSection?.content.replace(/\n/g, '<br/>') || 'No description available for this lesson.' }} />
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between pt-4">
                                    <button
                                        disabled={activeSection === 0}
                                        onClick={() => setActiveSection(s => s - 1)}
                                        className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white disabled:opacity-20 transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous Lesson
                                    </button>
                                    <button
                                        disabled={activeSection === course.content.length - 1}
                                        onClick={() => setActiveSection(s => s + 1)}
                                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-purple-400 disabled:opacity-20 transition-all"
                                    >
                                        Next Lesson <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative aspect-video bg-[#0a0a0c] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
                                <div className="text-center relative z-10 p-8 max-w-sm">
                                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Lock className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Content Locked</h3>
                                    <p className="text-sm text-white/40 mb-8">
                                        This advanced course is exclusive to <strong>{course.tierRequired.toUpperCase()}</strong> members.
                                    </p>
                                    <button
                                        onClick={() => setShowUpgrade(true)}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                                    >
                                        Upgrade Your Plan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Course Content */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden sticky top-24">
                            <div className="p-4 bg-white/5 border-b border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <BookOpen className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Course Registry</span>
                                </div>
                                <h3 className="text-sm font-bold text-white truncate">{course.title}</h3>
                            </div>

                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                {course.content.map((section: any, i: number) => (
                                    <button
                                        key={section.id}
                                        onClick={() => isAccessible && setActiveSection(i)}
                                        className={`
                      w-full p-4 flex items-start gap-4 text-left transition-all border-b border-white/[0.02] last:border-0
                      ${activeSection === i ? 'bg-purple-500/10 border-l-2 border-l-purple-500' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}
                      ${!isAccessible ? 'cursor-not-allowed grayscale' : ''}
                    `}
                                    >
                                        <div className={`mt-0.5 shrink-0 ${activeSection === i ? 'text-purple-400' : isAccessible ? 'text-white/20' : 'text-white/10'}`}>
                                            {activeSection === i ? <PlayCircle className="w-5 h-5 fill-purple-400/20" /> : <Lock className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Module {i + 1}</span>
                                            </div>
                                            <p className={`text-xs font-bold truncate ${activeSection === i ? 'text-white' : 'text-white/50'}`}>
                                                {section.title}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {!isAccessible && (
                                <div className="p-4 bg-red-500/5 mt-auto">
                                    <p className="text-[10px] text-red-400/60 leading-relaxed text-center">
                                        Verification required for full access to these modules.
                                    </p>
                                </div>
                            )}
                        </div>
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
