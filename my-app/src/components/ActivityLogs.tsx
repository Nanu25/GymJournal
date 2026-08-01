import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

interface UserLog {
    id: number;
    userId: number;
    action: string;
    details: string;
    timestamp: string;
    user: {
        username: string;
        email: string;
    };
}

interface MonitoredUser {
    id: number;
    username: string;
    email: string;
    role: string;
    lastLogin: string;
}

export const ActivityLogs: React.FC = () => {
    const [logs, setLogs] = useState<UserLog[]>([]);
    const [monitoredUsers, setMonitoredUsers] = useState<MonitoredUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAdminStatus();
        fetchLogs();
        fetchMonitoredUsers();
    }, []);

    const checkAdminStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.role === 'admin');
            } catch (e) {
                console.error('Error decoding token:', e);
            }
        }
    };

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonitoredUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMonitoredUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMonitoredUsers(prev => prev.filter(u => u.id !== userId));
                toast.success('User deleted successfully');
            } else {
                toast.error('Failed to delete monitored user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user.');
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                Access Denied. Admin privileges required.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 text-white">
            {/* Monitored Users Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Monitored Users</h2>
                <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-blue-500/20">
                    <table className="w-full text-left">
                        <thead className="bg-blue-900/20">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Last Login</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monitoredUsers.map(user => (
                                <tr key={user.id} className="border-t border-blue-500/10 hover:bg-white/5">
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(user.lastLogin).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Activity Logs Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">System Activity Logs</h2>
                <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-blue-500/20">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading logs...</div>
                    ) : (
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-blue-900/20 sticky top-0">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Action</th>
                                        <th className="p-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-t border-blue-500/10 hover:bg-white/5">
                                            <td className="p-4 text-gray-400 text-sm">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4 font-medium text-blue-300">
                                                {log.user?.username || 'Unknown'}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-200 text-xs border border-blue-500/20">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-300">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};