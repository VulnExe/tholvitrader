'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Payment, Course, Blog, Tool, UserTier, PaymentStatus, Notification } from './types';
import { supabase } from './supabase';

interface AppStore {
    // Auth
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    checkAuth: () => Promise<void>;
    initAuth: () => () => void;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;

    // Courses
    courses: Course[];
    fetchCourses: () => Promise<void>;
    getCourse: (id: string) => Promise<Course | null>;
    addCourse: (course: any) => Promise<void>;
    updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;

    // Tools
    tools: Tool[];
    fetchTools: () => Promise<void>;
    getTool: (id: string) => Promise<Tool | null>;
    addTool: (tool: any) => Promise<void>;
    updateTool: (id: string, data: Partial<Tool>) => Promise<void>;
    deleteTool: (id: string) => Promise<void>;

    // Blogs
    blogs: Blog[];
    fetchBlogs: () => Promise<void>;
    getBlog: (id: string) => Promise<Blog | null>;
    addBlog: (blog: any) => Promise<void>;
    updateBlog: (id: string, data: Partial<Blog>) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;

    // Payments
    payments: Payment[];
    fetchPayments: () => Promise<void>;
    submitPayment: (tierRequested: UserTier, transactionId: string, screenshotUrl: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
    reviewPayment: (paymentId: string, status: PaymentStatus, rejectionReason?: string) => Promise<void>;

    // Users Admin
    allUsers: User[];
    fetchAllUsers: () => Promise<void>;
    updateUserTier: (userId: string, tier: UserTier) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
    unbanUser: (userId: string) => Promise<void>;
    setTelegramAccess: (userId: string, access: boolean) => Promise<void>;

    // Notifications
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;

    // Admin Stats
    adminStats: {
        totalUsers: number;
        freeUsers: number;
        tier1Users: number;
        tier2Users: number;
        conversionRate: number;
        userGrowth: { date: string; count: number }[];
    };
    fetchAdminStats: () => Promise<void>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    siteSettings: {
        id: string;
        binanceQrUrl: string;
        binanceId: string;
        telegramBotLink: string;
        telegramChannelLink: string;
    };
    fetchSiteSettings: () => Promise<void>;
    updateSiteSettings: (data: any) => Promise<void>;

    // Section Management
    addSection: (type: 'course' | 'tool', parentId: string, data: any) => Promise<void>;
    updateSection: (type: 'course' | 'tool', sectionId: string, data: any) => Promise<void>;
    deleteSection: (type: 'course' | 'tool', sectionId: string) => Promise<void>;

    // Storage
    uploadFile: (bucket: string, path: string, file: File) => Promise<{ publicUrl: string | null; error?: string }>;
}

export const useStore = create<AppStore>()(
    persist(
        (set, get) => ({
            // Initial Auth State
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,

            // Initial Data State
            courses: [],
            tools: [],
            blogs: [],
            payments: [],
            allUsers: [],
            notifications: [],
            adminStats: {
                totalUsers: 0,
                freeUsers: 0,
                tier1Users: 0,
                tier2Users: 0,
                conversionRate: 0,
                userGrowth: []
            },
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),
            siteSettings: {
                id: 'main',
                binanceQrUrl: '',
                binanceId: '',
                telegramBotLink: '',
                telegramChannelLink: ''
            },


            // Auth Actions
            initAuth: () => {
                const { checkAuth } = get();

                // Initial check
                checkAuth();

                // Listen for changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    if (session) {
                        await checkAuth();
                    } else if (event === 'SIGNED_OUT') {
                        set({ user: null, isAuthenticated: false });
                    }
                });

                return () => subscription.unsubscribe();
            },

