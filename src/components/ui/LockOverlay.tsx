'use client';

import { ReactNode } from 'react';
import { LockKeyhole, Sparkles } from 'lucide-react';

interface LockOverlayProps {
    children: ReactNode;
    isLocked: boolean;
    tierRequired?: string;
    onUpgradeClick?: () => void;
}

export default function LockOverlay({ children, isLocked, tierRequired, onUpgradeClick }: LockOverlayProps) {
    if (!isLocked) return <>{children}</>;

    return (
        <div className="relative group cursor-pointer" onClick={onUpgradeClick}>
            <div className="filter blur-[2px] brightness-75 select-none pointer-events-none transition-all duration-300 group-hover:blur-[3px]">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-xl transition-all duration-300 group-hover:bg-black/50">
                <div className="flex flex-col items-center gap-3 transform transition-transform duration-300 group-hover:scale-110">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <LockKeyhole className="w-6 h-6 text-white/90" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold text-sm">Locked Content</p>
                        {tierRequired && (
                            <p className="text-white/60 text-xs mt-1">Requires {tierRequired}</p>
                        )}
                    </div>
                    <button className="mt-1 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-xs font-medium flex items-center gap-1.5 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        Upgrade to Unlock
                    </button>
                </div>
            </div>
        </div>
    );
}
