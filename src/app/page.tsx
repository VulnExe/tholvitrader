'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, BookOpen, TrendingUp, Star, Lock, ChevronRight } from 'lucide-react';
import { TIER_DATA, TIER_COMPARISON } from '@/lib/tierSystem';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050507] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Tholvi<span className="text-purple-400">Trader</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors hidden md:block">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
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
              <Star className="w-3.5 h-3.5" />
              EXCLUSIVE TRADING COMMUNITY
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            Master the Markets
            <br />
            <span className="text-gradient">Like a Pro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            Premium trading courses, exclusive market insights, and a community of
            serious traders. Unlock the knowledge that separates the 10% from the rest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/auth/signup"
              className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/70 font-medium hover:bg-white/10 transition-all"
            >
              View Plans
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '5+', label: 'Premium Courses' },
              { value: '100+', label: 'Trading Lessons' },
              { value: '500+', label: 'Active Traders' },
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
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-lg mx-auto">
              From beginner fundamentals to advanced quantitative strategies — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: BookOpen,
                title: 'Premium Courses',
                desc: 'Structured learning paths from basics to advanced trading',
                color: 'from-blue-500/20 to-blue-600/5',
                borderColor: 'border-blue-500/20',
              },
              {
                icon: TrendingUp,
                title: 'Market Analysis',
                desc: 'Expert blog posts with actionable trading insights',
                color: 'from-green-500/20 to-green-600/5',
                borderColor: 'border-green-500/20',
              },
              {
                icon: Shield,
                title: 'Exclusive Access',
                desc: 'Tiered content system with premium-only materials',
                color: 'from-purple-500/20 to-purple-600/5',
                borderColor: 'border-purple-500/20',
              },
              {
                icon: Zap,
                title: 'Live Community',
                desc: 'Telegram group access for real-time trading discussion',
                color: 'from-orange-500/20 to-orange-600/5',
                borderColor: 'border-orange-500/20',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-6 rounded-xl bg-gradient-to-b ${feature.color} border ${feature.borderColor} hover-lift`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blurred Content Preview — Psychological Trigger */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              See What You&apos;re <span className="text-gradient">Missing</span>
            </h2>
            <p className="mt-3 text-white/40">Premium content locked behind our membership tiers</p>
          </div>

          {/* Blurred preview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Advanced Algo Trading Masterclass', tier: 'TIER 2' },
              { title: 'Live Market Analysis Session', tier: 'TIER 1' },
              { title: 'Exclusive Trading Signals Setup', tier: 'TIER 2' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 filter blur-[2px] select-none">
                  <div className="h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg mb-4" />
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-sm text-white/30 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing</p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-xl">
                  <Lock className="w-8 h-8 text-white/50 mb-3" />
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-medium">
                    {item.tier} ONLY
                  </span>
                  <Link
                    href="/auth/signup"
                    className="mt-3 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    Unlock Now <ChevronRight className="w-3 h-3" />
                  </Link>
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
              Choose Your <span className="text-gradient">Trading Level</span>
            </h2>
            <p className="mt-4 text-white/40">Invest in your trading education. Cancel anytime.</p>
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
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <p className="text-3xl font-bold text-white mt-3">{tier.price}</p>

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
                  href="/auth/signup"
                  className={`
                    block w-full mt-8 py-3 rounded-xl text-center text-sm font-medium transition-all duration-300
                    ${tier.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'}
                  `}
                >
                  {tier.id === 'free' ? 'Get Started Free' : `Upgrade to ${tier.name}`}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white text-center mb-8">Feature Comparison</h3>
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="text-left p-4 text-white/40 font-medium">Feature</th>
                  <th className="text-center p-4 text-white/40 font-medium">Free</th>
                  <th className="text-center p-4 text-purple-400 font-medium">Tier 1</th>
                  <th className="text-center p-4 text-purple-400 font-medium">Tier 2</th>
                </tr>
              </thead>
              <tbody>
                {TIER_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-4 text-white/60">{row.feature}</td>
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
              <h2 className="text-3xl font-bold text-white">Ready to Level Up?</h2>
              <p className="mt-3 text-white/50">Join the community of traders who take their edge seriously.</p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-white/40">TholviTrader © 2025. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