            checkAuth: async () => {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    let { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    // Failsafe: If profile doesn't exist (common for new OAuth users), create it
                    if (!profile) {
                        const { data: newProfile, error: insertError } = await supabase
                            .from('profiles')
                            .insert({
                                id: session.user.id,
                                email: session.user.email!,
                                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
                            })
                            .select()
                            .single();

                        if (newProfile) {
                            profile = newProfile;
                        } else {
                            // If still no profile, at least set basic user info so UI doesn't break
                            set({
                                user: {
                                    id: session.user.id,
                                    email: session.user.email!,
                                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
                                    tier: 'free',
                                    role: 'user',
                                    telegramUsername: '',
                                    telegramAccess: false,
                                    banned: false,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                },
                                isAuthenticated: true
                            });
                            return;
                        }
                    }

                    if (profile) {
                        set({
                            user: {
                                id: profile.id,
                                email: profile.email,
                                name: profile.name,
                                tier: profile.tier as UserTier,
                                role: profile.role,
                                telegramUsername: profile.telegram_username,
                                telegramAccess: profile.telegram_access,
                                banned: profile.banned,
                                createdAt: profile.created_at,
                                updatedAt: profile.updated_at
                            },
                            isAuthenticated: true
                        });
                    }
                } else {
                    set({ user: null, isAuthenticated: false });
                }

                set({ isInitialized: true });
            },

            login: async (email, password) => {
                set({ isLoading: true });
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    set({ isLoading: false });
                    return { success: false, error: error.message };
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profile?.banned) {
                    await supabase.auth.signOut();
                    set({ isLoading: false });
                    return { success: false, error: 'Your account has been suspended.' };
                }

