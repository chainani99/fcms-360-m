import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ProfileScreen.css';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className="profile-page">
            <Header />

            {/* Back Header */}
            <div className="profile-back">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" fill="none" stroke="var(--text-primary)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="profile-back-info">
                    <h2>Profile & Settings</h2>
                    <p>Edit or change the details</p>
                </div>
            </div>

            {/* User Profile Card */}
            <div className="profile-user-card">
                <div className="profile-avatar">
                    <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" fill="var(--text-tertiary)" />
                        <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="var(--text-tertiary)" />
                    </svg>
                </div>
                <h3 className="profile-user-name">{user?.name || 'Unknown User'}</h3>
                <p className="profile-user-role">{user?.appointment || user?.role || 'No Role'}</p>
                <span className="profile-role-badge">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {user?.role || 'N/A'}
                </span>
                {user?.formation && (
                    <p className="profile-formation">Formation: {user.formation}</p>
                )}
            </div>

            {/* Contact Details */}
            <div className="profile-contact">
                <div className="contact-row">
                    <span className="contact-label">Mobile</span>
                    <span className="contact-value">{user?.phone ? `+91 ${user.phone}` : '+91 9876500000'}</span>
                </div>
                <div className="contact-row">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{user?.email || 'N/A'}</span>
                </div>
            </div>

            {/* Settings */}
            <h3 className="profile-settings-title">Settings</h3>
            <div className="profile-settings-card">
                <div className="settings-row">
                    <div className="settings-left">
                        <div className="settings-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                        </div>
                        <div className="settings-text">
                            <h4>Language</h4>
                            <p>English</p>
                        </div>
                    </div>
                    <span className="settings-arrow">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </span>
                </div>
                <div className="settings-row">
                    <div className="settings-left">
                        <div className="settings-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                        </div>
                        <div className="settings-text">
                            <h4>Notifications</h4>
                            <p>Enabled</p>
                        </div>
                    </div>
                    <span className="settings-arrow">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Logout Button */}
            <div className="profile-logout">
                <button className="logout-btn" onClick={handleLogout}>
                    Log Out
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
