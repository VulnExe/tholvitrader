import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = [];
    // Simple pagination logic for now: show all or max 5 around current
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < 4) {
        if (start === 1) end = Math.min(totalPages, start + 4);
        else start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {start > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === 1 ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                    >
                        1
                    </button>
                    {start > 2 && <span className="text-white/20">...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === page ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                >
                    {page}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="text-white/20">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
