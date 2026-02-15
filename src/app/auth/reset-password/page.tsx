'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Password Updated</h2>
                <p className="text-white/40 text-sm mt-3">
                    Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="lg:hidden text-center mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Tholvi<span className="text-purple-400">Trader</span>
                </h1>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Set new password</h2>
                <p className="text-white/40 text-sm mt-2">
                    Enter your new password below
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
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

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </form>
        </div>
    );
}
