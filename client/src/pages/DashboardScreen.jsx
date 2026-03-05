import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { projectsApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './DashboardScreen.css';

const categoryConfig = {
    critical_issues: { label: 'Critical Issues', color: '#dc3545', bg: '#fde8ea', icon: '⚠' },
    weather_risk: { label: 'Weather Risk', color: '#fd7e14', bg: '#fff3e0', icon: '🌧' },
    budget_issue: { label: 'Budget Issue', color: '#0d6efd', bg: '#e3f2fd', icon: '₹' },
    all_safe: { label: 'All Safe', color: '#28a745', bg: '#e8f5e9', icon: '✓' }
};

export default function DashboardScreen() {
    const { user } = useAuth();
    const { updateLastSync } = useOffline();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateLastSync();
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

    const categories = Object.entries(categoryConfig).map(([key, config]) => ({
        key,
        ...config,
        count: projects.filter(p => p.category === key).length
    }));

    const filteredProjects = activeCategory
        ? projects.filter(p => p.category === activeCategory)
        : projects;

    const getStatusPill = (status) => {
        const map = {
            requires_attention: { label: 'Needs attention', class: 'pill-red' },
            on_track: { label: 'On Track', class: 'pill-green' },
            delayed: { label: 'Delayed', class: 'pill-orange' },
            completed: { label: 'Completed', class: 'pill-blue' }
        };
        return map[status] || { label: status, class: 'pill-navy' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="dashboard-page">
            <Header />
            <div className="dashboard-content">
                {/* Alerts Overview */}
                <div className="alerts-header">
                    <h2 className="alerts-title">Alerts Overview</h2>
                    <div className="total-projects-badge">
                        <span className="tp-icon">📁</span>
                        <span className="tp-label">Total Projects</span>
                        <span className="tp-count">{String(projects.length).padStart(2, '0')}</span>
                    </div>
                </div>

                {/* Category Cards */}
                <div className="category-grid">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            className={`category-card ${activeCategory === cat.key ? 'active' : ''}`}
                            style={{ '--cat-bg': cat.bg, '--cat-color': cat.color }}
                            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                        >
                            <div className="cat-icon-box" style={{ background: cat.bg }}>
                                <span style={{ color: cat.color, fontSize: '20px' }}>{cat.icon}</span>
                            </div>
                            <span className="cat-label">{cat.label}</span>
                            <span className="cat-count">{cat.count} Projects</span>
                        </button>
                    ))}
                </div>

                {/* Section Title */}
                <div className="section-header">
                    <h3>{activeCategory ? categoryConfig[activeCategory]?.label : 'All Issues'} ({filteredProjects.length})</h3>
                </div>

                {/* Project Cards */}
                <div className="project-list">
                    {loading ? (
                        <div className="empty-state"><p>Loading projects...</p></div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="empty-state">
                            <p>No {activeCategory ? categoryConfig[activeCategory]?.label.toLowerCase() : 'issues'}</p>
                            <span className="text-secondary text-sm">
                                {activeCategory === 'budget_issue' ? 'No Budget Issues' : 'No projects in this category'}
                            </span>
                        </div>
                    ) : (
                        filteredProjects.map((project, idx) => (
                            <div key={project.project_id} className="project-card fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="project-card-top">
                                    <span className="project-time">Today, 8:17 AM</span>
                                </div>
                                <h4 className="project-card-name">{project.project_name}</h4>
                                <div className="project-card-location">
                                    <svg width="12" height="12" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{project.location}</span>
                                    <a href="#" className="view-map-link" onClick={(e) => { e.preventDefault(); navigate(`/geo/${project.project_id}`); }}>View Map</a>
                                </div>

                                <div className="project-card-pill-row">
                                    <span className={`pill ${getStatusPill(project.status).class}`}>
                                        {getStatusPill(project.status).label}
                                    </span>
                                </div>

                                <div className="project-card-details">
                                    <div className="pcd-row">
                                        <span className="pcd-label">Milestone</span>
                                        <span className="pcd-value">{project.milestone}</span>
                                    </div>
                                    <div className="pcd-row">
                                        <span className="pcd-label">Progress</span>
                                        <span className="pcd-value">On Track ~ {project.progress}% complete</span>
                                    </div>
                                    <div className="pcd-row">
                                        <span className="pcd-label">On Dates</span>
                                        <span className="pcd-value">{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-navy btn-full mt-md"
                                    onClick={() => navigate(`/project/${project.project_id}`)}
                                >
                                    View Details →
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {filteredProjects.length > 2 && (
                    <div className="scroll-more">
                        <button className="scroll-more-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>↓ Scroll to see more</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
