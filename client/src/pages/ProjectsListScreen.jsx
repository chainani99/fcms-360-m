import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ProjectsListScreen.css';

export default function ProjectsListScreen() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectsApi.list();
            setProjects(data.projects || []);
        } catch (err) {
            console.error('Failed to load projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = projects.filter(p => {
        const matchSearch = !search ||
            p.project_name.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase()) ||
            p.contractor?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget_allocation || 0), 0);
    const formatCr = (v) => `₹ ${(v / 10000000).toFixed(0)} Cr`;

    const getStatusInfo = (status) => {
        const map = {
            requires_attention: { label: 'Needs attention', class: 'pill-red' },
            on_track: { label: 'On Track', class: 'pill-green' },
            delayed: { label: 'Delayed', class: 'pill-orange' }
        };
        return map[status] || { label: status, class: 'pill-navy' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const statusOptions = [
        { value: '', label: 'All' },
        { value: 'on_track', label: 'On Track' },
        { value: 'delayed', label: 'Delayed' },
        { value: 'requires_attention', label: 'Needs Attention' }
    ];

    return (
        <div className="projects-page">
            <Header />
            <div className="projects-content">
                <div className="projects-summary">
                    <div className="proj-summary-item">
                        <span className="proj-sum-number">{projects.filter(p => p.status !== 'completed').length}</span>
                        <span className="proj-sum-label">Total Active</span>
                    </div>
                    <div className="proj-summary-item">
                        <span className="proj-sum-number">{formatCr(totalBudget)}</span>
                        <span className="proj-sum-label">Total Budget</span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="projects-title">All Active Projects ({filtered.length})</h2>
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => navigate('/projects/new')}>+ Add Project</button>
                </div>

                <div className="projects-search">
                    <svg width="16" height="16" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className={`filter-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
                        <svg width="16" height="16" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                        </svg>
                    </button>
                </div>

                {/* Filter dropdown */}
                {showFilter && (
                    <div className="filter-dropdown fade-in">
                        {statusOptions.map(opt => (
                            <button
                                key={opt.value}
                                className={`filter-option ${statusFilter === opt.value ? 'active' : ''}`}
                                onClick={() => { setStatusFilter(opt.value); setShowFilter(false); }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="project-cards">
                    {loading ? (
                        <div className="empty-state"><p>Loading projects...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state"><p>No projects found</p></div>
                    ) : (
                        filtered.map((project, idx) => (
                            <div key={project.project_id} className="proj-card fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
                                <h4 className="proj-card-name">{project.project_name}</h4>
                                <div className="proj-card-location">
                                    <svg width="12" height="12" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{project.location}</span>
                                    <a href="#" className="view-map-link" onClick={(e) => { e.preventDefault(); navigate(`/geo/${project.project_id}`); }}>View Map</a>
                                </div>
                                <div className="proj-card-pill">
                                    <span className={`pill ${getStatusInfo(project.status).class}`}>
                                        {getStatusInfo(project.status).label}
                                    </span>
                                </div>
                                <div className="proj-card-meta">
                                    <div className="pcm-row">
                                        <span className="pcm-label">Milestone</span>
                                        <span className="pcm-value">{project.milestone}</span>
                                    </div>
                                    <div className="pcm-row">
                                        <span className="pcm-label">Progress</span>
                                        <span className="pcm-value">On Track ~ {project.progress}% complete</span>
                                    </div>
                                    <div className="pcm-row">
                                        <span className="pcm-label">On Dates</span>
                                        <span className="pcm-value">{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                                    </div>
                                </div>
                                <div className="progress-bar mt-sm">
                                    <div className="progress-fill" style={{ width: `${project.progress}%`, background: project.progress > 80 ? 'var(--green-500)' : 'var(--navy-900)' }}></div>
                                </div>
                                <button
                                    className="btn btn-primary btn-full mt-md"
                                    onClick={() => navigate(`/project/${project.project_id}`)}
                                >
                                    View Details →
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {filtered.length > 2 && (
                    <div className="scroll-more">
                        <button className="scroll-more-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>↓ Scroll to see more</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
