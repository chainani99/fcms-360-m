import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './BudgetScreen.css';

const formatCr = (v) => `₹ ${(v / 10000000).toFixed(0)} Cr`;

export default function BudgetScreen() {
    const navigate = useNavigate();
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBudget();
    }, []);

    const loadBudget = async () => {
        try {
            const data = await budgetApi.overview();
            setBudget(data);
        } catch (err) {
            console.error('Failed to load budget:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !budget) {
        return (
            <div className="budget-page">
                <Header />
                <div className="budget-content"><p style={{ padding: 20, textAlign: 'center' }}>Loading budget...</p></div>
                <BottomNav />
            </div>
        );
    }

    const { summary, code_heads, risk_highlights } = budget;
    const utilizationPct = summary.total_projection > 0 ? Math.round((summary.total_utilized / summary.total_projection) * 100) : 0;
    const allottedPct = summary.total_projection > 0 ? 65 : 0; // simplified
    const balancePct = summary.total_projection > 0 ? Math.round((summary.total_balance / summary.total_projection) * 100) : 0;

    return (
        <div className="budget-page">
            <Header />
            <div className="budget-content">
                <h2 className="budget-heading">Budget Management</h2>

                {/* Project-Level Budget */}
                <div className="budget-section">
                    <div className="bs-header">
                        <span className="bs-icon">📊</span>
                        <div>
                            <h3 className="bs-title">Project-Level Budget</h3>
                            <p className="bs-sub">Aggregated across all projects</p>
                        </div>
                    </div>
                    <div className="bs-stats">
                        <div className="bs-stat">
                            <span className="bs-stat-label">Total Projection:</span>
                            <span className="bs-stat-value">{formatCr(summary.total_projection)}</span>
                        </div>
                        <div className="bs-stat">
                            <span className="bs-stat-label">Total Active Projects:</span>
                            <span className="bs-stat-value">{summary.active_projects}</span>
                        </div>
                    </div>
                    <div className="utilization-section">
                        <div className="util-header">
                            <span className="util-label">UTILIZATION STATUS</span>
                            <span className="util-pct">{summary.utilization_percent}% UTILIZED</span>
                        </div>
                        <div className="util-bar">
                            <div className="util-seg" style={{ width: `${allottedPct}%`, background: '#0d47a1' }}></div>
                            <div className="util-seg" style={{ width: `${utilizationPct}%`, background: '#1565c0' }}></div>
                            <div className="util-seg" style={{ width: '0%', background: '#ef6c00' }}></div>
                            <div className="util-seg" style={{ width: `${balancePct}%`, background: '#66bb6a' }}></div>
                        </div>
                        <div className="util-legend">
                            <span><span className="legend-dot" style={{ background: '#0d47a1' }}></span> Allotted ({formatCr(summary.total_projection)})</span>
                            <span><span className="legend-dot" style={{ background: '#1565c0' }}></span> Utilized ({formatCr(summary.total_utilized)})</span>
                            <span><span className="legend-dot" style={{ background: '#ef6c00' }}></span> Withdrawn ({formatCr(summary.total_withdrawn)})</span>
                            <span><span className="legend-dot" style={{ background: '#66bb6a' }}></span> Balance ({formatCr(summary.total_balance)})</span>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-full mt-md" onClick={() => navigate('/projects')}>View All Projects →</button>
                </div>

                {/* Code Head-Level Budget */}
                <div className="budget-section">
                    <div className="bs-header">
                        <span className="bs-icon">📋</span>
                        <div>
                            <h3 className="bs-title">Code Head-Level Budget</h3>
                            <p className="bs-sub">Aggregated by budget code across all projects</p>
                        </div>
                    </div>
                    {Object.entries(code_heads).map(([head, data]) => (
                        <div key={head} className="bs-stats" style={{ marginBottom: 8 }}>
                            <div className="bs-stat">
                                <span className="bs-stat-label">{head}:</span>
                                <span className="bs-stat-value">{formatCr(data.allocation)} ({data.projects} projects)</span>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-primary btn-full mt-md" onClick={() => navigate('/projects')}>View Analytics →</button>
                </div>

                {/* Command Value-Level Budget */}
                <div className="budget-section">
                    <div className="bs-header">
                        <span className="bs-icon">🏛</span>
                        <div>
                            <h3 className="bs-title">Command Value-Level Budget</h3>
                            <p className="bs-sub">Oversight to prevent financial overrun and Zero Funding surrender</p>
                        </div>
                    </div>
                    <h4 className="risk-title">RISK HIGHLIGHTS</h4>
                    <div className="risk-item">
                        <span className="risk-dot"></span>
                        <span className="risk-label">Unspent Allocation</span>
                        <span className="risk-value">{formatCr(risk_highlights.unspent_allocation)}</span>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
