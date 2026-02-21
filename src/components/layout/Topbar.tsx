import { useStore } from '@/lib/store';
import { Bell, Search, X, BookOpen, Wrench, ArrowRight, Menu } from 'lucide-react';
import TierBadge from '../ui/TierBadge';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface TopbarProps {
    setMobileOpen?: (open: boolean) => void;
}

export default function Topbar({ setMobileOpen }: TopbarProps) {
    const {
        user,
        notifications,
        markNotificationRead,
        searchQuery,
        setSearchQuery,
        courses,
        tools,
    } = useStore();

    const [showNotifs, setShowNotifs] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

    // Filtered Content
    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);

    const filteredTools = tools.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);

    const hasResults = searchQuery.length > 0 && (filteredCourses.length > 0 || filteredTools.length > 0);

    // Close search results on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
            {/* Left Side: Mobile Menu + Search */}
            <div className="flex items-center gap-3 flex-1" ref={searchRef}>
                <button
                    onClick={() => setMobileOpen?.(true)}
                    className="w-9 h-9 rounded-lg bg-white/5 flex lg:hidden items-center justify-center text-white/40 hover:text-white transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearch(true);
                        }}
                        onFocus={() => setShowSearch(true)}
                        placeholder="Search courses, tools..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium"
                    />

                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-white text-white/20 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {showSearch && searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-12 left-0 w-full bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                            >
                                {hasResults ? (
                                    <div className="space-y-4 p-2">
                                        {filteredCourses.length > 0 && (
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2 ml-2">Courses</p>
                                                {filteredCourses.map(c => (
                                                    <Link
                                                        key={c.id}
                                                        to={`/courses/${c.id}`}
                                                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                                <BookOpen className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm text-white/70 group-hover:text-white transition-colors capitalize">{c.title}</span>
                                                        </div>
                                                        <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {filteredTools.length > 0 && (
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2 ml-2">Tools</p>
                                                {filteredTools.map(t => (
                                                    <Link
                                                        key={t.id}
                                                        to={`/tools/${t.id}`}
                                                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                <Wrench className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm text-white/70 group-hover:text-white capitalize">{t.title}</span>
                                                        </div>
                                                        <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <X className="w-8 h-8 text-white/5 mx-auto mb-2" />
                                        <p className="text-sm text-white/20">No matching results for &quot;{searchQuery}&quot;</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Search Icon */}
                <button
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    className="w-9 h-9 rounded-lg bg-white/5 flex md:hidden items-center justify-center text-white/40 hover:text-white transition-all ml-auto"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {mobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-0 h-16 bg-[#0a0a0c] z-[60] flex items-center px-4 gap-3 border-b border-white/10"
                    >
                        <Search className="w-4 h-4 text-white/20" />
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search everything..."
                            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        />
                        <button onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); }} className="p-2">
                            <X className="w-5 h-5 text-white/40" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-4 ml-3">
                {/* Hide tier badge on smallest screens or use sm version */}
                <div className="hidden sm:block">
                    {user && <TierBadge tier={user.tier} size="md" />}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-12 w-[calc(100vw-32px)] md:w-80 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Notifications</h4>
                                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-[10px] font-bold text-purple-400">{unreadCount} New</span>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                                    {notifications
                                        .filter(n => n.userId === user?.id)
                                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        .map(n => (
                                            <button
                                                key={n.id}
                                                onClick={() => markNotificationRead(n.id)}
                                                className={`w-full text-left px-5 py-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors ${!n.read ? 'bg-purple-500/5' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${!n.read ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} />
                                                    <div>
                                                        <p className="text-sm text-white font-bold mb-1">{n.title}</p>
                                                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">{n.message}</p>
                                                        <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    {notifications.filter(n => n.userId === user?.id).length === 0 && (
                                        <div className="px-5 py-12 text-center">
                                            <Bell className="w-8 h-8 text-white/5 mx-auto mb-3" />
                                            <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Inbox Empty</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Avatar */}
                {user && (
                    <Link
                        to="/settings"
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center text-white font-black text-xs cursor-pointer hover:border-purple-500/50 transition-all hover:scale-105"
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </Link>
                )}
            </div>
        </header>
    );
}
