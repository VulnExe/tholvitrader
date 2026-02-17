import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { canAccessContent } from '@/lib/tierSystem';
import { Blog } from '@/lib/types';
import { ArrowLeft, FileText, Lock, Clock, User } from 'lucide-react';

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, getBlog } = useStore();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getBlog(id).then(data => {
                setBlog(data);
                setLoading(false);
            });
        }
    }, [id, getBlog]);

    const hasAccess = user && blog ? canAccessContent(user.tier, blog.tierRequired) : false;

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </button>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                ) : !blog ? (
                    <div className="text-center py-20">
                        <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 text-sm">Article not found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <TierBadge tier={blog.tierRequired} />
                                <span className="text-xs text-white/30 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-white/20">{blog.readTime} min read</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">{blog.title}</h1>
                            <div className="flex items-center gap-2 text-white/40">
                                <User className="w-4 h-4" />
                                <span className="text-sm">{blog.author}</span>
                            </div>
                        </div>

                        {blog.thumbnailUrl && (
                            <div className="rounded-2xl overflow-hidden border border-white/10">
                                <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-64 object-cover" />
                            </div>
                        )}

                        {!hasAccess ? (
                            <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
                                <Lock className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Content Locked</h3>
                                <p className="text-white/40 text-sm mb-2">{blog.preview}</p>
                                <p className="text-white/30 text-xs mb-6">Upgrade to {blog.tierRequired.toUpperCase()} to read the full article</p>
                                <button
                                    onClick={() => navigate('/upgrade')}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
