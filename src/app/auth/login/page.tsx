'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useStore();
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
            // Check if admin
            const store = useStore.getState();
            if (store.user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div>
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Tholvi<span className="text-purple-400">Trader</span>
                </h1>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="text-white/40 text-sm mt-2">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error */}
                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>

            </form>

            <p className="mt-6 text-center text-sm text-white/30">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
