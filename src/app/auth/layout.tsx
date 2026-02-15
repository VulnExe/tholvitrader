'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#050507] flex">
            {/* Left Side — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-[#050507] to-blue-900/20" />
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/Tholvitrader.png" alt="TholviTrader" className="h-10 w-auto object-contain" />
                    </Link>

                    {/* Tagline */}
                    <div className="max-w-md">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-bold text-white leading-tight"
                        >
                            Trade Smarter,
                            <br />
                            <span className="text-gradient">Not Harder.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-4 text-white/40 leading-relaxed"
                        >
                            Access premium trading courses, exclusive market analysis,
                            and join a community of serious traders.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 space-y-3"
                        >
                            {[
                                { icon: TrendingUp, text: 'Pro-level trading courses' },
                                { icon: Shield, text: 'Exclusive tier-based content' },
                                { icon: BarChart3, text: 'Real market analysis & insights' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white/50">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-purple-400" />
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-white/20">
                        © 2025 TholviTrader. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
