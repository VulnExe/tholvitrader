'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, BookOpen, FileText, Eye, EyeOff, Wrench, ChevronRight, PlayCircle, Video, Loader2, Settings, ListTree, ShieldCheck, Youtube, Upload, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserTier } from '@/lib/types';

type AdminTab = 'courses' | 'tools' | 'blogs';
type EditMode = 'settings' | 'curriculum' | 'security';

export default function AdminContentPage() {
    const {
        courses, blogs, tools,
        fetchCourses, fetchBlogs, fetchTools,
        getCourse, getTool, getBlog,
        addCourse, updateCourse, deleteCourse,
        addBlog, updateBlog, deleteBlog,
        addTool, updateTool, deleteTool,
        addSection, updateSection, deleteSection
    } = useStore();

    const [activeTab, setActiveTab] = useState<AdminTab>('courses');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchBlogs();
        fetchTools();
    }, [fetchCourses, fetchBlogs, fetchTools]);

    // Modal & Editing State
    const [showModal, setShowModal] = useState(false);
    const [editSidebar, setEditSidebar] = useState<EditMode>('settings');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form Fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [tier, setTier] = useState<UserTier>('free');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [published, setPublished] = useState(true);

    // Section Form Fields (Nested)
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [sectionTitle, setSectionTitle] = useState('');
    const [sectionContent, setSectionContent] = useState('');
    const [sectionVideoUrl, setSectionVideoUrl] = useState('');
    const [videoType, setVideoType] = useState<'youtube' | 'upload'>('youtube');

    const resetForms = () => {
        setEditingItem(null);
        setTitle('');
        setDescription('');
        setContent('');
        setPreview('');
        setTier('free');
        setThumbnailUrl('');
        setPublished(true);
        setEditSidebar('settings');
        setShowModal(false);
    };

    const resetSectionForm = () => {
        setEditingSectionId(null);
        setSectionTitle('');
        setSectionContent('');
        setSectionVideoUrl('');
        setVideoType('youtube');
        setShowSectionForm(false);
    };

    const handleCreateNew = () => {
        resetForms();
        setShowModal(true);
    };

    const handleEditItem = async (item: any) => {
        setIsLoading(true);
        let fullItem = item;
        if (activeTab === 'courses') fullItem = await getCourse(item.id);
        else if (activeTab === 'tools') fullItem = await getTool(item.id);
        else fullItem = await getBlog(item.id);

        setEditingItem(fullItem);
        setTitle(fullItem.title);
        setDescription(fullItem.description || '');
        setPreview(fullItem.preview || '');
        setContent(fullItem.content || '');
        setTier(fullItem.tierRequired || 'free');
        setThumbnailUrl(fullItem.thumbnailUrl || '');
        setPublished(fullItem.published);

        setIsLoading(false);
        setShowModal(true);
    };

    const handleSaveMain = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data: any = {
            title,
            thumbnailUrl,
            tierRequired: tier,
            published
        };

        if (activeTab === 'blogs') {
            data.content = content;
            data.preview = preview;
            data.author = 'TholviTrader';
            data.readTime = Math.ceil(content.split(' ').length / 200);
        } else {
            data.description = description;
        }

        if (editingItem) {
            if (activeTab === 'courses') await updateCourse(editingItem.id, data);
            else if (activeTab === 'tools') await updateTool(editingItem.id, data);
            else await updateBlog(editingItem.id, data);
        } else {
            if (activeTab === 'courses') await addCourse(data);
            else if (activeTab === 'tools') await addTool(data);
            else await addBlog(data);
        }

        setIsSaving(false);
        resetForms();
    };

    const handleSaveSection = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        const sectionData = {
            title: sectionTitle,
            content: sectionContent,
            videoUrl: sectionVideoUrl
        };

        if (editingSectionId) {
            await updateSection(activeTab === 'courses' ? 'course' : 'tool', editingSectionId, sectionData);
        } else {
            const nextOrder = (editingItem.sections || editingItem.content || []).length;
            await addSection(activeTab === 'courses' ? 'course' : 'tool', editingItem.id, { ...sectionData, orderIndex: nextOrder });
        }

        // Refresh editing item to show new sections
        const updated = activeTab === 'courses' ? await getCourse(editingItem.id) : await getTool(editingItem.id);
        setEditingItem(updated);
        resetSectionForm();
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Content Control</h1>
                        <p className="text-white/40 text-sm mt-1 font-medium">Manage your institutional knowledge and software assets.</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm text-white font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-purple-500/30 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Create {activeTab.slice(0, -1)}
                    </button>
                </div>

                {/* Tabs Area */}
                <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl w-fit mb-8 border border-white/5">
                    {(['courses', 'tools', 'blogs'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize flex items-center gap-2.5 ${activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            {tab === 'courses' && <BookOpen className="w-4 h-4" />}
                            {tab === 'tools' && <Wrench className="w-4 h-4" />}
                            {tab === 'blogs' && <FileText className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {(activeTab === 'courses' ? courses : activeTab === 'tools' ? tools : blogs).map((item: any, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-5 rounded-2xl bg-[#0d0d0f]/80 border border-white/5 flex items-center gap-6 hover:bg-[#111113] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="w-20 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 shrink-0">
                                {item.thumbnailUrl ? (
                                    <img src={item.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                        {activeTab === 'courses' && <BookOpen className="w-6 h-6" />}
                                        {activeTab === 'tools' && <Wrench className="w-6 h-6" />}
                                        {activeTab === 'blogs' && <FileText className="w-6 h-6" />}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <TierBadge tier={item.tierRequired} size="sm" />
                                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest border-l border-white/10 pl-3">
                                        {activeTab === 'blogs' ? `${item.readTime} min read` : `${item.videoCount || 0} Modules`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEditItem(item)}
                                    className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        const updateFn = activeTab === 'courses' ? updateCourse : activeTab === 'tools' ? updateTool : updateBlog;
                                        updateFn(item.id, { published: !item.published });
                                    }}
                                    className={`p-3 rounded-xl transition-all ${item.published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}
                                >
                                    {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        const deleteFn = activeTab === 'courses' ? deleteCourse : activeTab === 'tools' ? deleteTool : deleteBlog;
                                        if (confirm('Permanently delete this item?')) deleteFn(item.id);
                                    }}
                                    className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Empty State */}
                    {(activeTab === 'courses' ? courses : activeTab === 'tools' ? tools : blogs).length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <Plus className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No {activeTab} created yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN EDITING MODAL */}
            <Modal
                isOpen={showModal}
                onClose={resetForms}
                title={editingItem ? `Edit ${activeTab.slice(0, -1)}` : `New ${activeTab.slice(0, -1)}`}
                size="xxl"
            >
                <div className="flex flex-col md:flex-row h-[70vh] -m-6 divide-x divide-white/5">
                    {/* Sidebar Nav */}
                    <div className="w-full md:w-64 bg-white/[0.01] p-6 space-y-2 shrink-0">
                        <button
                            onClick={() => setEditSidebar('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${editSidebar === 'settings' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                        >
                            <Settings className="w-4 h-4" />
                            General Settings
                        </button>

                        {activeTab !== 'blogs' && editingItem && (
                            <button
                                onClick={() => setEditSidebar('curriculum')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${editSidebar === 'curriculum' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                            >
                                <ListTree className="w-4 h-4" />
                                Curriculum (Modules)
                            </button>
                        )}

                        <button
                            onClick={() => setEditSidebar('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${editSidebar === 'security' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Access & Security
                        </button>

                        <div className="pt-10">
                            {editingItem ? (
                                <button
                                    onClick={handleSaveMain}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveMain}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 active:scale-95 transition-all text-center"
                                >
                                    Initialize Item
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-[#0d0d0f]">
                        <AnimatePresence mode="wait">
                            {editSidebar === 'settings' && (
                                <motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Internal Identifier</label>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Enter name..."
                                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 text-lg font-bold"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Display Description</label>
                                                <textarea
                                                    value={activeTab === 'blogs' ? preview : description}
                                                    onChange={(e) => activeTab === 'blogs' ? setPreview(e.target.value) : setDescription(e.target.value)}
                                                    rows={5}
                                                    placeholder="Brief overview..."
                                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 text-sm resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Creative Asset (Cover)</label>
                                                <FileUpload
                                                    label=""
                                                    type="image"
                                                    accept="image/*"
                                                    value={thumbnailUrl}
                                                    onUploadComplete={setThumbnailUrl}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {activeTab === 'blogs' && (
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Article Body (Markdown)</label>
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={12}
                                                placeholder="# Write your masterpiece..."
                                                className="w-full px-6 py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-mono text-sm resize-none"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {editSidebar === 'curriculum' && editingItem && (
                                <motion.div key="curriculum" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Institutional Modules</h2>
                                            <p className="text-white/30 text-xs mt-1">Structure your lessons in sequential order.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowSectionForm(true)}
                                            className="px-4 py-2 bg-white/5 rounded-xl text-xs text-white/60 font-bold hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                        >
                                            Add New Lesson
                                        </button>
                                    </div>

                                    <div className="grid gap-3">
                                        {((editingItem.sections || editingItem.content || [])).map((section: any, idx: number) => (
                                            <div key={section.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:bg-white/5 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-white/30">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-bold">{section.title}</p>
                                                    {section.videoUrl && (
                                                        <p className="text-[9px] text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5 mt-1">
                                                            <Youtube className="w-3 h-3" /> Secure Video Attached
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSectionId(section.id);
                                                            setSectionTitle(section.title);
                                                            setSectionContent(section.content || '');
                                                            setSectionVideoUrl(section.videoUrl || '');
                                                            setVideoType(section.videoUrl?.includes('youtube') ? 'youtube' : 'upload');
                                                            setShowSectionForm(true);
                                                        }}
                                                        className="p-2.5 rounded-lg bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Delete this lesson?')) {
                                                                await deleteSection(activeTab === 'courses' ? 'course' : 'tool', section.id);
                                                                const updated = activeTab === 'courses' ? await getCourse(editingItem.id) : await getTool(editingItem.id);
                                                                setEditingItem(updated);
                                                            }
                                                        }}
                                                        className="p-2.5 rounded-lg bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {(!editingItem.sections && !editingItem.content) && (
                                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                <ListTree className="w-10 h-10 text-white/5 mx-auto mb-3" />
                                                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No modules implemented yet</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {editSidebar === 'security' && (
                                <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Required Access Level</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {(['free', 'tier1', 'tier2'] as UserTier[]).map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTier(t)}
                                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${tier === t ? 'border-purple-600 bg-purple-600/10 text-white' : 'border-white/5 bg-white/5 text-white/30 hover:border-white/10'}`}
                                                >
                                                    <TierBadge tier={t} className="mb-3" />
                                                    <p className="text-[10px] uppercase font-black tracking-widest leading-loose">
                                                        {t === 'free' ? 'Open to everyone in the community' : t === 'tier1' ? 'Exclusive to Premium Subscribers' : 'Restricted to Inner Circle members'}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${published ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {published ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">Visibility Status</h4>
                                                <p className="text-xs text-white/40">Toggle whether this item is visible on the frontend.</p>
                                            </div>
                                            <div className="ml-auto">
                                                <button
                                                    onClick={() => setPublished(!published)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${published ? 'bg-white/5 text-white/40' : 'bg-green-600 text-white shadow-xl'}`}
                                                >
                                                    {published ? 'Unpublish' : 'Publish Content'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Modal>

            {/* NESTED LESSON FORM */}
            <Modal
                isOpen={showSectionForm}
                onClose={resetSectionForm}
                title={editingSectionId ? 'Update Lesson' : 'Implement New Lesson'}
                size="lg"
            >
                <form onSubmit={handleSaveSection} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Lesson Heading</label>
                        <input
                            type="text"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            required
                            placeholder="Chapter name..."
                            className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 text-base font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Video Infrastructure</label>

                        {/* Video Type Selector */}
                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit mb-4">
                            <button
                                type="button"
                                onClick={() => setVideoType('youtube')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${videoType === 'youtube' ? 'bg-red-600 text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                <Youtube className="w-4 h-4" /> Youtube Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setVideoType('upload')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${videoType === 'upload' ? 'bg-purple-600 text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                <Upload className="w-4 h-4" /> Secure Upload
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {videoType === 'youtube' ? (
                                <motion.div key="yt" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                    <div className="relative">
                                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            value={sectionVideoUrl}
                                            onChange={(e) => setSectionVideoUrl(e.target.value)}
                                            placeholder="Paste YouTube watch link..."
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-red-500/50 text-sm"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="up" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                    <FileUpload
                                        label=""
                                        type="video"
                                        accept="video/*"
                                        value={sectionVideoUrl}
                                        onUploadComplete={setSectionVideoUrl}
                                        bucket="videos"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Lesson Narrative (Markdown)</label>
                        <textarea
                            value={sectionContent}
                            onChange={(e) => setSectionContent(e.target.value)}
                            rows={8}
                            placeholder="# Lesson notes..."
                            className="w-full px-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-mono resize-none focus:border-purple-500/30 outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button type="button" onClick={resetSectionForm} className="px-6 py-3 text-sm font-bold text-white/20 hover:text-white/60 transition-colors">Discard</button>
                        <button type="submit" className="flex-1 py-3 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all">
                            Commit Lesson
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
