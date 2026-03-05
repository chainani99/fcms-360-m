import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ProjectDetailScreen.css';

const formatCr = (val) => `₹ ${(val / 10000000).toFixed(0)} Cr`;

const safeDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-IN');
};

export default function ProjectDetailScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

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

    const getStatusPill = (status) => {
        const map = {
            requires_attention: { label: 'Needs attention', class: 'pill-red' },
            on_track: { label: 'On Track', class: 'pill-green' },
            delayed: { label: 'Delayed', class: 'pill-orange' }
        };
        return map[status] || { label: status, class: 'pill-navy' };
    };

    if (loading) {
        return (
            <div className="detail-page">
                <Header />
                <div className="detail-content"><p style={{ padding: 20, textAlign: 'center' }}>Loading...</p></div>
                <BottomNav />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="detail-page">
                <Header />
                <div className="detail-content"><p style={{ padding: 20, textAlign: 'center' }}>Project not found</p></div>
                <BottomNav />
            </div>
        );
    }

    const allotted = project.budget_utilized || 0;
    const balance = (project.budget_allocation || 0) - allotted - (project.budget_withdrawn || 0);
    const geoVerified = project.latitude && project.longitude;

    return (
        <div className="detail-page">
            <Header />
            <div className="detail-content">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    ← {project.project_name}
                </button>
                <p className="detail-sub-loc">
                    <svg width="12" height="12" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {project.location}
                </p>

                {/* Total Projection */}
                <div className="detail-projection">
                    <span className="dp-label">Total Projection:</span>
                    <span className="dp-value">{formatCr(project.budget_allocation || 0)}</span>
                </div>

                {/* Budget Cards */}
                <div className="detail-budget-grid">
                    <div className="db-card">
                        <span className="db-amount">{formatCr(allotted)}</span>
                        <span className="db-label">Utilized</span>
                    </div>
                    <div className="db-card">
                        <span className="db-amount">{formatCr(balance)}</span>
                        <span className="db-label">Balance</span>
                    </div>
                </div>

                {/* Project Details */}
                <div className="detail-section">
                    <h3 className="detail-section-title">Project Details</h3>
                    <div className="detail-info-list">
                        <div className="dil-row">
                            <span className="dil-label">Milestone</span>
                            <span className="dil-value">{project.milestone}</span>
                        </div>
                        <div className="dil-row">
                            <span className="dil-label">Client</span>
                            <span className="dil-value">{project.client_name || '-'}</span>
                        </div>
                        <div className="dil-row">
                            <span className="dil-label">Contractor</span>
                            <span className="dil-value">{project.contractor || '-'}</span>
                        </div>
                        <div className="dil-row">
                            <span className="dil-label">Code Head</span>
                            <span className="dil-value">{project.code_head || '-'}</span>
                        </div>
                        <div className="dil-row">
                            <span className="dil-label">Progress</span>
                            <span className="dil-value">On Track ~ {project.progress}% complete</span>
                        </div>
                        <div className="dil-row">
                            <span className="dil-label">Status</span>
                            <span className={`pill ${getStatusPill(project.status).class}`}>{getStatusPill(project.status).label}</span>
                        </div>
                    </div>
                    <div className="progress-bar mt-sm">
                        <div className="progress-fill" style={{ width: `${project.progress}%`, background: 'var(--green-500)' }}></div>
                    </div>
                </div>

                {/* Collapsible Details */}
                <div className="detail-section">
                    <div className="collapse-row" onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
                        <span>Additional Details</span>
                        <span style={{ transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)' }}>▾</span>
                    </div>
                    {!collapsed && (
                        <div className="fade-in">
                            <div className="detail-item-row">
                                <span className="detail-step-dot"></span>
                                <span>Formation: {project.formation}</span>
                            </div>
                            <div className="detail-item-row">
                                <span className="detail-step-dot"></span>
                                <span>Start: {safeDate(project.start_date)}</span>
                            </div>
                            <div className="detail-item-row">
                                <span className="detail-step-dot"></span>
                                <span>End: {safeDate(project.end_date)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Milestones Timeline */}
                {project.milestones && project.milestones.length > 0 && (
                    <div className="detail-section">
                        <h3 className="detail-section-title">📋 Milestone Planning</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                            {project.milestones.map((ms, idx) => {
                                const statusMap = {
                                    completed: { label: '✓ Completed', class: 'pill-green' },
                                    in_progress: { label: '⏳ In Progress', class: 'pill-orange' },
                                    pending: { label: '○ Pending', class: 'pill-navy' }
                                };
                                const st = statusMap[ms.status] || statusMap.pending;
                                return (
                                    <div key={ms.milestone_id || idx} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: idx < project.milestones.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                                        <div style={{ width: 3, borderRadius: 2, background: ms.status === 'completed' ? 'var(--green-500)' : ms.status === 'in_progress' ? 'var(--orange-500)' : 'var(--border-light)' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{ms.title}</span>
                                                <span className={`pill ${st.class}`} style={{ fontSize: 10 }}>{st.label}</span>
                                            </div>
                                            {ms.code_head && (
                                                <a
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); navigate(`/billing?code_head=${ms.code_head}`); }}
                                                    style={{ fontSize: 11, color: 'var(--blue-500)', textDecoration: 'none', fontWeight: 600 }}
                                                >
                                                    💰 {ms.code_head} → View Billing
                                                </a>
                                            )}
                                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>
                                                {ms.start_date && new Date(ms.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                {ms.end_date && ` → ${new Date(ms.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Geo Tagging */}
                <div className="detail-section">
                    <h3 className="detail-section-title">Geo-Tagging Validation</h3>
                    <div className="geo-badges">
                        {geoVerified && <span className="pill pill-green">✓ GPS Verified</span>}
                        <span className="pill pill-blue">🔒 timestamp locked</span>
                    </div>
                </div>

                {/* Site photos & geo nav */}
                <div className="detail-section">
                    <div className="site-images-grid">
                        <div className="site-image-placeholder">
                            <svg width="32" height="32" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21,15 16,10 5,21" />
                            </svg>
                        </div>
                        <div className="site-image-placeholder">
                            <svg width="32" height="32" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21,15 16,10 5,21" />
                            </svg>
                        </div>
                    </div>
                    <button className="btn btn-navy btn-full mt-md" onClick={() => navigate(`/geo/${id}`)}>
                        📍 View Geo-Tagging Details →
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
