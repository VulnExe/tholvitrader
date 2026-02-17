// ============ USER & AUTH TYPES ============
export type UserTier = 'free' | 'tier1' | 'tier2';
export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    tier: UserTier;
    role: UserRole;
    avatar?: string;
    telegramUsername?: string;
    telegramAccess: boolean;
    banned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    name: string;
}

// ============ COURSE TYPES ============
export interface Course {
    id: string;
    title: string;
    description: string;
    tierRequired: UserTier;
    thumbnailUrl?: string;
    videoCount: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    content: CourseSection[];
}

export interface CourseSection {
    id: string;
    courseId?: string;
    title: string;
    content: string;
    type?: string;
    videoUrl?: string;
    orderIndex: number;
    order?: number;
}

export interface ToolSection {
    id: string;
    toolId?: string;
    title: string;
    content: string;
    type?: string;
    videoUrl?: string;
    orderIndex: number;
    order?: number;
}

export interface Tool {
    id: string;
    title: string;
    description: string;
    tierRequired: UserTier;
    thumbnailUrl?: string;
    videoCount: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    sections: ToolSection[];
}

export interface CourseProgress {
    courseId: string;
    userId: string;
    completedSections: string[];
    percentage: number;
    lastAccessedAt: string;
}

// ============ BLOG TYPES ============
export interface Blog {
    id: string;
    title: string;
    content: string;
    preview: string;
    tierRequired: UserTier;
    thumbnailUrl?: string;
    published: boolean;
    author: string;
    readTime: number;
    createdAt: string;
}

// ============ PAYMENT TYPES ============
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Payment {
    id: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    tierRequested: UserTier;
    transactionId: string;
    screenshotUrl?: string;
    notes?: string;
    status: PaymentStatus;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

// ============ VIDEO TYPES ============
export interface Video {
    id: string;
    courseId: string;
    title: string;
    videoUrl: string;
    duration?: number;
    orderIndex: number;
    createdAt: string;
}

// ============ ADMIN TYPES ============
export interface AdminStats {
    totalUsers: number;
    freeUsers: number;
    tier1Users: number;
    tier2Users: number;
    pendingPayments: number;
    totalRevenue: number;
    conversionRate: number;
    userGrowth: { date: string; count: number }[];
}

// ============ TIER TYPES ============
export interface TierInfo {
    id: UserTier;
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
}

// ============ NOTIFICATION TYPES ============
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}
