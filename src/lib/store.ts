import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Payment, Course, Blog, Tool, UserTier, PaymentStatus, Notification, AdminStats } from './types';
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
    _loadProfile: (authUser: any) => Promise<void>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;

    // Courses
    courses: Course[];
    fetchCourses: () => Promise<void>;
    getCourse: (id: string) => Promise<Course | null>;
    addCourse: (course: any) => Promise<{ success: boolean; error?: string }>;
    updateCourse: (id: string, data: Partial<Course>) => Promise<{ success: boolean; error?: string }>;
    deleteCourse: (id: string) => Promise<{ success: boolean; error?: string }>;

    // Tools
    tools: Tool[];
    fetchTools: () => Promise<void>;
    getTool: (id: string) => Promise<Tool | null>;
    addTool: (tool: any) => Promise<{ success: boolean; error?: string }>;
    updateTool: (id: string, data: Partial<Tool>) => Promise<{ success: boolean; error?: string }>;
    deleteTool: (id: string) => Promise<{ success: boolean; error?: string }>;

    // Blogs
    blogs: Blog[];
    fetchBlogs: () => Promise<void>;
    getBlog: (id: string) => Promise<Blog | null>;
    addBlog: (blog: any) => Promise<{ success: boolean; error?: string }>;
    updateBlog: (id: string, data: Partial<Blog>) => Promise<{ success: boolean; error?: string }>;
    deleteBlog: (id: string) => Promise<{ success: boolean; error?: string }>;

    // Payments
    payments: Payment[];
    paymentsTotal: number;
    fetchPayments: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>;
    submitPayment: (tierRequested: UserTier, transactionId: string, screenshotUrl: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
    approvePayment: (paymentId: string) => Promise<{ success: boolean; error?: string }>;
    rejectPayment: (paymentId: string) => Promise<{ success: boolean; error?: string }>;

    // Users Admin
    allUsers: User[];
    usersTotal: number;
    fetchAllUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
    updateUserTier: (userId: string, tier: UserTier) => Promise<{ success: boolean; error?: string }>;
    banUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
    unbanUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
    setTelegramAccess: (userId: string, access: boolean) => Promise<{ success: boolean; error?: string }>;

    // Notifications
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;

    adminStats: AdminStats;
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
    updateSiteSettings: (data: any) => Promise<{ success: boolean; error?: string }>;

    // Section Management
    addSection: (type: 'course' | 'tool', parentId: string, data: any) => Promise<void>;
    updateSection: (type: 'course' | 'tool', sectionId: string, data: any) => Promise<void>;
    deleteSection: (type: 'course' | 'tool', sectionId: string) => Promise<void>;

    // Storage
    uploadFile: (bucket: string, path: string, file: File) => Promise<{ publicUrl: string | null; error?: string }>;
}

