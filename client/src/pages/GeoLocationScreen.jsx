import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './GeoLocationScreen.css';

export default function GeoLocationScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const data = await projectsApi.get(id);
            setProject(data);
        } catch (err) {
            console.error('Failed to load project:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="geo-page">
                <Header />
                <div className="geo-content"><p style={{ padding: 20, textAlign: 'center' }}>Loading...</p></div>
                <BottomNav />
            </div>
        );
    }

    const lat = project?.latitude?.toFixed(4) || '17.3850';
    const lon = project?.longitude?.toFixed(4) || '78.4867';

    return (
        <div className="geo-page">
            <Header />
            <div className="geo-content">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    ← {project?.project_name || 'Project'}
                </button>
                <p className="geo-subtitle">📍 Geo-Tagging Validation</p>

                <h3 className="geo-preview-title">Geo-Tagging Preview</h3>
                <p className="geo-preview-sub">Site Inspection - {project?.project_name || 'Project'}</p>

                {/* Image with badges */}
                <div className="geo-image-container">
                    <div className="geo-image-placeholder">
                        <svg width="60" height="60" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span className="geo-img-text">Site Photo</span>
                    </div>
                    <div className="geo-badges-overlay">
                        <span className="geo-badge geo-badge-green">✓ GPS VERIFIED</span>
                        <span className="geo-badge geo-badge-orange">🔒 TIMESTAMP LOCKED</span>
                    </div>
                    <div className="geo-coords-overlay">
                        <div className="geo-coord-row">
                            <span>LAT: <strong>{lat}° N</strong></span>
                            <span>ALT: <strong>542m</strong></span>
                        </div>
                        <div className="geo-coord-row">
                            <span>LON: <strong>{lon}° E</strong></span>
                            <span>ACC: <strong>+/- 3m</strong></span>
                        </div>
                    </div>
                </div>

                {/* Acquisition Time */}
                <div className="geo-section">
                    <div className="geo-acquisition">
                        <svg width="16" height="16" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                        </svg>
                        <span>Acquisition Time</span>
                    </div>
                    <h3 className="geo-time">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</h3>
                </div>

                {/* Device info */}
                <div className="geo-section geo-device-grid">
                    <div className="geo-device-img-area">
                        <div className="geo-device-thumb"></div>
                    </div>
                </div>

                {/* Chain of custody */}
                <div className="geo-section">
                    <h4 className="geo-section-heading">Chain of custody</h4>
                    <div className="geo-chain-row">
                        <span className="geo-chain-label">Captured by:</span>
                        <span className="geo-chain-value">Jr. Eng. A.Kumar</span>
                    </div>
                    <div className="geo-chain-row">
                        <span className="geo-chain-label">Verified by:</span>
                        <span className="geo-chain-value">Col. R.Singh</span>
                    </div>
                </div>

                {/* Technical Integrity */}
                <div className="geo-section">
                    <h4 className="geo-section-heading">
                        <svg width="16" height="16" fill="none" stroke="var(--green-500)" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Technical Integrity
                    </h4>
                    <div className="geo-tech-grid">
                        <div>
                            <span className="geo-tech-label">Device ID:</span>
                            <span className="geo-tech-value">MIL-STD-810G-402</span>
                        </div>
                        <div>
                            <span className="geo-tech-label">Network Status:</span>
                            <span className="geo-tech-value geo-tech-secure">SECURE MESH</span>
                        </div>
                    </div>
                </div>

                {/* Back to project */}
                <button className="btn btn-navy btn-full mt-md" onClick={() => navigate(`/project/${id}`)}>
                    ← Back to Project Details
                </button>
            </div>
            <BottomNav />
        </div>
    );
}
