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
    ArrowLeft,
    ArrowRight,
    Wrench,
    Youtube,
    Calendar,
    Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, getTool } = useStore();
    const [tool, setTool] = useState<any>(null);
    const [activeSection, setActiveSection] = useState(0);
    const [showUpgrade, setShowUpgrade] = useState(false);
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

    const sections = tool.sections || [];
    const isAccessible = canAccessContent(user.tier, tool.tierRequired);
    const currentSection = sections[activeSection];

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
                    Back to Tools
                </button>

                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <Wrench className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <TierBadge tier={tool.tierRequired} size="sm" />
                                    <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Premium Tool</span>
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">{tool.title}</h1>
                            </div>
                        </motion.div>
                        <p className="text-white/40 max-w-2xl text-sm leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="flex items-center gap-6 pb-2">
                        <div className="text-right">
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1">Last Update</p>
                            <p className="text-sm text-white/60 font-medium flex items-center gap-2 justify-end">
                                <Calendar className="w-3 h-3" /> {new Date(tool.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1">Modules</p>
                            <p className="text-sm text-white/60 font-medium flex items-center gap-2 justify-end">
                                <Layers className="w-3 h-3" /> {sections.length} Parts
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {isAccessible ? (
                            <div className="space-y-6">
                                {/* Video Player */}
                                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 relative group shadow-2xl">
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
                                                <p className="text-white/30 text-sm">External Resource</p>
                                                <a href={currentSection.videoUrl} target="_blank" className="px-6 py-2 bg-blue-600 rounded-xl text-xs text-white font-bold hover:bg-blue-500 transition-all">Launch Video</a>
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c]">
                                            <PlayCircle className="w-16 h-16 text-white/5 mb-4" />
                                            <p className="text-white/20 text-sm font-medium">Guide Implementation</p>
                                        </div>
                                    )}
                                </div>

                                {/* Section Title */}
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">{currentSection?.title}</h2>
                                        <p className="text-xs text-white/30 italic">Module {activeSection + 1} Technical Specifications</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={activeSection === 0}
                                            onClick={() => setActiveSection(s => s - 1)}
                                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white disabled:opacity-10 transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            disabled={activeSection === sections.length - 1}
                                            onClick={() => setActiveSection(s => s + 1)}
                                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white disabled:opacity-10 transition-all"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 rounded-3xl bg-[#111113] border border-white/5 prose prose-invert max-w-none shadow-xl">
                                    <div dangerouslySetInnerHTML={{ __html: currentSection?.content.replace(/\n/g, '<br/>') || 'Consult the documentation for implementation details.' }} />
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 rounded-3xl bg-gradient-to-br from-[#111113] to-black border border-white/5 text-center shadow-2xl">
                                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-8 ring-8 ring-blue-500/5">
                                    <Lock className="w-10 h-10 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Tool Access Restricted</h3>
                                <p className="text-white/40 mb-10 max-w-md mx-auto leading-relaxed">
                                    This trading tool requires a membership level of <strong>{tool.tierRequired.toUpperCase()}</strong>. Complete your upgrade to unlock.
                                </p>
                                <button
                                    onClick={() => setShowUpgrade(true)}
                                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
                                >
                                    Upgrade Your Tier
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Modules */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl overflow-hidden sticky top-24 shadow-2xl">
                            <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Technical Modules</p>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="p-2 space-y-1">
                                {sections.map((section: any, i: number) => (
                                    <button
                                        key={section.id}
                                        onClick={() => isAccessible && setActiveSection(i)}
                                        className={`
                      w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all
                      ${activeSection === i ? 'bg-white/[0.05] text-white shadow-xl' : 'text-white/30 hover:bg-white/[0.02] hover:text-white/60'}
                      ${!isAccessible ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                    `}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all ${activeSection === i ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-white/10'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <p className="text-xs font-bold truncate flex-1">{section.title}</p>
                                        {activeSection === i && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
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
