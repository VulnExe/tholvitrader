import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Eye, EyeOff, Loader2, ArrowRight, Shield, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, signInWithGoogle, isLoading } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            const store = useStore.getState();
            if (store.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div>
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
                <img src="/Tholvitrader.png" alt="TholviTrader" className="h-8 w-auto mx-auto object-contain" />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="text-white/35 text-sm mt-2">Sign in to access your trading dashboard</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
                <button
                    onClick={() => signInWithGoogle()}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white font-medium flex items-center justify-center gap-3 hover:bg-white/[0.08] hover:border-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.03] to-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="relative z-10 text-sm">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative py-3 flex items-center">
                    <div className="flex-grow border-t border-white/[0.04]"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-white/15 font-bold uppercase tracking-[0.15em]">or sign in with email</span>
                    <div className="flex-grow border-t border-white/[0.04]"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/15 text-red-400 text-sm flex items-center gap-2"
                    >
                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold">!</span>
                        </div>
                        {error}
                    </motion.div>
                )}

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/15 focus:bg-white/[0.05] transition-all text-sm"
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/15 focus:bg-white/[0.05] transition-all pr-12 text-sm"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                    <Link to="/auth/forgot-password" className="text-xs text-purple-400/80 hover:text-purple-300 transition-colors font-medium">
                        Forgot your password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <Lock className="w-3.5 h-3.5" />
                            Sign In
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </>
                    )}
                </button>
            </form>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="flex items-center gap-1.5 text-white/15">
                        <Shield className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Secure Login</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/15">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/15">
                        <Lock className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Encrypted</span>
                    </div>
                </div>

                <p className="text-center text-sm text-white/25">
                    Don&apos;t have an account?{' '}
                    <Link to="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                        Create one free
                    </Link>
                </p>
            </div>
        </div>
    );
}