                if (profile) {
                    set({
                        user: {
                            id: profile.id,
                            email: profile.email,
                            name: profile.name,
                            tier: profile.tier as UserTier,
                            role: profile.role,
                            telegramUsername: profile.telegram_username,
                            telegramAccess: profile.telegram_access,
                            banned: profile.banned,
                            createdAt: profile.created_at,
                            updatedAt: profile.updated_at
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                    return { success: true };
                }

                set({ isLoading: false });
                return { success: false, error: 'Profile not found.' };
            },

            signInWithGoogle: async () => {
                set({ isLoading: true });
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/dashboard`
                    }
                });

                if (error) {
                    set({ isLoading: false });
                    return { success: false, error: error.message };
                }

                // Return success immediately as OAuth triggers a redirect
                return { success: true };
            },

            signup: async (email, password, name) => {
                set({ isLoading: true });
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name } }
                });

                if (error) {
                    set({ isLoading: false });
                    return { success: false, error: error.message };
                }

                if (data.user) {
                    set({ isLoading: false });
                    return { success: true };
                }

                set({ isLoading: false });
                return { success: false, error: 'Signup failed.' };
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
                window.location.href = '/auth/login';
            },

            updateProfile: async (data) => {
                const { user } = get();
                if (!user) return { success: false, error: 'Not authenticated' };

                const { error } = await supabase
                    .from('profiles')
                    .update({
                        name: data.name,
                        telegram_username: data.telegramUsername,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (error) return { success: false, error: error.message };

                set({ user: { ...user, ...data } });
                return { success: true };
            },

            changePassword: async (oldPassword, newPassword) => {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) return { success: false, error: error.message };
                return { success: true };
            },

            // Course Actions
            fetchCourses: async () => {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) {
                    const mappedCourses: Course[] = data.map(c => ({
                        id: c.id,
                        title: c.title,
                        description: c.description,
                        tierRequired: c.tier_required as UserTier,
                        thumbnailUrl: c.thumbnail_url,
                        videoCount: c.video_count || 0,
                        published: c.published,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                        content: [] // No sections in bulk fetch
                    }));
                    set({ courses: mappedCourses });
                }
            },

            getCourse: async (id) => {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*, sections:course_sections(*)')
                    .eq('id', id)
                    .single();

                if (data) {
                    return {
                        id: data.id,
                        title: data.title,
                        description: data.description,
                        tierRequired: data.tier_required as UserTier,
                        thumbnailUrl: data.thumbnail_url,
                        videoCount: data.video_count || 0,
                        published: data.published,
                        createdAt: data.created_at,
                        updatedAt: data.updated_at,
                        content: data.sections.map((s: any) => ({
                            id: s.id,
                            courseId: s.course_id,
                            title: s.title,
                            content: s.content,
                            videoUrl: s.video_url,
                            orderIndex: s.order_index
                        })).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                    };
                }
                return null;
            },

            addCourse: async (courseData) => {
                const { data, error } = await supabase
                    .from('courses')
                    .insert({
                        title: courseData.title,
                        description: courseData.description,
                        tier_required: courseData.tierRequired,
                        thumbnail_url: courseData.thumbnailUrl,
                        published: courseData.published
                    })
                    .select()
                    .single();

                if (data) await get().fetchCourses();
            },

            updateCourse: async (id, data) => {
                await supabase.from('courses').update({
                    title: data.title,
                    description: data.description,
                    tier_required: data.tierRequired,
                    thumbnail_url: data.thumbnailUrl,
                    published: data.published,
                    updated_at: new Date().toISOString()
                }).eq('id', id);
                await get().fetchCourses();
            },

            deleteCourse: async (id) => {
                await supabase.from('courses').delete().eq('id', id);
                await get().fetchCourses();
            },

            // Tool Actions
            fetchTools: async () => {
                const { data, error } = await supabase
                    .from('tools')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) {
                    const mappedTools: Tool[] = data.map(t => ({
                        id: t.id,
                        title: t.title,
                        description: t.description,
                        tierRequired: t.tier_required as UserTier,
                        thumbnailUrl: t.thumbnail_url,
                        videoCount: t.video_count || 0,
                        published: t.published,
                        createdAt: t.created_at,
                        updatedAt: t.updated_at,
                        sections: [] // No sections in bulk fetch
                    }));
                    set({ tools: mappedTools });
                }
            },

            getTool: async (id) => {
                const { data, error } = await supabase
                    .from('tools')
                    .select('*, sections:tool_sections(*)')
                    .eq('id', id)
                    .single();

                if (data) {
                    return {
                        id: data.id,
                        title: data.title,
                        description: data.description,
                        tierRequired: data.tier_required as UserTier,
                        thumbnailUrl: data.thumbnail_url,
                        videoCount: data.video_count || 0,
                        published: data.published,
                        createdAt: data.created_at,
                        updatedAt: data.updated_at,
                        sections: data.sections.map((s: any) => ({
                            id: s.id,
                            toolId: s.tool_id,
                            title: s.title,
                            content: s.content,
                            videoUrl: s.video_url,
                            orderIndex: s.order_index
                        })).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                    };
                }
                return null;
            },

            addTool: async (toolData) => {
                await supabase.from('tools').insert({
                    title: toolData.title,
                    description: toolData.description,
                    tier_required: toolData.tierRequired,
                    thumbnail_url: toolData.thumbnailUrl,
                    published: toolData.published
                });
                await get().fetchTools();
            },

            updateTool: async (id, data) => {
                await supabase.from('tools').update({
                    title: data.title,
                    description: data.description,
                    tier_required: data.tierRequired,
                    thumbnail_url: data.thumbnailUrl,
                    published: data.published,
                    updated_at: new Date().toISOString()
                }).eq('id', id);
                await get().fetchTools();
            },

            deleteTool: async (id) => {
                await supabase.from('tools').delete().eq('id', id);
                await get().fetchTools();
            },

            // Blog Actions
            fetchBlogs: async () => {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) {
                    const mappedBlogs: Blog[] = data.map(b => ({
                        id: b.id,
                        title: b.title,
                        content: '', // No content in bulk fetch
                        preview: b.preview,
                        thumbnailUrl: b.thumbnail_url,
                        tierRequired: b.tier_required as UserTier,
                        author: b.author,
                        readTime: b.read_time,
                        published: b.published,
                        createdAt: b.created_at
                    }));
                    set({ blogs: mappedBlogs });
                }
            },

            getBlog: async (id) => {
                const { data: blog, error: blogErr } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!blog) return null;

                // Try to fetch protected content
                const { data: bodyData } = await supabase
                    .from('blog_contents')
                    .select('body')
                    .eq('blog_id', id)
                    .single();

                return {
                    id: blog.id,
                    title: blog.title,
                    content: bodyData?.body || '', // Empty if unauthorized
                    preview: blog.preview,
                    thumbnailUrl: blog.thumbnail_url,
                    tierRequired: blog.tier_required as UserTier,
                    author: blog.author,
                    readTime: blog.read_time,
                    published: blog.published,
                    createdAt: blog.created_at
                };
            },

            addBlog: async (blogData) => {
                const { data, error } = await supabase.from('blogs').insert({
                    title: blogData.title,
                    preview: blogData.preview,
                    thumbnail_url: blogData.thumbnailUrl,
                    tier_required: blogData.tierRequired,
                    author: blogData.author,
                    read_time: blogData.readTime,
                    published: blogData.published
                }).select().single();

                if (data) {
                    await supabase.from('blog_contents').insert({
                        blog_id: data.id,
                        body: blogData.content
                    });
                }
                await get().fetchBlogs();
            },

            updateBlog: async (id, data) => {
                await supabase.from('blogs').update({
                    title: data.title,
                    preview: data.preview,
                    thumbnail_url: data.thumbnailUrl,
                    tier_required: data.tierRequired,
                    published: data.published
                }).eq('id', id);

                if (data.content) {
                    await supabase.from('blog_contents').upsert({
                        blog_id: id,
                        body: data.content
                    });
                }
                await get().fetchBlogs();
            },

            deleteBlog: async (id) => {
                await supabase.from('blogs').delete().eq('id', id);
                await get().fetchBlogs();
            },

            // Payment Actions
            fetchPayments: async () => {
                const { data, error } = await supabase
                    .from('payments')
                    // Explicitly specify the foreign key column 'user_id' to resolve ambiguity
                    .select('*, profiles:user_id(name, email)')
                    .order('created_at', { ascending: false });

                if (error) {
                    // Log specific error properties for better debugging
                    console.error('Error fetching payments:', error.message || error);
                }

                if (data) {
                    const mappedPayments: Payment[] = data.map(p => ({
                        id: p.id,
                        userId: p.user_id,
                        userName: p.profiles?.name || 'Unknown',
                        userEmail: p.profiles?.email || 'No Email',
                        tierRequested: p.tier_requested as UserTier,
                        transactionId: p.transaction_id,
                        screenshotUrl: p.screenshot_url,
                        notes: p.notes,
                        status: p.status as PaymentStatus,
                        rejectionReason: p.rejection_reason,
                        reviewedAt: p.reviewed_at,
                        reviewedBy: p.reviewed_by,
                        createdAt: p.created_at
                    }));
                    set({ payments: mappedPayments });
                }
            },

            submitPayment: async (tierRequested, transactionId, screenshotUrl, notes) => {
                const { user } = get();
                if (!user) return { success: false, error: 'Not authenticated' };

                const { error } = await supabase.from('payments').insert({
                    user_id: user.id,
                    tier_requested: tierRequested,
                    transaction_id: transactionId,
                    screenshot_url: screenshotUrl,
                    notes,
                    status: 'pending'
                });

                if (error) return { success: false, error: error.message };
                await get().fetchPayments();
                return { success: true };
            },

            reviewPayment: async (paymentId, status, rejectionReason) => {
                const { user } = get();
                await supabase.from('payments').update({
                    status,
                    rejection_reason: rejectionReason,
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: user?.id
                }).eq('id', paymentId);
                await get().fetchPayments();

                // If approved, update user tier
                if (status === 'approved') {
                    const payment = get().payments.find(p => p.id === paymentId);
                    if (payment) {
                        await get().updateUserTier(payment.userId, payment.tierRequested);
                    }
                }
            },

            // Admin User Actions
            fetchAllUsers: async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) {
                    const mappedUsers: User[] = data.map(u => ({
                        id: u.id,
                        email: u.email,
                        name: u.name,
                        tier: u.tier as UserTier,
                        role: u.role,
                        telegramUsername: u.telegram_username,
                        telegramAccess: u.telegram_access,
                        banned: u.banned,
                        createdAt: u.created_at,
                        updatedAt: u.updated_at
                    }));
                    set({ allUsers: mappedUsers });
                }
            },

            updateUserTier: async (userId, tier) => {
                await supabase.from('profiles').update({ tier }).eq('id', userId);
                await get().fetchAllUsers();
            },

            banUser: async (userId) => {
                await supabase.from('profiles').update({ banned: true }).eq('id', userId);
                await get().fetchAllUsers();
            },

            unbanUser: async (userId) => {
                await supabase.from('profiles').update({ banned: false }).eq('id', userId);
                await get().fetchAllUsers();
            },

            setTelegramAccess: async (userId, access) => {
                await supabase.from('profiles').update({ telegram_access: access }).eq('id', userId);
                await get().fetchAllUsers();
            },

            // Notification Actions
            fetchNotifications: async () => {
                const { user } = get();
                if (!user) return;
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) {
                    set({
                        notifications: data.map(n => ({
                            id: n.id,
                            userId: n.user_id,
                            title: n.title,
                            message: n.message,
                            type: n.type as any,
                            read: n.read,
                            createdAt: n.created_at
                        }))
                    });
                }
            },

            markNotificationRead: async (id) => {
                await supabase.from('notifications').update({ read: true }).eq('id', id);
                await get().fetchNotifications();
            },

            // Admin Stats Actions
            fetchAdminStats: async () => {
                const { data: users } = await supabase.from('profiles').select('tier, created_at');
                if (users) {
                    const stats = {
                        totalUsers: users.length,
                        freeUsers: users.filter(u => u.tier === 'free').length,
                        tier1Users: users.filter(u => u.tier === 'tier1').length,
                        tier2Users: users.filter(u => u.tier === 'tier2').length,
                        conversionRate: users.length > 0 ? Math.round((users.filter(u => u.tier !== 'free').length / users.length) * 100) : 0,
                        userGrowth: [] // Logic for growth would go here
                    };
                    set({ adminStats: stats as any });
                }
            },

            // Site Settings Actions
            fetchSiteSettings: async () => {
                const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'main').single();
                if (data) {
                    set({
                        siteSettings: {
                            id: data.id,
                            binanceQrUrl: data.binance_qr_url,
                            binanceId: data.binance_id,
                            telegramBotLink: data.telegram_bot_link,
                            telegramChannelLink: data.telegram_channel_link
                        }
                    });
                }
            },

            updateSiteSettings: async (data) => {
                await supabase.from('site_settings').update({
                    binance_qr_url: data.binanceQrUrl,
                    binance_id: data.binanceId,
                    telegram_bot_link: data.telegramBotLink,
                    telegram_channel_link: data.telegramChannelLink,
                    updated_at: new Date().toISOString()
                }).eq('id', 'main');
                await get().fetchSiteSettings();
            },

            // Section Management Actions
            addSection: async (type, parentId, data) => {
                const table = type === 'course' ? 'course_sections' : 'tool_sections';
                const parentCol = type === 'course' ? 'course_id' : 'tool_id';
                const parentTable = type === 'course' ? 'courses' : 'tools';

                // Insert section
                await supabase.from(table).insert({
                    [parentCol]: parentId,
                    title: data.title,
                    content: data.content,
                    video_url: data.videoUrl,
                    order_index: data.orderIndex || 0
                });

                // Increment video count
                const parent = type === 'course' ? get().courses.find(c => c.id === parentId) : get().tools.find(t => t.id === parentId);
                const currentCount = parent?.videoCount || 0;

                await supabase.from(parentTable)
                    .update({ video_count: currentCount + 1 })
                    .eq('id', parentId);

                if (type === 'course') await get().fetchCourses();
                else await get().fetchTools();
            },

            updateSection: async (type, sectionId, data) => {
                const table = type === 'course' ? 'course_sections' : 'tool_sections';
                await supabase.from(table).update({
                    title: data.title,
                    content: data.content,
                    video_url: data.videoUrl,
                    order_index: data.orderIndex
                }).eq('id', sectionId);

                if (type === 'course') await get().fetchCourses();
                else await get().fetchTools();
            },

            deleteSection: async (type, sectionId) => {
                const table = type === 'course' ? 'course_sections' : 'tool_sections';
                const parentTable = type === 'course' ? 'courses' : 'tools';
                const parentCol = type === 'course' ? 'course_id' : 'tool_id';

                // Get parentId before deleting
                const { data: section } = await supabase.from(table).select(parentCol).eq('id', sectionId).single();
                const parentId = (section as any)?.[parentCol];

                // Delete
                await supabase.from(table).delete().eq('id', sectionId);

                // Decrement video count
                if (parentId) {
                    const parent = type === 'course' ? get().courses.find(c => c.id === parentId) : get().tools.find(t => t.id === parentId);
                    const currentCount = Math.max(0, (parent?.videoCount || 1) - 1);

                    await supabase.from(parentTable)
                        .update({ video_count: currentCount })
                        .eq('id', parentId);
                }

                if (type === 'course') await get().fetchCourses();
                else await get().fetchTools();
            },

            // Upload Utility
            uploadFile: async (bucket, path, file) => {
                const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
                if (error) return { publicUrl: null, error: error.message };

                const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
                return { publicUrl };
            }

        }),
        {
            name: 'tholvitrader-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
