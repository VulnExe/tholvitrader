import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { UserTier, Course, Tool } from '@/lib/types';
import { getTierLabel } from '@/lib/tierSystem';
import { BookOpen, Wrench, Plus, Edit, Trash2, Search, Loader2, Save, Eye, EyeOff, Star, ArrowLeft, Video, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type ContentType = 'courses' | 'tools';

export default function AdminContentPage() {
    const {
        courses, tools,
        fetchCourses, fetchTools,
        getCourse, getTool,
        addCourse, updateCourse, deleteCourse,
        addTool, updateTool, deleteTool,
        addSection, updateSection, deleteSection,
        isInitialized, isAuthenticated,
    } = useStore();

    const [activeTab, setActiveTab] = useState<ContentType>('courses');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Section Management State
    const [viewingSectionsFor, setViewingSectionsFor] = useState<Course | Tool | null>(null);
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any>(null);

    // Form state (Course/Tool)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tierRequired, setTierRequired] = useState<UserTier>('free');
    const [published, setPublished] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    // Form state (Section)
    const [sectionTitle, setSectionTitle] = useState('');
    const [sectionContent, setSectionContent] = useState('');
    const [sectionVideoUrl, setSectionVideoUrl] = useState('');
    const [sectionOrder, setSectionOrder] = useState('0');

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchCourses();
            fetchTools();
        }
    }, [isInitialized, isAuthenticated]);

    // Handle viewing sections logic
    useEffect(() => {
        if (viewingSectionsFor) {
            const refreshSections = async () => {
                if (activeTab === 'courses') {
                    const fresh = await getCourse(viewingSectionsFor.id);
                    if (fresh) setViewingSectionsFor(fresh);
                } else {
                    const fresh = await getTool(viewingSectionsFor.id);
                    if (fresh) setViewingSectionsFor(fresh);
                }
            };
            refreshSections();
        }
    }, [courses, tools]);

    const tabs = [
        { id: 'courses' as ContentType, label: 'Courses', icon: BookOpen, count: courses.length },
        { id: 'tools' as ContentType, label: 'Tools', icon: Wrench, count: tools.length },
    ];

    const getItems = () => {
        const items = activeTab === 'courses' ? courses : tools;
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
        setIsFeatured(item.isFeatured ?? false);
        setThumbnailUrl(item.thumbnailUrl || '');
        setModalOpen(true);
    };

    const resetForm = () => {
        setTitle(''); setDescription(''); setTierRequired('free'); setPublished(true); setIsFeatured(false);
        setThumbnailUrl('');
    };

    const handleSave = async () => {
        if (!title.trim()) { toast.error('Title is required'); return; }

        setSaving(true);
        let result;

        const base = {
            title,
            description,
            tierRequired,
            published,
            isFeatured,
            thumbnailUrl
        };

        if (activeTab === 'courses') {
            result = editing
                ? await updateCourse(editing.id, base)
                : await addCourse(base);
        } else {
            result = editing
                ? await updateTool(editing.id, base)
                : await addTool(base);
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
        else result = await deleteTool(id);

        if (result.success) {
            toast.success('Deleted');
        } else {
            toast.error(result.error || 'Delete failed');
        }
    };

    // --- Section Handlers ---

    const openSectionManager = async (item: Course | Tool) => {
        let fullItem;
        if (activeTab === 'courses') {
            fullItem = await getCourse(item.id);
        } else {
            fullItem = await getTool(item.id);
        }
        setViewingSectionsFor(fullItem);
    };

    const openCreateSection = () => {
        setEditingSection(null);
        setSectionTitle('');
        setSectionContent('');
        setSectionVideoUrl('');
        setSectionOrder(viewingSectionsFor ? (activeTab === 'courses' ? (viewingSectionsFor as Course).content.length : (viewingSectionsFor as Tool).sections.length).toString() : '0');
        setSectionModalOpen(true);
    };

    const openEditSection = (section: any) => {
        setEditingSection(section);
        setSectionTitle(section.title);
        setSectionContent(section.content || '');
        setSectionVideoUrl(section.videoUrl || '');
        setSectionOrder(section.orderIndex.toString());
        setSectionModalOpen(true);
    };

    const handleSaveSection = async () => {
        if (!viewingSectionsFor) return;
        if (!sectionTitle.trim()) { toast.error('Title is required'); return; }

        setSaving(true);
        const data = {
            title: sectionTitle,
            content: sectionContent,
            videoUrl: sectionVideoUrl,
            orderIndex: parseInt(sectionOrder) || 0
        };

        if (editingSection) {
            await updateSection(activeTab === 'courses' ? 'course' : 'tool', editingSection.id, data);
        } else {
            await addSection(activeTab === 'courses' ? 'course' : 'tool', viewingSectionsFor.id, data);
        }

        toast.success(editingSection ? 'Section updated' : 'Section added');
        setSectionModalOpen(false);
        setSaving(false);

        // Refresh viewing item
        if (activeTab === 'courses') {
            const fresh = await getCourse(viewingSectionsFor.id);
            if (fresh) setViewingSectionsFor(fresh);
        } else {
            const fresh = await getTool(viewingSectionsFor.id);
            if (fresh) setViewingSectionsFor(fresh);
        }
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!viewingSectionsFor || !confirm('Delete this section?')) return;
        await deleteSection(activeTab === 'courses' ? 'course' : 'tool', sectionId);
        toast.success('Section deleted');

        // Refresh viewing item
        if (activeTab === 'courses') {
            const fresh = await getCourse(viewingSectionsFor.id);
            if (fresh) setViewingSectionsFor(fresh);
        } else {
            const fresh = await getTool(viewingSectionsFor.id);
            if (fresh) setViewingSectionsFor(fresh);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl space-y-6">
                <AnimatePresence mode="wait">
                    {!viewingSectionsFor ? (
                        <motion.div
                            key="catalog"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <BookOpen className="w-6 h-6 text-purple-400" />
                                        Manage Courses & Tools
                                    </h1>
                                    <p className="text-white/40 text-sm mt-1">Create and manage your educational catalog</p>
                                </div>
                                <button
                                    onClick={openCreate}
                                    className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New
                                </button>
                            </div>

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
                                    <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-all group">
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
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => openSectionManager(item)}
                                                className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold flex items-center gap-2 hover:bg-purple-500/20 transition-all"
                                            >
                                                <LayoutList className="w-3.5 h-3.5" />
                                                Sections
                                            </button>
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sections"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setViewingSectionsFor(null)}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white truncate max-w-md">{viewingSectionsFor.title}</h1>
                                        <p className="text-white/40 text-sm">Manage sections and videos</p>
                                    </div>
                                </div>
                                <button
                                    onClick={openCreateSection}
                                    className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Section
                                </button>
                            </div>

                            <div className="space-y-3">
                                {((activeTab === 'courses' ? (viewingSectionsFor as Course).content : (viewingSectionsFor as Tool).sections) || []).map((section, idx) => (
                                    <div key={section.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/30">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{section.title}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {section.videoUrl && (
                                                        <span className="text-[10px] text-blue-400 flex items-center gap-1 font-bold italic">
                                                            <Video className="w-3 h-3" />
                                                            Video Attached
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-white/20">Order: {section.orderIndex}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditSection(section)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteSection(section.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {((activeTab === 'courses' ? (viewingSectionsFor as Course).content : (viewingSectionsFor as Tool).sections) || []).length === 0 && (
                                    <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                        <LayoutList className="w-10 h-10 text-white/5 mx-auto mb-3" />
                                        <p className="text-white/20 text-sm">No sections added yet</p>
                                        <button onClick={openCreateSection} className="mt-4 text-purple-400 text-xs font-bold hover:underline">Add your first section</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Course/Tool Modal */}
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
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Status</label>
                                <button
                                    type="button"
                                    onClick={() => setPublished(!published)}
                                    className={`w-full px-2 py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}
                                >
                                    {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    {published ? 'Live' : 'Draft'}
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Featured</label>
                                <button
                                    type="button"
                                    onClick={() => setIsFeatured(!isFeatured)}
                                    className={`w-full px-2 py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${isFeatured ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}
                                >
                                    <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-yellow-400' : ''}`} />
                                    {isFeatured ? 'Best Seller' : 'Normal'}
                                </button>
                            </div>
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

            {/* Section Modal */}
            <Modal isOpen={sectionModalOpen} onClose={() => setSectionModalOpen(false)} title={editingSection ? 'Edit Section' : 'Add Section'}>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Section Title</label>
                        <input type="text" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="Lesson Title" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Order Index</label>
                        <input type="number" value={sectionOrder} onChange={(e) => setSectionOrder(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Video URL (m3u8, mp4, etc)</label>
                        <input type="text" value={sectionVideoUrl} onChange={(e) => setSectionVideoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Content (Description/HTML)</label>
                        <textarea value={sectionContent} onChange={(e) => setSectionContent(e.target.value)} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none" placeholder="Provide detailed content here..." />
                    </div>

                    <button
                        onClick={handleSaveSection}
                        disabled={saving}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editingSection ? 'Update Section' : 'Add Section'}
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
