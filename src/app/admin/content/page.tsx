'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, BookOpen, FileText, Eye, EyeOff, Wrench, ChevronLeft, GripVertical, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserTier } from '@/lib/types';

export default function AdminContentPage() {
    const {
        courses, blogs, tools,
        fetchCourses, fetchBlogs, fetchTools,
        addCourse, updateCourse, deleteCourse,
        addBlog, updateBlog, deleteBlog,
        addTool, updateTool, deleteTool,
        addSection, updateSection, deleteSection
    } = useStore();

    const [activeTab, setActiveTab] = useState<'courses' | 'tools' | 'blogs'>('courses');
    const [viewMode, setViewMode] = useState<'list' | 'sections'>('list');
    const [selectedParent, setSelectedParent] = useState<any>(null);

    useEffect(() => {
        fetchCourses();
        fetchBlogs();
        fetchTools();
    }, [fetchCourses, fetchBlogs, fetchTools]);

    // General Form States
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [tier, setTier] = useState<UserTier>('free');
    const [videoUrl, setVideoUrl] = useState('');

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setTitle('');
        setDescription('');
        setContent('');
        setPreview('');
        setTier('free');
        setVideoUrl('');
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();

        if (viewMode === 'sections') {
            if (editingId) {
                await updateSection(activeTab === 'courses' ? 'course' : 'tool', editingId, { title, content, videoUrl });
            } else {
                const nextOrder = (selectedParent.content || selectedParent.sections || []).length;
                await addSection(activeTab === 'courses' ? 'course' : 'tool', selectedParent.id, { title, content, videoUrl, orderIndex: nextOrder });
            }
        } else {
            if (activeTab === 'courses') {
                if (editingId) await updateCourse(editingId, { title, description, tierRequired: tier });
                else await addCourse({ title, description, tierRequired: tier, published: true });
            } else if (activeTab === 'tools') {
                if (editingId) await updateTool(editingId, { title, description, tierRequired: tier });
                else await addTool({ title, description, tierRequired: tier, published: true });
            } else if (activeTab === 'blogs') {
                if (editingId) await updateBlog(editingId, { title, content, preview, tierRequired: tier });
                else await addBlog({
                    title, content,
                    preview: preview || content.slice(0, 100) + '...',
                    tierRequired: tier,
                    published: true,
                    author: 'TholviTrader',
                    readTime: Math.ceil(content.split(' ').length / 200)
                });
            }
        }
        resetForm();
        if (viewMode === 'sections') {
            // Refresh selected parent
            if (activeTab === 'courses') {
                const updated = (await useStore.getState().courses).find(c => c.id === selectedParent.id);
                setSelectedParent(updated);
            } else {
                const updated = (await useStore.getState().tools).find(t => t.id === selectedParent.id);
                setSelectedParent(updated);
            }
        }
    };

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description || '');
        setContent(item.content || '');
        setPreview(item.preview || '');
        setTier(item.tierRequired);
        setVideoUrl(item.videoUrl || '');
        setShowForm(true);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl">
                {viewMode === 'list' ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Content Management</h1>
                                <p className="text-white/40 text-sm mt-1">Manage courses, tools, and blog posts</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg w-fit mb-6">
                            {(['courses', 'tools', 'blogs'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize flex items-center gap-2 ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                                        }`}
                                >
                                    {tab === 'courses' && <BookOpen className="w-4 h-4" />}
                                    {tab === 'tools' && <Wrench className="w-4 h-4" />}
                                    {tab === 'blogs' && <FileText className="w-4 h-4" />}
                                    {tab} ({tab === 'courses' ? courses.length : tab === 'tools' ? tools.length : blogs.length})
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="mb-6 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm text-white font-medium flex items-center gap-2 hover:shadow-lg transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add {activeTab.slice(0, -1)}
                        </button>

                        <div className="space-y-3">
                            {(activeTab === 'courses' ? courses : activeTab === 'tools' ? tools : blogs).map((item: any, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="p-4 rounded-xl bg-[#111113] border border-white/5 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                        {activeTab === 'courses' && <BookOpen className="w-5 h-5 text-purple-400/50" />}
                                        {activeTab === 'tools' && <Wrench className="w-5 h-5 text-blue-400/50" />}
                                        {activeTab === 'blogs' && <FileText className="w-5 h-5 text-green-400/50" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-white/30 truncate">{item.description || item.preview}</p>
                                    </div>
                                    <TierBadge tier={item.tierRequired} size="sm" />
                                    <div className="flex items-center gap-2 shrink-0">
                                        {activeTab !== 'blogs' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedParent(item);
                                                    setViewMode('sections');
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                Manage Content
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                const updateFn = activeTab === 'courses' ? updateCourse : activeTab === 'tools' ? updateTool : updateBlog;
                                                updateFn(item.id, { published: !item.published });
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${item.published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}
                                        >
                                            {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => startEdit(item)}
                                            className="p-2 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const deleteFn = activeTab === 'courses' ? deleteCourse : activeTab === 'tools' ? deleteTool : deleteBlog;
                                                if (confirm('Are you sure you want to delete this?')) deleteFn(item.id);
                                            }}
                                            className="p-2 rounded-lg bg-red-500/5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Manage Sections View */
                    <div>
                        <button
                            onClick={() => setViewMode('list')}
                            className="flex items-center gap-2 text-white/40 hover:text-white mb-6 text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to {activeTab}
                        </button>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white">{selectedParent.title}</h1>
                                <p className="text-white/40 text-sm mt-1">Manage lessons and modules</p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Section
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(selectedParent.content || selectedParent.sections || []).length === 0 ? (
                                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                    <PlayCircle className="w-12 h-12 text-white/5 mx-auto mb-3" />
                                    <p className="text-white/20">No sections added yet</p>
                                </div>
                            ) : (
                                (selectedParent.content || selectedParent.sections).map((section: any, i: number) => (
                                    <motion.div
                                        key={section.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-xl bg-[#111113] border border-white/5 flex items-center gap-4 group"
                                    >
                                        <GripVertical className="w-4 h-4 text-white/10 group-hover:text-white/30 cursor-grab" />
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-white/40 font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium">{section.title}</p>
                                            {section.videoUrl && (
                                                <p className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
                                                    <PlayCircle className="w-3 h-3" /> Video Linked
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEdit(section)}
                                                className="p-2 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this section?')) {
                                                        deleteSection(activeTab === 'courses' ? 'course' : 'tool', section.id);
                                                        // Refresh selectedParent local state
                                                        const updatedParent = { ...selectedParent };
                                                        if (updatedParent.content) updatedParent.content = updatedParent.content.filter((s: any) => s.id !== section.id);
                                                        if (updatedParent.sections) updatedParent.sections = updatedParent.sections.filter((s: any) => s.id !== section.id);
                                                        setSelectedParent(updatedParent);
                                                    }
                                                }}
                                                className="p-2 rounded-lg bg-red-500/5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={`${editingId ? 'Edit' : 'Add'} ${viewMode === 'sections' ? 'Section' : activeTab.slice(0, -1)}`}
                size="lg"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                        />
                    </div>

                    {(activeTab !== 'blogs' || viewMode === 'sections') ? (
                        <>
                            {viewMode !== 'sections' && (
                                <div>
                                    <label className="block text-sm font-medium text-white/50 mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm resize-none"
                                    />
                                </div>
                            )}
                            {viewMode === 'sections' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-white/50 mb-2">YouTube Video Link</label>
                                        <div className="relative">
                                            <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                type="text"
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/50 mb-2">Section Content (Markdown)</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={8}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm resize-none"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Preview Text</label>
                                <input
                                    type="text"
                                    value={preview}
                                    onChange={(e) => setPreview(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Full Content (Markdown)</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={8}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm resize-none"
                                />
                            </div>
                        </>
                    )}

                    {viewMode !== 'sections' && (
                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Required Tier</label>
                            <select
                                value={tier}
                                onChange={(e) => setTier(e.target.value as UserTier)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                            >
                                <option value="free">Free</option>
                                <option value="tier1">Tier 1</option>
                                <option value="tier2">Tier 2</option>
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={resetForm} className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white/50 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm text-white font-medium hover:shadow-lg transition-all">
                            {editingId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
