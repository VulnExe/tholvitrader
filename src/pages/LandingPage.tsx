import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, BookOpen, ChevronRight, Wrench, Search, Filter, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { TIER_DATA, TIER_COMPARISON, getTierLabel, getTierGradient } from '@/lib/tierSystem';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserTier } from '@/lib/types';

export default function LandingPage() {
    const { publicCourses, publicTools, fetchPublicCatalog, siteSettings, fetchSiteSettings, isAuthenticated } = useStore();

    // Catalog state
    const [activeTab, setActiveTab] = useState<'courses' | 'tools'>('tools');
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<string>('all');

    // Fetch public catalog on mount
    useEffect(() => {
        fetchPublicCatalog();
        fetchSiteSettings();
    }, [fetchPublicCatalog, fetchSiteSettings]);

    // Filtered items
    const filteredCourses = publicCourses
        .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
        .filter(c => tierFilter === 'all' || c.tierRequired === tierFilter);

    const filteredTools = publicTools
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
        .filter(t => tierFilter === 'all' || t.tierRequired === tierFilter);

    const activeItems = activeTab === 'courses' ? filteredCourses : filteredTools;
    const totalCourses = publicCourses.length;
    const totalTools = publicTools.length;

    return (
        <div className="min-h-screen bg-[#050507] overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/Tholvitrader.png" alt="TholviTrader" className="h-14 md:h-16 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-6">
                        <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors hidden md:block">
                            Pricing
                        </a>
                        <Link to="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/auth/signup"
                            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* HERO + CATALOG — Everything in one first section           */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section id="catalog" className="relative pt-24 pb-12 px-6">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Compact Hero Header */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-3">
                                <Zap className="w-3.5 h-3.5" />
                                CRACK TOOLS & PREMIUM BUNDLES
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold text-white leading-tight"
                        >
                            Level Up Your{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Trading Edge</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mt-2 text-sm text-white/45 max-w-xl mx-auto"
                        >
                            Exclusive crack tools, full course bundles & private community access. Browse everything below — sign up when you're ready.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-4 flex items-center justify-center gap-3"
                        >
                            <Link
                                to="/auth/signup"
                                className="group px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                            >
                                Start for Free
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/auth/login"
                                className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
                            >
                                Login
                            </Link>
                        </motion.div>
                    </div>

                    {/* Tab Switcher + Search/Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                    >
                        {/* Tabs */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                                onClick={() => { setActiveTab('tools'); setSearch(''); setTierFilter('all'); }}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'tools'
                                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/60'
                                    }`}
                            >
                                <Wrench className="w-4 h-4" />
                                Tools
                                {totalTools > 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'tools' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/30'}`}>
                                        {totalTools}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => { setActiveTab('courses'); setSearch(''); setTierFilter('all'); }}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'courses'
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/60'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Courses
                                {totalCourses > 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'courses' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/30'}`}>
                                        {totalCourses}
                                    </span>
                                )}
                            </button>

                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1 max-w-md mx-auto sm:mx-0 w-full">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={`Search ${activeTab}...`}
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <Filter className="w-4 h-4 text-white/20" />
                                {['all', 'free', 'tier1', 'tier2'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTierFilter(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tierFilter === t
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {t === 'all' ? 'All Tiers' : t === 'free' ? 'Free' : (
                                            <>
                                                {getTierLabel(t as any)}
                                                <span className="ml-1 opacity-50 font-normal">
                                                    (${t === 'tier1' ? (siteSettings.tier1Price || '30') : (siteSettings.tier2Price || '55')})
                                                </span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + tierFilter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {activeItems.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="group"
                                >
                                    <div className="h-full p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col relative overflow-hidden">
                                        {/* Hover glow */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Best Seller Badge */}
                                        {item.isFeatured && (
                                            <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-yellow-500 text-black text-[10px] font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-black" />
                                                BEST SELLER
                                            </div>
                                        )}

                                        {/* Thumbnail */}
                                        {item.thumbnailUrl ? (
                                            <div className="mb-3 rounded-xl overflow-hidden h-28 bg-white/5 relative">
                                                <img
                                                    src={item.thumbnailUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent" />
                                            </div>
                                        ) : (
                                            <div className="mb-3 rounded-xl h-28 bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
                                                {activeTab === 'courses' ? (
                                                    <BookOpen className="w-8 h-8 text-white/10" />
                                                ) : (
                                                    <Wrench className="w-8 h-8 text-white/10" />
                                                )}
                                            </div>
                                        )}

                                        {/* Tier Badge */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r ${getTierGradient(item.tierRequired)} text-white shadow-sm`}>
                                                {getTierLabel(item.tierRequired)}
                                            </span>
                                            <span className="text-[10px] text-white/25">
                                                {item.videoCount} sections
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/35 text-xs line-clamp-2 leading-relaxed flex-1 mb-3">
                                            {item.description}
                                        </p>

                                        {/* CTA */}
                                        <Link
                                            to="/auth/login"
                                            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/20 hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Get Access
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Empty state */}
                    {activeItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            {activeTab === 'courses' ? (
                                <BookOpen className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            ) : (
                                <Wrench className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            )}
                            <p className="text-white/20 text-sm mb-1">No {activeTab} found</p>
                            <p className="text-white/10 text-xs">
                                {search ? 'Try a different search term' : 'Check back soon for new content'}
                            </p>
                        </motion.div>
                    )}

                    {/* Signup CTA */}
                    {activeItems.length > 0 && (
                        <div className="text-center mt-8">
                            <Link
                                to="/auth/signup"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                            >
                                Sign Up to Unlock All Content
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <p className="mt-2 text-white/20 text-xs">Free signup — browse everything, upgrade when ready</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Core Trading
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> Solutions</span>
                        </h2>
                        <p className="mt-4 text-white/40 max-w-lg mx-auto">
                            Everything from automated crack tools to comprehensive educational bundles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                icon: Wrench,
                                title: 'Crack Tools',
                                desc: 'Access highly effective trading software and crack tools for professional analysis.',
                                color: 'from-blue-500/20 to-blue-600/5',
                                borderColor: 'border-blue-500/20',
                            },
                            {
                                icon: BookOpen,
                                title: 'Full Bundles',
                                desc: 'Complete course bundles covering every aspect of market mastery in depth.',
                                color: 'from-green-500/20 to-green-600/5',
                                borderColor: 'border-green-500/20',
                            },
                            {
                                icon: Zap,
                                title: 'Telegram Delivery',
                                desc: 'Premium content and tools links are delivered straight to your exclusive Telegram.',
                                color: 'from-purple-500/20 to-purple-600/5',
                                borderColor: 'border-purple-500/20',
                            },
                            {
                                icon: Shield,
                                title: 'Secure Access',
                                desc: 'Private verified access to restricted trading resources and software.',
                                color: 'from-orange-500/20 to-orange-600/5',
                                borderColor: 'border-orange-500/20',
                            },
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`p-6 rounded-xl bg-gradient-to-b ${feature.color} border ${feature.borderColor} hover-lift`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-white/70" />
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-white/40">{feature.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Restricted Assets Section */}
            <section className="py-20 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">
                            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Assets</span>
                        </h2>
                        <p className="mt-3 text-white/40">Exclusive crack tools and bundles delivered via premium channels</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                title: 'Bookmap Crack',
                                tier: 'TIER 2',
                                desc: 'Full institutional order book visualization tool.',
                                image: '/Bookmap.png'
                            },
                            {
                                title: 'Order Flow Crack',
                                tier: 'TIER 2',
                                desc: 'Advanced footprint and tape analysis software.',
                                image: '/orderflow.png'
                            },
                            {
                                title: 'BigTrades Crack',
                                tier: 'TIER 2',
                                desc: 'Detect and visualize aggressive institutional large orders.',
                                image: '/BigTrades.png'
                            },
                            {
                                title: 'Custom Volume Profile',
                                tier: 'TIER 1',
                                desc: 'Merged Market and Volume profile for structural analysis.',
                                image: '/Volume profile and market profile.png'
                            },
                        ].map((item, i) => (
                            <div key={i} className="group h-full flex flex-col">
                                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 h-full flex flex-col transition-all duration-300 group-hover:bg-white/[0.04] group-hover:border-white/10">
                                    <div className="h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden shrink-0 bg-[#050507]">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-60" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed mb-8 flex-1">{item.desc}</p>

                                    <div className="pt-6 border-t border-white/5 flex flex-col items-center justify-center gap-3">
                                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] text-purple-300 font-black uppercase tracking-widest">
                                            {item.tier} ONLY
                                        </span>
                                        <Link
                                            to="/auth/signup"
                                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-all font-bold"
                                        >
                                            Unlock Now <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Subscription <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Tiers</span>
                        </h2>
                        <p className="mt-4 text-white/40">Get instant access to tools and full bundles today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.values(TIER_DATA).map((tierItem, i) => {
                            // Override price with dynamic settings
                            const dynamicPrice = tierItem.id === 'tier1' ? (siteSettings.tier1Price || tierItem.price)
                                : tierItem.id === 'tier2' ? (siteSettings.tier2Price || tierItem.price)
                                    : tierItem.price;

                            return (
                                <motion.div
                                    key={tierItem.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`relative p-8 rounded-3xl border ${tierItem.highlighted ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'}`}
                                >
                                    {tierItem.highlighted && (
                                        <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-2xl">
                                            Most Popular
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-white mb-2">{tierItem.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-bold text-white">${dynamicPrice}</span>
                                        <span className="text-sm text-white/40">/month</span>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {tierItem.features.map((feature, fi) => (
                                            <li key={fi} className="flex items-start gap-3 text-sm text-white/60">
                                                <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${tierItem.highlighted ? 'text-purple-400' : 'text-white/20'}`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={isAuthenticated ? '/upgrade' : '/auth/signup'}
                                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${tierItem.highlighted
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        {isAuthenticated ? 'Upgrade Now' : (tierItem.id === 'free' ? 'Get Started Free' : 'Join Now')}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section >

            {/* Feature Comparison */}
            < section className="py-16 px-6" >
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-xl font-bold text-white mb-8">Access Matrix</h3>
                    <div className="rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="text-left p-4 text-white/40 font-medium">Feature</th>
                                    <th className="text-center p-4 text-white/40 font-medium">Free</th>
                                    <th className="text-center p-4 text-purple-400 font-medium">Tier 1 ($30)</th>
                                    <th className="text-center p-4 text-purple-400 font-medium">Tier 2 ($55)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TIER_COMPARISON.map((row, i) => (
                                    <tr key={i} className="border-t border-white/5">
                                        <td className="p-4 text-white/60 text-left">{row.feature}</td>
                                        <td className="p-4 text-center">
                                            {row.free ? (
                                                <span className="text-green-400">✓</span>
                                            ) : (
                                                <span className="text-white/10">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {row.tier1 ? (
                                                <span className="text-green-400">✓</span>
                                            ) : (
                                                <span className="text-white/10">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {row.tier2 ? (
                                                <span className="text-green-400">✓</span>
                                            ) : (
                                                <span className="text-white/10">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-6 text-xs text-white/30 italic">* All premium content delivered via verified Telegram after payment verification.</p>
                </div>
            </section >

            {/* CTA */}
            < section className="py-20 px-6" >
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 rounded-2xl bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent border border-purple-500/20 relative overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                        </div>
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-white">Start Your Journey</h2>
                            <p className="mt-3 text-white/50">Gain access to the tools and bundles that give you the ultimate edge.</p>
                            <Link
                                to="/auth/signup"
                                className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                            >
                                Join Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="border-t border-white/5 py-12 px-6" >
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/Tholvitrader.png" alt="TholviTrader" className="h-10 md:h-12 w-auto" />
                        </Link>
                        <div className="flex items-center gap-8 text-sm text-white/30 font-medium">
                            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="#" className="hover:text-white transition-colors">Contact Support</Link>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 text-center md:text-left">
                        <p className="text-sm text-white/20">TholviTrader © 2025. Institutional assets and professional bundles. Not financial advice.</p>
                    </div>
                </div>
            </footer >
        </div >
    );
}
