import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { canAccessContent } from '@/lib/tierSystem';
import { FileText, Lock, Search, Filter, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogPage() {
    const navigate = useNavigate();
    const { user, blogs, fetchBlogs, isInitialized, isAuthenticated } = useStore();
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<string>('all');

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchBlogs();
        }
    }, [isInitialized, isAuthenticated, fetchBlogs]);

    const publishedBlogs = blogs
        .filter(b => b.published)
        .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.preview.toLowerCase().includes(search.toLowerCase()))
        .filter(b => tierFilter === 'all' || b.tierRequired === tierFilter);

    return (
        <DashboardLayout>
            <div className="max-w-5xl space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="text-2xl font-bold text-white">Market Insights & Blog</h1>
                    <p className="text-white/40 text-sm mt-1">Stay updated with the latest trading insights</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search articles..."
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
                                {t === 'all' ? 'All' : t.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {publishedBlogs.map((blog, i) => {
                        const hasAccess = user ? canAccessContent(user.tier, blog.tierRequired) : false;

                        return (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                onClick={() => navigate(`/blog/${blog.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all flex gap-6 relative overflow-hidden">
                                    {!hasAccess && (
                                        <div className="absolute top-4 right-4">
                                            <Lock className="w-4 h-4 text-white/20" />
                                        </div>
                                    )}

                                    {blog.thumbnailUrl && (
                                        <div className="hidden md:block w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-white/5">
                                            <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TierBadge tier={blog.tierRequired} size="sm" />
                                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] text-white/20">{blog.readTime} min read</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">{blog.title}</h3>
                                        <p className="text-white/40 text-sm line-clamp-2">{blog.preview}</p>

                                        <div className="mt-3 flex items-center gap-2">
                                            <User className="w-3 h-3 text-white/20" />
                                            <span className="text-[10px] text-white/30 font-medium">{blog.author}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {publishedBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 text-sm">No articles found</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
