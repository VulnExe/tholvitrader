import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { canAccessContent, getTierLabel } from '@/lib/tierSystem';
import { Wrench, Lock, Search, Filter, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolsPage() {
    const navigate = useNavigate();
    const { user, tools, fetchTools, isInitialized, isAuthenticated } = useStore();
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<string>('all');

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchTools();
        }
    }, [isInitialized, isAuthenticated, fetchTools]);

    const publishedTools = tools
        .filter(t => t.published)
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
        .filter(t => tierFilter === 'all' || t.tierRequired === tierFilter);

    return (
        <DashboardLayout>
            <div className="max-w-5xl space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="text-2xl font-bold text-white">Tools</h1>
                    <p className="text-white/40 text-sm mt-1">Access premium crack tools</p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tools..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-white/20" />
                        {['all', 'free', 'tier1', 'tier2'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTierFilter(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tierFilter === t ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}
                            >
                                {t === 'all' ? 'All' : getTierLabel(t as any)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {publishedTools.map((tool, i) => {
                        const hasAccess = user ? canAccessContent(user.tier, tool.tierRequired) : false;

                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                onClick={() => navigate(`/tools/${tool.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all h-full flex flex-col relative overflow-hidden">
                                    {!hasAccess && (
                                        <div className="absolute top-4 right-4">
                                            <Lock className="w-4 h-4 text-white/20" />
                                        </div>
                                    )}

                                    {tool.thumbnailUrl && (
                                        <div className="mb-4 rounded-xl overflow-hidden h-32 bg-white/5">
                                            <img src={tool.thumbnailUrl} alt={tool.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-3">
                                        <TierBadge tier={tool.tierRequired} size="sm" />
                                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(tool.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">{tool.title}</h3>
                                    <p className="text-white/40 text-xs line-clamp-2 leading-relaxed mb-3">{tool.description}</p>



                                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Wrench className="w-3 h-3" />
                                            {tool.videoCount} sections
                                        </span>
                                        {hasAccess ? (
                                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Access</span>
                                        ) : (
                                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Locked</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {publishedTools.length === 0 && (
                    <div className="text-center py-20">
                        <Wrench className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 text-sm">No tools found</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
