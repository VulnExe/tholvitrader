import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }

        setIsLoading(false);
    };

    if (sent) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-white/40 text-sm mb-6">
                    We sent a password reset link to <span className="text-white font-medium">{email}</span>
                </p>
                <Link
                    to="/auth/login"
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="lg:hidden text-center mb-8">
                <img src="/Tholvitrader.png" alt="TholviTrader" className="h-8 w-auto mx-auto object-contain" />
            </div>

            <Link to="/auth/login" className="inline-flex items-center text-sm text-white/40 hover:text-white/60 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
            </Link>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Forgot password?</h2>
                <p className="text-white/40 text-sm mt-2">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>
        </div>
    );
}
