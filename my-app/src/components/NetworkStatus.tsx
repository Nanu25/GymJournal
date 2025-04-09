import React from 'react';
import { useNetworkStatus } from '../services/NetworkStatusService';

const NetworkStatus: React.FC = () => {
    const { isOnline, isServerAvailable } = useNetworkStatus();

    if (isOnline && isServerAvailable) {
        return null; // Don't show anything when everything is working
    }

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
            {!isOnline && (
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    No Internet Connection
                </div>
            )}
            {isOnline && !isServerAvailable && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Server Unavailable
                </div>
            )}
        </div>
    );
};

export default NetworkStatus; 