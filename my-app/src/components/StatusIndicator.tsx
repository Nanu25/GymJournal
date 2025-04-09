import React from 'react';
import { useNetworkStatus } from '../services/NetworkStatusService';

const StatusIndicator: React.FC = () => {
  const { isOnline, isServerAvailable } = useNetworkStatus();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {!isOnline && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Offline Mode - Changes will sync when back online</span>
        </div>
      )}
      {isOnline && !isServerAvailable && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Server Unavailable - Working in offline mode</span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator; 