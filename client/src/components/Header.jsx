import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import './Header.css';

const demoNotifications = [
    { id: 1, text: 'P1(Eastern command) — Needs attention: Structure completion delayed', time: '2 hours ago' },
    { id: 2, text: 'BILL-2024-1102 — Overdue by 3 days. Action required.', time: '3 hours ago' },
    { id: 3, text: 'New MB entry submitted for P5(Barracks) — Pending approval', time: '5 hours ago' },
    { id: 4, text: 'Budget utilization at 40% — ₹25 Cr unspent allocation', time: '1 day ago' },
];

export default function Header() {
    const { user } = useAuth();
    const { lastSync, isOnline } = useOffline();
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState(demoNotifications);

    const formatSync = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return `Last sync: ${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} hrs`;
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="header-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">
                        <img src="/logo-white.svg" alt="FCMS 360" className="header-logo-img" />
                    </div>
                </div>
                <div className="header-actions">
                    <div style={{ position: 'relative' }}>
                        <button className="header-bell" onClick={() => setShowNotif(!showNotif)}>
                            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                            {notifications.length > 0 && <span className="bell-dot"></span>}
                        </button>
                        {showNotif && (
                            <div className="notif-dropdown fade-in">
                                <div className="notif-header">
                                    <h4>Notifications ({notifications.length})</h4>
                                    <button className="notif-clear" onClick={() => { setNotifications([]); setShowNotif(false); }}>Clear all</button>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="notif-item"><p style={{ color: 'var(--text-tertiary)' }}>No notifications</p></div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className="notif-item">
                                            <p>{n.text}</p>
                                            <span>{n.time}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    {user && (
                        <div className="header-user" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                            <div className="user-avatar">{user.name?.charAt(0)}</div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {lastSync && (
                <div className="header-sync">
                    <span className={`sync-dot ${isOnline ? 'online' : 'offline'}`}></span>
                    <span className="sync-text">{formatSync(lastSync)}</span>
                </div>
            )}
        </header>
    );
}
