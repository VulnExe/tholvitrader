'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { canAccessContent } from '@/lib/tierSystem';
import TierBadge from '@/components/ui/TierBadge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useState, useEffect } from 'react';
import { Lock, Wrench, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ToolsPage() {
    const { user, tools, fetchTools } = useStore();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    if (!user) return null;

    const publishedTools = tools.filter(t => t.published);

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Trading Tools</h1>
                        <p className="text-white/40 text-sm mt-1">{publishedTools.length} tools available</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {publishedTools.map((tool, i) => {
                        const isAccessible = canAccessContent(user.tier, tool.tierRequired);

                        return (
                            <motion.div
                                key={tool.id}
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
                                            router.push(`/tools/${tool.id}`);
                                        } else {
                                            setShowUpgrade(true);
                                        }
                                    }}
                                >
                                    {/* Thumbnail Area */}
                                    <div className={`h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center relative ${!isAccessible ? 'filter blur-[1px]' : ''}`}>
                                        <Wrench className={`w-10 h-10 ${isAccessible ? 'text-blue-400/40' : 'text-white/10'}`} />
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
                                            <TierBadge tier={tool.tierRequired} size="sm" />
                                            {tool.videoCount > 0 && (
                                                <span className="flex items-center gap-1 text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                                                    <PlayCircle className="w-3 h-3" />
                                                    {tool.videoCount} videos
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-semibold mb-1 ${isAccessible ? 'text-white group-hover:text-blue-400' : 'text-white/40'} transition-colors`}>
                                            {tool.title}
                                        </h3>
                                        <p className={`text-xs leading-relaxed line-clamp-2 ${isAccessible ? 'text-white/40' : 'text-white/20'}`}>
                                            {tool.description}
                                        </p>

                                        <button className={`mt-4 w-full py-2 rounded-lg text-xs font-medium transition-colors ${isAccessible
                                                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                                                : 'bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20'
                                            }`}>
                                            {isAccessible ? 'Open Tool' : 'Upgrade to Unlock'}
                                        </button>
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
