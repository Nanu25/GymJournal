import { useState, useEffect } from 'react';
import axios from 'axios';

interface ActivityLog {
    id: string;
    userId: string;
    action: 'create' | 'read' | 'update' | 'delete';
    entityType: string;
    entityId?: string;
    details: any;
    timestamp: string;
}

export function ActivityLogs() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/activity-logs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLogs(response.data);
            } catch (err: any) {
                console.error('Error fetching logs:', err);
                if (err.response?.status === 401) {
                    setError('Authentication failed. Please log in again.');
                } else if (err.response?.status === 403) {
                    setError('Access denied. Admin privileges required.');
                } else {
                    setError('Failed to fetch activity logs. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 shadow-sm">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Track all system activities and user actions
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {logs.length} Total Logs
                                </span>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No activity logs found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Entity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.userId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${log.action === 'create' ? 'bg-green-100 text-green-800' : 
                                                          log.action === 'update' ? 'bg-blue-100 text-blue-800' :
                                                          log.action === 'delete' ? 'bg-red-100 text-red-800' :
                                                          'bg-gray-100 text-gray-800'}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.entityType}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="max-h-40 overflow-y-auto">
                                                        <pre className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                            {JSON.stringify(log.details, null, 2)}
                                                        </pre>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 