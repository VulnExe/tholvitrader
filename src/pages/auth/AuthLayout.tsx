import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Zap, Wrench, BookOpen, Shield, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#050507] flex">
            {/* Left Side — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 via-[#050507] to-blue-900/15" />
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/8 rounded-full blur-[100px]" />

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }} />

                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/Tholvitrader.png" alt="TholviTrader" className="h-16 w-auto object-contain" />
                    </Link>

                    {/* Tagline */}
                    <div className="max-w-md">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/15 rounded-full mb-6">
                                <Star className="w-3 h-3 text-purple-400" />
                                <span className="text-[10px] font-bold text-purple-300/80 uppercase tracking-[0.15em]">Trusted by Traders</span>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="text-4xl font-bold text-white leading-[1.15]"
                        >
                            Premium Trading
                            <br />
                            <span className="text-gradient">Knowledge Hub.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-4 text-white/30 leading-relaxed text-sm"
                        >
                            Access premium crack tools, full bundles of trading courses,
                            and join an exclusive community. Premium content delivered via Telegram.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 space-y-3"
                        >
                            {[
                                { icon: Wrench, text: 'Premium Crack Tools', desc: 'Exclusive trading software' },
                                { icon: BookOpen, text: 'Full Course Bundles', desc: 'Expert-led education' },
                                { icon: Zap, text: 'Private Telegram Delivery', desc: 'Instant premium access' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                                    className="flex items-center gap-3.5 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/15 transition-all">
                                        <item.icon className="w-4 h-4 text-purple-400/70" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60 font-medium">{item.text}</p>
                                        <p className="text-[10px] text-white/20">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Social proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-10 flex items-center gap-4"
                        >
                            <div className="flex -space-x-2">
                                {['P', 'A', 'R', 'K'].map((letter, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-[#050507] flex items-center justify-center text-[10px] font-bold text-white/40"
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className="w-3 h-3 text-yellow-500/70 fill-yellow-500/70" />
                                    ))}
                                </div>
                                <p className="text-[10px] text-white/20 mt-0.5">Trusted by active traders</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-white/15 font-medium">
                            © {new Date().getFullYear()} TholviTrader. All rights reserved.
                        </p>
                        <div className="flex items-center gap-1.5 text-white/10">
                            <Shield className="w-3 h-3" />
                            <span className="text-[10px] font-medium">SSL Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
                {/* Subtle background effect */}
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-600/[0.03] rounded-full blur-[80px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md relative z-10"
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
}
