// src/components/NetworkStatusIndicator.tsx
import React from 'react';
import { useNetworkStatus } from '../services/NetworkStatusService';

const NetworkStatusIndicator: React.FC = () => {
    const { isOnline, isServerAvailable } = useNetworkStatus();

    let backgroundColor = '#4CAF50'; // Green
    let message = 'Connected';
    let icon = '✓';

    if (!isOnline) {
        backgroundColor = '#F44336'; // Red
        message = 'You are offline. Changes will sync when reconnected.';
        icon = '✗';
    } else if (!isServerAvailable) {
        backgroundColor = '#FFC107'; // Yellow/Amber
        message = 'Server unavailable. Changes will sync when server is back.';
        icon = '!';
    }

    return (
        <div
            className="fixed bottom-16 right-4 z-50 p-2 rounded-lg shadow-lg flex items-center gap-2"
            style={{ backgroundColor, color: 'white', maxWidth: '300px', transition: 'all 0.3s ease' }}
        >
            <span className="text-lg font-bold">{icon}</span>
            <span className="text-sm">{message}</span>
        </div>
    );
};

export default NetworkStatusIndicator;