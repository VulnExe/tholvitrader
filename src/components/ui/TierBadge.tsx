import { UserTier } from '@/lib/types';
import { getTierLabel, getTierGradient } from '@/lib/tierSystem';

interface TierBadgeProps {
    tier: UserTier;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function TierBadge({ tier, size = 'md', className = '' }: TierBadgeProps) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-bold uppercase tracking-wider rounded-full
        bg-gradient-to-r ${getTierGradient(tier)} text-white
        shadow-lg ${tier === 'tier2' ? 'shadow-purple-500/25' : tier === 'tier1' ? 'shadow-blue-500/25' : 'shadow-gray-500/25'}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {getTierLabel(tier)}
        </span>
    );
}
