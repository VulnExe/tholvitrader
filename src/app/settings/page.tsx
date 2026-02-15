'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import { useState, FormEvent } from 'react';
import { User, Key, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const { user, updateProfile, changePassword } = useStore();
    const [name, setName] = useState(user?.name || '');
    const [telegramUsername, setTelegramUsername] = useState(user?.telegramUsername || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [profileSaving, setProfileSaving] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    if (!user) return null;

    const handleProfileSave = async (e: FormEvent) => {
        e.preventDefault();
        setProfileSaving(true);
        await new Promise(r => setTimeout(r, 500));
        updateProfile({ name, telegramUsername: telegramUsername || undefined });
        setProfileSaving(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const handlePasswordChange = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setPasswordSaving(true);
        const result = await changePassword(oldPassword, newPassword);
        setPasswordSaving(false);

        if (result.success) {
            setPasswordSaved(true);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSaved(false), 2000);
        } else {
            setPasswordError(result.error || 'Failed to change password');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-white/40 text-sm mt-1">Manage your account</p>
                </div>

                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-xl bg-[#111113] border border-white/5 mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold">Profile</h2>
                            <p className="text-xs text-white/30">Update your personal information</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/30 text-sm cursor-not-allowed"
                            />
                            <p className="text-[10px] text-white/20 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Current Tier</label>
                            <div className="flex items-center gap-2">
                                <TierBadge tier={user.tier} size="md" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={profileSaving}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 transition-all"
                        >
                            {profileSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : profileSaved ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : null}
                            {profileSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </form>
                </motion.div>

                {/* Telegram Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-6 rounded-xl bg-[#111113] border border-white/5 mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold">Telegram</h2>
                            <p className="text-xs text-white/30">Link your Telegram account for community access</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Telegram Username</label>
                        <input
                            type="text"
                            value={telegramUsername}
                            onChange={(e) => setTelegramUsername(e.target.value)}
                            placeholder="@yourusername"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                        />
                        <p className="text-[10px] text-white/20 mt-1">Enter your Telegram username to get added to the channel after payment approval</p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-sm text-white/40">Access Status:</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.telegramAccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                            {user.telegramAccess ? '✓ Active' : 'Not Active'}
                        </span>
                    </div>
                </motion.div>

                {/* Password Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-6 rounded-xl bg-[#111113] border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Key className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold">Password</h2>
                            <p className="text-xs text-white/30">Update your password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {passwordError && (
                            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                                {passwordError}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordSaving}
                            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 transition-all"
                        >
                            {passwordSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : passwordSaved ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : null}
                            {passwordSaved ? 'Updated!' : 'Update Password'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
