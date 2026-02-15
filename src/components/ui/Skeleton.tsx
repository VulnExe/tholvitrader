'use client';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-white/5 rounded';
    const variantClasses = {
        text: 'h-4 w-full rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-[#111113] border border-white/5 rounded-xl p-5 space-y-4">
            <Skeleton variant="rectangular" className="h-40 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-[#111113] border border-white/5 rounded-xl p-5 h-32" />
                ))}
            </div>
            <div className="bg-[#111113] border border-white/5 rounded-xl p-5 h-64" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            ))}
        </div>
    );
}
