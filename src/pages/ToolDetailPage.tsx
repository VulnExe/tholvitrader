import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { canAccessContent, getTierLabel } from '@/lib/tierSystem';
import { Tool, ToolSection } from '@/lib/types';
import { ArrowLeft, Wrench, Lock, ChevronRight } from 'lucide-react';

export default function ToolDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, getTool } = useStore();
    const [tool, setTool] = useState<Tool | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<ToolSection | null>(null);

    useEffect(() => {
        if (id) {
            getTool(id).then(data => {
                setTool(data);
                if (data?.sections?.length) setActiveSection(data.sections[0]);
                setLoading(false);
            });
        }
    }, [id, getTool]);

    const hasAccess = user && tool ? canAccessContent(user.tier, tool.tierRequired) : false;

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                <button onClick={() => navigate('/tools')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tools
                </button>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                ) : !tool ? (
                    <div className="text-center py-20">
                        <Wrench className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 text-sm">Tool not found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3">
                                <TierBadge tier={tool.tierRequired} />
                                <span className="text-xs text-white/30">{tool.videoCount} sections</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">{tool.title}</h1>
                            <p className="text-white/40 text-sm">{tool.description}</p>
                        </div>

                        {!hasAccess ? (
                            <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
                                <Lock className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Content Locked</h3>
                                <p className="text-white/40 text-sm mb-6">Upgrade to {getTierLabel(tool.tierRequired)} to access this tool</p>
                                <button
                                    onClick={() => navigate('/upgrade')}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1 max-h-[600px] overflow-y-auto">
                                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider px-3 py-2">Sections</h3>
                                    {tool.sections.map((section, i) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section)}
                                            className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${activeSection?.id === section.id ? 'bg-blue-500/10 text-white border border-blue-500/20' : 'text-white/50 hover:bg-white/5'}`}
                                        >
                                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                                            <span className="text-sm font-medium line-clamp-1">{section.title}</span>
                                            {activeSection?.id === section.id && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                    {activeSection && (
                                        <>
                                            {activeSection.videoUrl && (
                                                <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video">
                                                    <video src={activeSection.videoUrl} controls className="w-full h-full" />
                                                </div>
                                            )}
                                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                <h2 className="text-lg font-bold text-white mb-4">{activeSection.title}</h2>
                                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeSection.content }} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
