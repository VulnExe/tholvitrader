import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { UserTier } from '@/lib/types';
import { getTierLabel } from '@/lib/tierSystem';
import { BookOpen, Wrench, FileText, Plus, Edit, Trash2, Search, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type ContentType = 'courses' | 'tools' | 'blogs';

export default function AdminContentPage() {
    const {
        courses, tools, blogs,
        fetchCourses, fetchTools, fetchBlogs,
        addCourse, updateCourse, deleteCourse,
        addTool, updateTool, deleteTool,
        addBlog, updateBlog, deleteBlog,
        isInitialized, isAuthenticated,
    } = useStore();

    const [activeTab, setActiveTab] = useState<ContentType>('courses');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tierRequired, setTierRequired] = useState<UserTier>('free');
    const [published, setPublished] = useState(true);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    // Blog extras
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [author, setAuthor] = useState('');
    const [readTime, setReadTime] = useState(5);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchCourses();
            fetchTools();
            fetchBlogs();
        }
    }, [isInitialized, isAuthenticated]);

    const tabs = [
        { id: 'courses' as ContentType, label: 'Courses', icon: BookOpen, count: courses.length },
        { id: 'tools' as ContentType, label: 'Tools', icon: Wrench, count: tools.length },
        { id: 'blogs' as ContentType, label: 'Blog', icon: FileText, count: blogs.length },
    ];

    const getItems = () => {
        const items = activeTab === 'courses' ? courses : activeTab === 'tools' ? tools : blogs;
        return items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
    };

    const openCreate = () => {
        setEditing(null);
        resetForm();
        setModalOpen(true);
    };

    const openEdit = (item: any) => {
        setEditing(item);
        setTitle(item.title || '');
        setDescription(item.description || '');
        setTierRequired(item.tierRequired || 'free');
        setPublished(item.published ?? true);
        setThumbnailUrl(item.thumbnailUrl || '');
        setContent(item.content || '');
        setPreview(item.preview || '');
        setAuthor(item.author || '');
        setReadTime(item.readTime || 5);
        setModalOpen(true);
    };

    const resetForm = () => {
        setTitle(''); setDescription(''); setTierRequired('free'); setPublished(true);
        setThumbnailUrl(''); setContent(''); setPreview(''); setAuthor(''); setReadTime(5);
    };

    const handleSave = async () => {
        if (!title.trim()) { toast.error('Title is required'); return; }

        setSaving(true);
        let result;

        const base = { title, description, tierRequired, published, thumbnailUrl };

        if (activeTab === 'courses') {
            result = editing
                ? await updateCourse(editing.id, base)
                : await addCourse(base);
        } else if (activeTab === 'tools') {
            result = editing
                ? await updateTool(editing.id, base)
                : await addTool(base);
        } else {
            const blogData = { ...base, content, preview, author, readTime };
            result = editing
                ? await updateBlog(editing.id, blogData)
                : await addBlog(blogData);
        }

        if (result.success) {
            toast.success(editing ? 'Updated successfully' : 'Created successfully');
            setModalOpen(false);
            resetForm();
        } else {
            toast.error(result.error || 'Operation failed');
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This cannot be undone.')) return;

        let result;
        if (activeTab === 'courses') result = await deleteCourse(id);
        else if (activeTab === 'tools') result = await deleteTool(id);
        else result = await deleteBlog(id);

        if (result.success) {
            toast.success('Deleted');
        } else {
            toast.error(result.error || 'Delete failed');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-purple-400" />
                            Manage Content
                        </h1>
                        <p className="text-white/40 text-sm mt-1">Create and manage courses, tools, and blog posts</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add New
                    </button>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-white/5 pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white/5 text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/60'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${activeTab}...`}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>

                {/* Items */}
                <div className="space-y-2">
                    {getItems().map(item => (
                        <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-all">
                            <div className="flex items-center gap-4 min-w-0">
                                {item.thumbnailUrl && (
                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                        <TierBadge tier={item.tierRequired} size="sm" />
                                    </div>
                                    <p className="text-[11px] text-white/30 truncate">
                                        {activeTab === 'blogs' ? (item as any).preview : (item as any).description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                                    {item.published ? 'Live' : 'Draft'}
                                </span>
                                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {getItems().length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 text-sm">No {activeTab} found</p>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${activeTab.slice(0, -1)}` : `Create ${activeTab.slice(0, -1)}`}>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Tier</label>
                            <select value={tierRequired} onChange={(e) => setTierRequired(e.target.value as UserTier)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all">
                                {['free', 'tier1', 'tier2'].map((t) => (
                                    <option key={t} value={t}>{getTierLabel(t as UserTier)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Status</label>
                            <button
                                type="button"
                                onClick={() => setPublished(!published)}
                                className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}
                            >
                                {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {published ? 'Published' : 'Draft'}
                            </button>
                        </div>
                    </div>

                    <FileUpload
                        label="Thumbnail"
                        onUploadComplete={setThumbnailUrl}
                        value={thumbnailUrl}
                        type="image"
                        accept="image/*"
                        bucket="thumbnails"
                    />

                    {activeTab === 'blogs' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Preview Text</label>
                                <textarea value={preview} onChange={(e) => setPreview(e.target.value)} rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Content (HTML)</label>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500/50 transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Author</label>
                                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Read Time (min)</label>
                                    <input type="number" value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editing ? 'Update' : 'Create'}
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
