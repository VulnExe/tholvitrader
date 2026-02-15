'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Save, Upload, Send, MessageSquare, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
    const { siteSettings, fetchSiteSettings, updateSiteSettings, uploadFile } = useStore();
    const [binanceId, setBinanceId] = useState('');
    const [botLink, setBotLink] = useState('');
    const [channelLink, setChannelLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSiteSettings();
    }, [fetchSiteSettings]);

    useEffect(() => {
        setBinanceId(siteSettings.binanceId || '');
        setBotLink(siteSettings.telegramBotLink || '');
        setChannelLink(siteSettings.telegramChannelLink || '');
    }, [siteSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        await updateSiteSettings({
            binanceId,
            telegramBotLink: botLink,
            telegramChannelLink: channelLink,
            binanceQrUrl: siteSettings.binanceQrUrl
        });
        setIsSaving(false);
    };

    const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const { publicUrl, error } = await uploadFile('uploads', `settings/binance_qr.png`, file);
        if (publicUrl) {
            await updateSiteSettings({
                ...siteSettings,
                binanceQrUrl: publicUrl,
                binanceId,
                telegramBotLink: botLink,
                telegramChannelLink: channelLink
            });
        }
        setUploading(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
                    <p className="text-white/40 text-sm mt-1">Configure payment details and social links</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Payment Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-2xl bg-[#111113] border border-white/5 space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-blue-400" />
                            Payment Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Binance ID</label>
                                <input
                                    type="text"
                                    value={binanceId}
                                    onChange={(e) => setBinanceId(e.target.value)}
                                    placeholder="Enter Binance ID"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Binance Pay QR Code</label>
                                <div className="p-4 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center gap-3">
                                    {siteSettings.binanceQrUrl ? (
                                        <img src={siteSettings.binanceQrUrl} alt="Binance QR" className="w-32 h-32 object-contain rounded-lg" />
                                    ) : (
                                        <QrCode className="w-12 h-12 text-white/10" />
                                    )}
                                    <label className="cursor-pointer px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-2">
                                        <Upload className="w-3 h-3" />
                                        {uploading ? 'Uploading...' : 'Upload New QR'}
                                        <input type="file" className="hidden" onChange={handleQRUpload} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Telegram Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-2xl bg-[#111113] border border-white/5 space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Send className="w-5 h-5 text-purple-400" />
                            Telegram Integration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Support Bot Link</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={botLink}
                                        onChange={(e) => setBotLink(e.target.value)}
                                        placeholder="https://t.me/your_bot"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/50 mb-2">Premium Channel Link</label>
                                <div className="relative">
                                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={channelLink}
                                        onChange={(e) => setChannelLink(e.target.value)}
                                        placeholder="https://t.me/your_channel"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving Changes...' : 'Save All Settings'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
