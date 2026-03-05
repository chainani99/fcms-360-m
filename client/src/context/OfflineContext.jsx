import { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncQueue, setSyncQueue] = useState([]);
    const [lastSync, setLastSync] = useState(() => localStorage.getItem('fcms_last_sync') || null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addToSyncQueue = (item) => {
        setSyncQueue(prev => [...prev, { ...item, timestamp: new Date().toISOString() }]);
    };

    const updateLastSync = () => {
        const now = new Date().toISOString();
        setLastSync(now);
        localStorage.setItem('fcms_last_sync', now);
    };

    return (
        <OfflineContext.Provider value={{ isOnline, syncQueue, setSyncQueue, lastSync, addToSyncQueue, updateLastSync }}>
            {children}
        </OfflineContext.Provider>
    );
}

export const useOffline = () => useContext(OfflineContext);