export const useStore = create<AppStore>()(
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
        paymentsTotal: 0,
        allUsers: [],
        usersTotal: 0,
        notifications: [],
        adminStats: {
            totalUsers: 0,
            freeUsers: 0,
            tier1Users: 0,
            tier2Users: 0,
            pendingPayments: 0,
            totalRevenue: 0,
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
            // Do the initial session check ONCE
            const initialCheck = async () => {
                try {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                    if (sessionError) throw sessionError;

                    if (session?.user) {
                        await get()._loadProfile(session.user);
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    set({ user: null, isAuthenticated: false });
                } finally {
                    set({ isInitialized: true });
                }
            };

            initialCheck();

            // Listen for SUBSEQUENT auth changes only (not the initial event)
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                // Skip the initial session event — we already handled it above
                if (event === 'INITIAL_SESSION') return;

                if (event === 'SIGNED_IN' && session?.user) {
                    await get()._loadProfile(session.user);
                    set({ isInitialized: true });
                } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                    // Token refresh doesn't need full profile reload
                    return;
                } else if (event === 'SIGNED_OUT') {
                    set({ user: null, isAuthenticated: false, isInitialized: true });
                }
            });

            return () => subscription.unsubscribe();
        },

        // Internal helper to load a user profile from a Supabase auth user
        _loadProfile: async (authUser: any) => {
            try {
                // Fetch profile with a timeout fallback
                const profilePromise = supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                // Timeout after 3 seconds
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
                );

                let profile = null;
                try {
                    const { data } = await Promise.race([profilePromise, timeoutPromise]) as any;
                    profile = data;
                } catch (e) {
                    console.warn('Profile fetch failed or timed out:', e);
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
                } else {
                    // Fallback user state from auth metadata
                    set({
                        user: {
                            id: authUser.id,
                            email: authUser.email!,
                            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
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
                }
            } catch (error) {
                console.error('Profile load error:', error);
                // Still mark as authenticated but with fallback data
                set({
                    user: {
                        id: authUser.id,
                        email: authUser.email!,
                        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
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
            }
        },

        checkAuth: async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (session?.user) {
                    await get()._loadProfile(session.user);
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                set({ user: null, isAuthenticated: false });
            } finally {
                set({ isInitialized: true });
            }
        },

        login: async (email, password) => {
            try {
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
            } catch (error: any) {
                console.error('Login error:', error);
                set({ isLoading: false });
                return { success: false, error: error.message || 'An unexpected error occurred during login.' };
            }
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
            // React Router's ProtectedRoute guard will redirect to /auth/login
        },

        updateProfile: async (data) => {
            const { user } = get();
            if (!user) return { success: false, error: 'Not authenticated' };

            // Build update payload — only include fields that are provided
            const updatePayload: Record<string, any> = {
                updated_at: new Date().toISOString()
            };
            if (data.name !== undefined) updatePayload.name = data.name;
            if (data.telegramUsername !== undefined) updatePayload.telegram_username = data.telegramUsername;

            const { error } = await supabase
                .from('profiles')
                .update(updatePayload)
                .eq('id', user.id);

            if (error) return { success: false, error: error.message };

            // Re-read the profile from DB to ensure local state is in sync
            const { data: freshProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (freshProfile) {
                set({
                    user: {
                        id: freshProfile.id,
                        email: freshProfile.email,
                        name: freshProfile.name,
                        tier: freshProfile.tier as UserTier,
                        role: freshProfile.role,
                        telegramUsername: freshProfile.telegram_username,
                        telegramAccess: freshProfile.telegram_access,
                        banned: freshProfile.banned,
                        createdAt: freshProfile.created_at,
                        updatedAt: freshProfile.updated_at
                    }
                });
            } else {
                // Fallback: update locally with what we know
                set({
                    user: {
                        ...user,
                        name: data.name ?? user.name,
                        telegramUsername: data.telegramUsername ?? user.telegramUsername,
                        updatedAt: new Date().toISOString()
                    }
                });
            }

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

            if (error) return { success: false, error: error.message };
            await get().fetchCourses();
            return { success: true };
        },

        updateCourse: async (id, data) => {
            const { error } = await supabase.from('courses').update({
                title: data.title,
                description: data.description,
                tier_required: data.tierRequired,
                thumbnail_url: data.thumbnailUrl,
                published: data.published,
                updated_at: new Date().toISOString()
            }).eq('id', id);

            if (error) return { success: false, error: error.message };
            await get().fetchCourses();
            return { success: true };
        },

        deleteCourse: async (id) => {
            const { error } = await supabase.from('courses').delete().eq('id', id);
            if (error) return { success: false, error: error.message };
            await get().fetchCourses();
            return { success: true };
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
            const { error } = await supabase.from('tools').insert({
                title: toolData.title,
                description: toolData.description,
                tier_required: toolData.tierRequired,
                thumbnail_url: toolData.thumbnailUrl,
                published: toolData.published
            });
            if (error) return { success: false, error: error.message };
            await get().fetchTools();
            return { success: true };
        },

        updateTool: async (id, data) => {
            const { error } = await supabase.from('tools').update({
                title: data.title,
                description: data.description,
                tier_required: data.tierRequired,
                thumbnail_url: data.thumbnailUrl,
                published: data.published,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) return { success: false, error: error.message };
            await get().fetchTools();
            return { success: true };
        },

        deleteTool: async (id) => {
            const { error } = await supabase.from('tools').delete().eq('id', id);
            if (error) return { success: false, error: error.message };
            await get().fetchTools();
            return { success: true };
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

            if (error) return { success: false, error: error.message };

            if (data) {
                await supabase.from('blog_contents').insert({
                    blog_id: data.id,
                    body: blogData.content
                });
            }
            await get().fetchBlogs();
            return { success: true };
        },

        updateBlog: async (id, data) => {
            const { error } = await supabase.from('blogs').update({
                title: data.title,
                preview: data.preview,
                thumbnail_url: data.thumbnailUrl,
                tier_required: data.tierRequired,
                published: data.published
            }).eq('id', id);

            if (error) return { success: false, error: error.message };

            if (data.content) {
                await supabase.from('blog_contents').upsert({
                    blog_id: id,
                    body: data.content
                });
            }
            await get().fetchBlogs();
            return { success: true };
        },

        deleteBlog: async (id) => {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) return { success: false, error: error.message };
            await get().fetchBlogs();
            return { success: true };
        },

        // Payment Actions
        fetchPayments: async (page = 1, limit = 50, search = '', status = 'all') => {
            let query = supabase
                .from('payments')
                .select('*, profiles:user_id(name, email)', { count: 'exact' });

            if (status !== 'all') {
                query = query.eq('status', status);
            }

            if (search) {
                query = query.or(`transaction_id.ilike.%${search}%`);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range((page - 1) * limit, page * limit - 1);

            if (error) {
                console.error('Error fetching payments:', error.message);
                return;
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
                set({ payments: mappedPayments, paymentsTotal: count || 0 });
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

        approvePayment: async (paymentId) => {
            const { user } = get();
            const { error } = await supabase.from('payments').update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id
            }).eq('id', paymentId);

            if (error) return { success: false, error: error.message };

            const payment = get().payments.find(p => p.id === paymentId);
            if (payment) {
                // Update user tier
                await get().updateUserTier(payment.userId, payment.tierRequested);
            }

            await get().fetchPayments();
            return { success: true };
        },

        rejectPayment: async (paymentId) => {
            const { user } = get();
            const { error } = await supabase.from('payments').update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id
            }).eq('id', paymentId);

            if (error) return { success: false, error: error.message };
            await get().fetchPayments();
            return { success: true };
        },

        // Admin User Actions
        fetchAllUsers: async (page = 1, limit = 50, search = '') => {
            let query = supabase.from('profiles').select('*', { count: 'exact' });

            if (search) {
                query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range((page - 1) * limit, page * limit - 1);

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
                set({ allUsers: mappedUsers, usersTotal: count || 0 });
            }
        },

        updateUserTier: async (userId, tier) => {
            const { error } = await supabase.from('profiles').update({ tier }).eq('id', userId);
            if (error) return { success: false, error: error.message };
            await get().fetchAllUsers();
            return { success: true };
        },

        banUser: async (userId) => {
            const { error } = await supabase.from('profiles').update({ banned: true }).eq('id', userId);
            if (error) return { success: false, error: error.message };
            await get().fetchAllUsers();
            return { success: true };
        },

        unbanUser: async (userId) => {
            const { error } = await supabase.from('profiles').update({ banned: false }).eq('id', userId);
            if (error) return { success: false, error: error.message };
            await get().fetchAllUsers();
            return { success: true };
        },

        setTelegramAccess: async (userId, access) => {
            const { error } = await supabase.from('profiles').update({ telegram_access: access }).eq('id', userId);
            if (error) return { success: false, error: error.message };
            await get().fetchAllUsers();
            return { success: true };
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
            const { data: users, count: totalUsers } = await supabase
                .from('profiles')
                .select('tier, created_at', { count: 'exact' });

            const { count: pendingPayments } = await supabase
                .from('payments')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            const { count: approvedPayments } = await supabase
                .from('payments')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved');

            if (users) {
                // Simple revenue estimation: $29 per approved payment (arbitrary but matches dashboard page logic)
                const totalRevenue = (approvedPayments || 0) * 29;

                const stats = {
                    totalUsers: users.length,
                    freeUsers: users.filter(u => u.tier === 'free').length,
                    tier1Users: users.filter(u => u.tier === 'tier1').length,
                    tier2Users: users.filter(u => u.tier === 'tier2').length,
                    pendingPayments: pendingPayments || 0,
                    totalRevenue: totalRevenue,
                    conversionRate: users.length > 0 ? Math.round((users.filter(u => u.tier !== 'free').length / users.length) * 100) : 0,
                    userGrowth: [] // Would require group by date query
                };
                set({ adminStats: stats });
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
            const { error } = await supabase.from('site_settings').update({
                binance_qr_url: data.binanceQrUrl,
                binance_id: data.binanceId,
                telegram_bot_link: data.telegramBotLink,
                telegram_channel_link: data.telegramChannelLink,
                updated_at: new Date().toISOString()
            }).eq('id', 'main');

            if (error) return { success: false, error: error.message };
            await get().fetchSiteSettings();
            return { success: true };
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

    })
);
