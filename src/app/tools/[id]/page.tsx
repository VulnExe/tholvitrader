'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CheckCircle, Circle, Wrench, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, getTool } = useStore();
    const [tool, setTool] = useState<any>(null);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            const data = await getTool(params.id as string);
            setTool(data);
            setLoading(false);
        };
        fetchTool();
    }, [params.id, getTool]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user || !tool) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-white/40">Tool not found</p>
                </div>
            </DashboardLayout>
        );
    }

    const isAccessible = canAccessContent(user.tier, tool.tierRequired);

    if (!isAccessible) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tools
                    </button>

                    <div className="rounded-2xl border border-white/5 overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                                    <Lock className="w-7 h-7 text-white/60" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-semibold">This tool requires {tool.tierRequired.toUpperCase()}</p>
                                    <p className="text-white/40 text-sm mt-1">Upgrade your plan to unlock this tool</p>
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
                    Back to Tools
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <TierBadge tier={tool.tierRequired} size="md" />
                        <span className="text-xs text-white/30">{tool.sections?.length || 0} modules</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{tool.title}</h1>
                    <p className="text-white/50 mt-2 max-w-2xl">{tool.description}</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-72 shrink-0">
                        <div className="sticky top-24 p-4 rounded-xl bg-[#111113] border border-white/5">
                            <h3 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Guide Sections</h3>
                            <div className="space-y-1">
                                {tool.sections?.map((section: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveSection(i)}
                                        className={`
                      w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all
                      ${activeSection === i
                                                ? 'bg-blue-500/10 text-white border border-blue-500/20'
                                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
                    `}
                                    >
                                        <Circle className={`w-4 h-4 shrink-0 ${activeSection === i ? 'text-blue-400' : 'text-white/20'}`} />
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
                            {tool.sections?.[activeSection] && (
                                <>
                                    <h2 className="text-xl font-semibold text-white mb-6">{tool.sections[activeSection].title}</h2>

                                    {/* Video Player if available */}
                                    {tool.sections[activeSection].videoUrl && (
                                        <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 border border-white/5 bg-black">
                                            <iframe
                                                src={tool.sections[activeSection].videoUrl.replace('watch?v=', 'embed/')}
                                                className="w-full h-full"
                                                title="Video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}

                                    <div className="prose prose-invert max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: tool.sections[activeSection].content.replace(/\n/g, '<br/>') }} />
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
