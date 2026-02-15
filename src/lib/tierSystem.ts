import { UserTier } from './types';

const TIER_HIERARCHY: Record<UserTier, number> = {
    free: 0,
    tier1: 1,
    tier2: 2,
};

export function canAccessContent(userTier: UserTier, requiredTier: UserTier): boolean {
    return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
}

export function getTierLabel(tier: UserTier): string {
    const labels: Record<UserTier, string> = {
        free: 'FREE',
        tier1: 'TIER 1',
        tier2: 'TIER 2',
    };
    return labels[tier];
}

export function getTierColor(tier: UserTier): string {
    const colors: Record<UserTier, string> = {
        free: '#6b7280',
        tier1: '#3b82f6',
        tier2: '#a855f7',
    };
    return colors[tier];
}

export function getTierGradient(tier: UserTier): string {
    const gradients: Record<UserTier, string> = {
        free: 'from-gray-500 to-gray-600',
        tier1: 'from-blue-500 to-cyan-400',
        tier2: 'from-purple-500 to-pink-500',
    };
    return gradients[tier];
}

export function getUnlockPercentage(userTier: UserTier, totalContent: number, freeContent: number, tier1Content: number): number {
    const tierLevel = TIER_HIERARCHY[userTier];
    let accessible = freeContent;
    if (tierLevel >= 1) accessible += tier1Content;
    if (tierLevel >= 2) accessible = totalContent;
    return totalContent > 0 ? Math.round((accessible / totalContent) * 100) : 0;
}

export const TIER_DATA = {
    free: {
        id: 'free' as UserTier,
        name: 'Free',
        price: '0',
        highlighted: false,
        features: [
            'Access to free content',
            'Blog previews',
            'Basic trading tutorials',
            'Limited course content',
        ],
    },
    tier1: {
        id: 'tier1' as UserTier,
        name: 'Tier 1 — Pro',
        price: '49',
        highlighted: true,
        features: [
            'Everything in Free',
            'Full Tier 1 courses',
            'Premium blog articles',
            'Private Telegram community',
            'Priority support',
        ],
    },
    tier2: {
        id: 'tier2' as UserTier,
        name: 'Tier 2 — Elite',
        price: '99',
        highlighted: false,
        features: [
            'Everything in Tier 1',
            'All premium courses',
            'Exclusive video content',
            'VIP Private Telegram channel',
            '1-on-1 mentorship sessions',
            'Early access to new content',
        ],
    },
};

export const TIER_COMPARISON = [
    { feature: 'Free Blog Articles', free: true, tier1: true, tier2: true },
    { feature: 'Public Content', free: true, tier1: true, tier2: true },
    { feature: 'Pro Courses', free: false, tier1: true, tier2: true },
    { feature: 'Premium Blog Content', free: false, tier1: true, tier2: true },
    { feature: 'Private Telegram Group', free: false, tier1: true, tier2: true },
    { feature: 'Elite Courses & Videos', free: false, tier1: false, tier2: true },
    { feature: 'VIP Early Insights', free: false, tier1: false, tier2: true },
    { feature: '1-on-1 Mentorship', free: false, tier1: false, tier2: true },
    { feature: 'Early Access to Content', free: false, tier1: false, tier2: true },
];
