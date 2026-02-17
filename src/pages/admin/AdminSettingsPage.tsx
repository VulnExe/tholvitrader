import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import FileUpload from '@/components/ui/FileUpload';
import { Settings, Save, Loader2, Link as LinkIcon, QrCode, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const { siteSettings, fetchSiteSettings, updateSiteSettings, isInitialized, isAuthenticated } = useStore();
    const [binanceId, setBinanceId] = useState('');
    const [binanceQrUrl, setBinanceQrUrl] = useState('');
    const [telegramBotLink, setTelegramBotLink] = useState('');
    const [telegramChannelLink, setTelegramChannelLink] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchSiteSettings();
        }
    }, [isInitialized, isAuthenticated]);

    useEffect(() => {
        if (siteSettings) {
            setBinanceId(siteSettings.binanceId || '');
            setBinanceQrUrl(siteSettings.binanceQrUrl || '');
            setTelegramBotLink(siteSettings.telegramBotLink || '');
            setTelegramChannelLink(siteSettings.telegramChannelLink || '');
        }
    }, [siteSettings]);

    const handleSave = async () => {
        setSaving(true);
        const result = await updateSiteSettings({ binanceId, binanceQrUrl, telegramBotLink, telegramChannelLink });
        if (result.success) {
            toast.success('Settings saved');
        } else {
            toast.error(result.error || 'Failed to save');
        }
        setSaving(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Settings className="w-6 h-6 text-purple-400" />
                        Site Settings
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Configure payment and communication settings</p>
                </motion.div>

                {/* Payment Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5"
                >
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-purple-400" />
                        Payment Configuration
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Binance Pay ID</label>
                        <input
                            type="text"
                            value={binanceId}
                            onChange={(e) => setBinanceId(e.target.value)}
                            placeholder="Enter your Binance Pay ID"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                        />
                    </div>

                    <FileUpload
                        label="Binance QR Code"
                        onUploadComplete={setBinanceQrUrl}
                        value={binanceQrUrl}
                        type="image"
                        accept="image/*"
                        bucket="site-assets"
                    />
                </motion.div>

                {/* Telegram Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5"
                >
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-400" />
                        Telegram Configuration
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Bot / Support Link</label>
                        <input
                            type="text"
                            value={telegramBotLink}
                            onChange={(e) => setTelegramBotLink(e.target.value)}
                            placeholder="https://t.me/your_bot"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Group Link</label>
                        <input
                            type="text"
                            value={telegramChannelLink}
                            onChange={(e) => setTelegramChannelLink(e.target.value)}
                            placeholder="https://t.me/your_group"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </DashboardLayout>
    );
}
