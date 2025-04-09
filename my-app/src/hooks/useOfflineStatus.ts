// src/hooks/useOfflineStatus.ts
import { useEffect, useState } from 'react';
import { offlineManager } from '../services/OfflineManager';

export function useOfflineStatus() {
    const [status, setStatus] = useState(offlineManager.getStatus());

    useEffect(() => {
        return offlineManager.subscribe(setStatus);
    }, []);

    return status;
}