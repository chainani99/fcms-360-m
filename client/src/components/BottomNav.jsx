import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
    {
        path: '/dashboard',
        label: 'Alerts',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        )
    },
    {
        path: '/projects',
        label: 'Projects',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        )
    },
    {
        path: '/budget',
        label: 'Budget',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <text x="6" y="18" fontSize="18" fontWeight="700" fill="currentColor">₹</text>
            </svg>
        )
    },
    {
        path: '/emb',
        label: 'eMB',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        )
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    }
];

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            {tabs.map(tab => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
                >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
