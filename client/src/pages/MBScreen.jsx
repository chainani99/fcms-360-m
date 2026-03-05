import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mbApi, measurementsApi, projectsApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './MBScreen.css';

export default function MBListScreen() {
    const navigate = useNavigate();
    const [mbList, setMbList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMBs();
    }, []);

    const loadMBs = async () => {
        try {
            const data = await mbApi.list();
            setMbList(data.measurementBooks || []);
        } catch (err) {
            console.error('Failed to load MBs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusPill = (status) => {
        const map = {
            draft: 'pill-navy', submitted: 'pill-blue',
            verified: 'pill-orange', approved: 'pill-green', locked: 'pill-red'
        };
        return map[status] || 'pill-navy';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="mb-page">
            <Header />
            <div className="mb-content">
                <div className="mb-top-row">
                    <h2 className="mb-heading">Measurement Books</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/emb/new')}>+ New MB</button>
                </div>

                <div className="mb-list">
                    {loading ? (
                        <div className="empty-state"><p>Loading measurement books...</p></div>
                    ) : mbList.length === 0 ? (
                        <div className="empty-state"><p>No measurement books yet</p></div>
                    ) : (
                        mbList.map((mb, idx) => (
                            <div key={mb.mb_id} className="mb-card fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="mb-card-top">
                                    <span className="mb-number">{mb.mb_number}</span>
                                    <span className={`pill ${getStatusPill(mb.status)}`}>{mb.status}</span>
                                </div>
                                <p className="mb-project">{mb.project_id?.slice(0, 8)}...</p>
                                <div className="mb-card-meta">
                                    <span>{formatDate(mb.created_at)}</span>
                                    <span>Created</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export function MBEntryScreen() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        project: '',
        workItem: '',
        quantity: '',
        unit: 'cum',
        remarks: '',
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectsApi.list();
            setProjects(data.projects || []);
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.project) { setError('Please select a project'); return; }
        if (!formData.workItem) { setError('Please enter a work item'); return; }
        if (!formData.quantity) { setError('Please enter quantity'); return; }

        setError('');
        setSaving(true);

        try {
            // Step 1: Create MB
            const mb = await mbApi.create({ project_id: formData.project });

            // Step 2: Create measurement entry
            await measurementsApi.create({
                mb_id: mb.mb_id,
                work_item: formData.workItem,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                remarks: formData.remarks,
            });

            setSuccess(true);
            setTimeout(() => navigate('/emb'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to save measurement');
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="mb-page">
                <Header />
                <div className="mb-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <div className="success-modal fade-in" style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)', padding: '40px 30px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <circle cx="30" cy="30" r="28" fill="#28a745" stroke="#28a745" strokeWidth="2" />
                            <path d="M18 30l8 8 16-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2 style={{ marginTop: 16 }}>Measurement Saved!</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8 }}>MB number auto-generated. Redirecting...</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="mb-page">
            <Header />
            <div className="mb-content">
                <button className="detail-back" onClick={() => navigate(-1)}>← New Measurement Entry</button>
                <p className="mb-auto-number">MB Number will be auto-generated</p>

                <form className="mb-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Project</label>
                        <select className="input" value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })}>
                            <option value="">Choose project...</option>
                            {projects.map(p => (
                                <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Work Item</label>
                        <input className="input" placeholder="e.g. RCC Foundation Work" value={formData.workItem}
                            onChange={e => setFormData({ ...formData, workItem: e.target.value })} />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Quantity</label>
                            <input className="input" type="number" step="0.001" placeholder="0.000" value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Unit</label>
                            <select className="input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                                <option value="cum">cum</option>
                                <option value="sqm">sqm</option>
                                <option value="rm">rm</option>
                                <option value="nos">nos</option>
                                <option value="kg">kg</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Remarks</label>
                        <textarea className="input" rows={3} placeholder="Add measurement remarks..."
                            value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Site Images</label>
                        <div className="upload-area">
                            <svg width="32" height="32" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Tap to capture or upload images</span>
                            <span className="upload-sub">GPS & timestamp will be auto-recorded</span>
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--red-500)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

                    <button type="submit" className="btn btn-primary btn-full mt-lg" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Measurement'}
                    </button>
                </form>
            </div>
            <BottomNav />
        </div>
    );
}
