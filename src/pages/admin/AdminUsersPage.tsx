import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import TierBadge from '@/components/ui/TierBadge';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import { Users, Search, Edit, Save, Loader2, Mail, Calendar, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserTier } from '@/lib/types';
import { format } from 'date-fns';

export default function AdminUsersPage() {
    const { allUsers: users, usersTotal, fetchAllUsers: fetchUsers, updateUserTier, isInitialized, isAuthenticated } = useStore();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [isLoading, setIsLoading] = useState(false);

    // Edit state
    const [editUser, setEditUser] = useState<any>(null);
    const [editTier, setEditTier] = useState<UserTier>('free');
    const [saving, setSaving] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isInitialized && isAuthenticated) {
                loadUsers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, page, isInitialized, isAuthenticated]);

    const loadUsers = async () => {
        setIsLoading(true);
        await fetchUsers(page, limit, search);
        setIsLoading(false);
    };

    const handleSaveTier = async () => {
        if (!editUser) return;
        setSaving(true);
        const result = await updateUserTier(editUser.id, editTier);
        if (result.success) {
            toast.success('User tier updated');
            setEditUser(null);
            loadUsers(); // Refresh list
        } else {
            toast.error(result.error || 'Failed to update');
        }
        setSaving(false);
    };

    const totalPages = Math.ceil(usersTotal / limit);

    return (
        <DashboardLayout>
            <div className="max-w-6xl space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Users className="w-6 h-6 text-purple-400" />
                            Manage Users
                        </h1>
                        <p className="text-white/40 text-sm mt-1">{usersTotal} registered users</p>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Tier</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-white/20">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-white/20">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                                                        {user.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-white">{user.name}</p>
                                                        <div className="flex items-center gap-1 text-xs text-white/40">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'admin' ? (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                                            <Shield className="w-3 h-3" /> Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                                                            User
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <TierBadge tier={user.tier} size="sm" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => { setEditUser(user); setEditTier(user.tier); }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit Tier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>

            <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User Tier">
                {editUser && (
                    <div className="space-y-5">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-sm text-white font-bold">{editUser.name}</p>
                            <p className="text-xs text-white/30">{editUser.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-white/40">Current Tier:</span>
                                <TierBadge tier={editUser.tier} size="sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/50 mb-2">New Tier</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['free', 'tier1', 'tier2'] as UserTier[]).map(tier => (
                                    <button
                                        key={tier}
                                        onClick={() => setEditTier(tier)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${editTier === tier ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                                    >
                                        <span className="capitalize font-bold text-sm">{tier}</span>
                                        {editTier === tier && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveTier}
                            disabled={saving}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Update Tier
                        </button>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
