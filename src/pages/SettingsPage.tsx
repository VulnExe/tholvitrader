import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { User, Loader2, Save, Shield, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { user, updateProfile, changePassword, isInitialized, isAuthenticated } = useStore();
    const [name, setName] = useState('');
    const [telegram, setTelegram] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setTelegram(user.telegramUsername || '');
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        const result = await updateProfile({ name, telegramUsername: telegram });
        if (result.success) {
            toast.success('Profile updated');
        } else {
            toast.error(result.error || 'Failed to update');
        }
        setSaving(false);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);
        const result = await changePassword(oldPassword, newPassword);
        if (result.success) {
            toast.success('Password updated');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error(result.error || 'Failed to change password');
        }
        setChangingPassword(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-white/40 text-sm mt-1">Manage your profile and preferences</p>
                </motion.div>

                {/* Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-bold text-white">Profile</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white/30 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Telegram Username</label>
                        <input
                            type="text"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            placeholder="@username"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </motion.div>

                {/* Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Key className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-bold text-white">Change Password</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        Update Password
                    </button>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
