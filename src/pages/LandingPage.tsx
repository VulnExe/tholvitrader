import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BookOpen, ChevronRight, Wrench } from 'lucide-react';
import { TIER_DATA, TIER_COMPARISON } from '@/lib/tierSystem';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050507] overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/Tholvitrader.png" alt="TholviTrader" className="h-16 md:h-20 w-auto object-contain" />
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

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
                            <Zap className="w-3.5 h-3.5" />
                            CRACK TOOLS & PREMIUM BUNDLES
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white leading-tight"
                    >
                        Level Up Your
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Trading Edge</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get access to exclusive crack tools, full bundles of trading courses, and
                        private community insights. All premium content delivered directly via Telegram.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/auth/signup"
                            className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                        >
                            Start for Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#pricing"
                            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/70 font-medium hover:bg-white/10 transition-all"
                        >
                            Check Pricing
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                    >
                        {[
                            { value: '10+', label: 'Crack Tools' },
                            { value: '25+', label: 'Full Bundles' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
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
                            const Wrench = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
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
                        {Object.values(TIER_DATA).map((tier, i) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className={`
                  relative p-7 rounded-2xl border transition-all duration-300 hover-lift
                  ${tier.highlighted
                                        ? 'border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-purple-900/5 shadow-xl shadow-purple-900/20'
                                        : 'border-white/5 bg-white/[0.02]'}
                `}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-bold uppercase tracking-wider">
                                        Recommended
                                    </div>
                                )}

                                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mt-3">
                                    <span className="text-3xl font-bold text-white">${tier.price}</span>
                                    {tier.id !== 'free' && <span className="text-white/40 text-sm">/one-time</span>}
                                </div>

                                <ul className="mt-6 space-y-3">
                                    {tier.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-sm text-white/60">
                                            <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5 shrink-0">
                                                <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/auth/signup"
                                    className={`
                    block w-full mt-8 py-3 rounded-xl text-center text-sm font-medium transition-all duration-300
                    ${tier.highlighted
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'}
                  `}
                                >
                                    {tier.id === 'free' ? 'Get Started Free' : `Get ${tier.name}`}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-16 px-6">
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
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
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
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6">
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
            </footer>
        </div>
    );
}
