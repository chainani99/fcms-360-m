import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi, usersApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './AddProjectScreen.css';

const defaultMilestones = [
    { title: 'Order Received', code_head: '', start_date: '', end_date: '', expanded: true, sub_milestones: [] },
    { title: 'Contract Review & Kick-Off', code_head: '', start_date: '', end_date: '', expanded: false, sub_milestones: [] },
    { title: 'Design Phase', code_head: '', start_date: '', end_date: '', expanded: false, sub_milestones: [] },
    { title: 'Procurement', code_head: '', start_date: '', end_date: '', expanded: false, sub_milestones: [] },
    { title: 'Fabrication', code_head: '', start_date: '', end_date: '', expanded: false, sub_milestones: [] },
];

const facadeTypes = ['ACP', 'Glass', 'Stone', 'HPL', 'Metal', 'Composite'];

export default function AddProjectScreen() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        project_name: '',
        location: '',
        client_name: '',
        work_order_value: '',
        start_date: '',
        end_date: '',
        facade_type: '',
        total_area_sqft: '',
        design_consultant: '',
        contractor: '',
        sub_contractors: '',
        assigned_engineer: '',
    });

    const [milestones, setMilestones] = useState(defaultMilestones);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await usersApi.list();
            setUsers(data || []);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const updateMilestone = (idx, field, value) => {
        const updated = [...milestones];
        updated[idx] = { ...updated[idx], [field]: value };
        setMilestones(updated);
    };

    const toggleMilestone = (idx) => {
        const updated = [...milestones];
        updated[idx].expanded = !updated[idx].expanded;
        setMilestones(updated);
    };

    const removeMilestone = (idx) => {
        setMilestones(milestones.filter((_, i) => i !== idx));
    };

    const addMilestone = () => {
        setMilestones([...milestones, { title: '', code_head: '', start_date: '', end_date: '', expanded: true, sub_milestones: [] }]);
    };

    const addSubMilestone = (msIdx) => {
        const updated = [...milestones];
        updated[msIdx].sub_milestones = [...(updated[msIdx].sub_milestones || []), { title: '', start_date: '', end_date: '' }];
        setMilestones(updated);
    };

    const updateSubMilestone = (msIdx, subIdx, field, value) => {
        const updated = [...milestones];
        updated[msIdx].sub_milestones[subIdx] = { ...updated[msIdx].sub_milestones[subIdx], [field]: value };
        setMilestones(updated);
    };

    const removeSubMilestone = (msIdx, subIdx) => {
        const updated = [...milestones];
        updated[msIdx].sub_milestones = updated[msIdx].sub_milestones.filter((_, i) => i !== subIdx);
        setMilestones(updated);
    };

    const handleSubmit = async () => {
        if (!form.project_name) { setError('Project name is required'); return; }
        if (!form.location) { setError('Location is required'); return; }
        if (!form.contractor) { setError('Contractor is required'); return; }
        setError('');
        setSaving(true);

        try {
            const payload = {
                ...form,
                work_order_value: parseFloat(form.work_order_value) || 0,
                total_area_sqft: parseFloat(form.total_area_sqft) || 0,
                sub_contractors: form.sub_contractors ? form.sub_contractors.split(',').map(s => s.trim()) : [],
                budget_allocation: parseFloat(form.work_order_value) || 0,
                budget_utilized: 0,
                budget_withdrawn: 0,
                milestones: milestones.filter(ms => ms.title).map(ms => ({
                    title: ms.title,
                    code_head: ms.code_head,
                    start_date: ms.start_date || null,
                    end_date: ms.end_date || null,
                    sub_milestones: (ms.sub_milestones || []).filter(sm => sm.title).map(sm => ({
                        title: sm.title,
                        start_date: sm.start_date || null,
                        end_date: sm.end_date || null,
                        status: 'pending'
                    }))
                }))
            };

            await projectsApi.create(payload);
            navigate('/projects');
        } catch (err) {
            setError(err.message || 'Failed to create project');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="add-project-page">
            <Header />
            <div className="add-project-content">
                <button className="detail-back" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Add New Project</button>

                {/* ===== Section 1: Project Information ===== */}
                <div className="form-section">
                    <div className="section-heading">
                        <span>🏗</span> Project Information
                    </div>
                    <div className="section-body">
                        <div className="fg">
                            <label><span className="field-icon">🏢</span> Project Name</label>
                            <input placeholder="Grand Central" value={form.project_name} onChange={e => updateForm('project_name', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">📍</span> Project Location</label>
                            <input placeholder="Vishakapatnam, Madurawada, Andhrapradesh" value={form.location} onChange={e => updateForm('location', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">👤</span> Client Name</label>
                            <input placeholder="John" value={form.client_name} onChange={e => updateForm('client_name', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">₹</span> Work Order Value</label>
                            <input type="number" placeholder="42,00,000" value={form.work_order_value} onChange={e => updateForm('work_order_value', e.target.value)} />
                        </div>
                        <div className="fg-row">
                            <div className="fg">
                                <label><span className="field-icon">📅</span> Project Start Date</label>
                                <input type="date" value={form.start_date} onChange={e => updateForm('start_date', e.target.value)} />
                            </div>
                            <div className="fg">
                                <label><span className="field-icon">📅</span> Expected End Date</label>
                                <input type="date" value={form.end_date} onChange={e => updateForm('end_date', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Section 2: Facade Construction Details ===== */}
                <div className="form-section">
                    <div className="section-heading orange">
                        <span>🏛</span> Facade Construction Details
                    </div>
                    <div className="section-body">
                        <div className="fg">
                            <label><span className="field-icon">🧱</span> Facade Type</label>
                            <select value={form.facade_type} onChange={e => updateForm('facade_type', e.target.value)}>
                                <option value="">Select type...</option>
                                {facadeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">📐</span> Total Area (Sq.ft)</label>
                            <input type="number" placeholder="12,000" value={form.total_area_sqft} onChange={e => updateForm('total_area_sqft', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">👷</span> Design Consultant</label>
                            <input placeholder="Morphogenesis Architects" value={form.design_consultant} onChange={e => updateForm('design_consultant', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">🔧</span> Contractor</label>
                            <input placeholder="FacadeX Constructions Pvt Ltd" value={form.contractor} onChange={e => updateForm('contractor', e.target.value)} />
                        </div>
                        <div className="fg">
                            <label><span className="field-icon">👥</span> Sub Contractors (if any)</label>
                            <textarea rows={2} placeholder="Enter Sub Contractors (Optional), comma separated" value={form.sub_contractors} onChange={e => updateForm('sub_contractors', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* ===== Section 3: Roles & Team Setup ===== */}
                <div className="form-section">
                    <div className="section-heading blue">
                        <span>👥</span> Roles & Team Setup
                    </div>
                    <div className="section-body">
                        <div className="fg">
                            <label>Assign Project Engineer</label>
                            <select value={form.assigned_engineer} onChange={e => updateForm('assigned_engineer', e.target.value)}>
                                <option value="">Select engineer...</option>
                                {users.map(u => (
                                    <option key={u.user_id} value={u.user_id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ===== Section 4: Milestone Planning ===== */}
                <div className="form-section">
                    <div className="section-heading green">
                        <span>📋</span> Mile Stone Planning
                        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 500 }}>{milestones.length} milestones</span>
                    </div>
                    <div className="section-body">
                        <div className="milestone-list">
                            {milestones.map((ms, idx) => (
                                <div key={idx} className="milestone-item">
                                    <div className="milestone-header" onClick={() => toggleMilestone(idx)}>
                                        <div className="milestone-header-left">
                                            <span className={`milestone-arrow ${ms.expanded ? 'open' : ''}`}>▶</span>
                                            <span className="milestone-title-text">{ms.title || `Milestone ${idx + 1}`}</span>
                                        </div>
                                        <button className="milestone-delete" onClick={(e) => { e.stopPropagation(); removeMilestone(idx); }}>
                                            <svg width="16" height="16" fill="none" stroke="var(--red-500)" strokeWidth="2" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="2" fill="var(--red-100)" stroke="var(--red-500)" />
                                                <line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                                            </svg>
                                        </button>
                                    </div>
                                    {ms.expanded && (
                                        <div className="milestone-body fade-in">
                                            <div className="fg">
                                                <label>Mile Stone Title ⓘ</label>
                                                <input placeholder="Order Received" value={ms.title} onChange={e => updateMilestone(idx, 'title', e.target.value)} />
                                            </div>
                                            <div className="fg">
                                                <label>Code Head</label>
                                                <input placeholder="CWF 208" value={ms.code_head} onChange={e => updateMilestone(idx, 'code_head', e.target.value)} />
                                            </div>
                                            <div className="fg-row">
                                                <div className="fg">
                                                    <label><span className="field-icon">📅</span> Start Date</label>
                                                    <input type="date" value={ms.start_date} onChange={e => updateMilestone(idx, 'start_date', e.target.value)} />
                                                </div>
                                                <div className="fg">
                                                    <label><span className="field-icon">📅</span> End Date</label>
                                                    <input type="date" value={ms.end_date} onChange={e => updateMilestone(idx, 'end_date', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Sub Milestones */}
                                            <div style={{ marginTop: 10 }}>
                                                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Sub Milestones Information</label>
                                                <div className="sub-milestone-list">
                                                    {(ms.sub_milestones || []).map((sm, subIdx) => (
                                                        <div key={subIdx} className="sub-milestone-item">
                                                            <div style={{ flex: 2 }}>
                                                                <div className="fg">
                                                                    <label>Mile Stone Title ⓘ</label>
                                                                    <input placeholder="Vendor Selection" value={sm.title} onChange={e => updateSubMilestone(idx, subIdx, 'title', e.target.value)} />
                                                                </div>
                                                                <div className="fg-row">
                                                                    <div className="fg">
                                                                        <label>Start Date</label>
                                                                        <input type="date" value={sm.start_date} onChange={e => updateSubMilestone(idx, subIdx, 'start_date', e.target.value)} />
                                                                    </div>
                                                                    <div className="fg">
                                                                        <label>End Date</label>
                                                                        <input type="date" value={sm.end_date} onChange={e => updateSubMilestone(idx, subIdx, 'end_date', e.target.value)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button className="sub-delete-btn" onClick={() => removeSubMilestone(idx, subIdx)}>
                                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" fill="var(--red-100)" stroke="var(--red-500)" />
                                                                    <line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="add-sub-btn" onClick={() => addSubMilestone(idx)}>
                                                    + Add Sub-Milestone
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="add-milestone-btn" onClick={addMilestone}>
                            ⊕ Add Mile Stone
                        </button>
                    </div>
                </div>

                {error && <p style={{ color: 'var(--red-500)', fontSize: 13, padding: '0 16px', marginBottom: 12 }}>{error}</p>}

                {/* Footer */}
                <div className="form-footer">
                    <button className="btn btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Creating...' : 'Add Project'}
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
