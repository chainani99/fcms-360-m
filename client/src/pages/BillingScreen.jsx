import { useState, useEffect } from 'react';
import { billingApi } from '../lib/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './BillingScreen.css';

const formatAmt = (v) => `₹ ${(v / 100000).toFixed(1)}L`;

export default function BillingScreen() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [bills, setBills] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        try {
            const data = await billingApi.list();
            setBills(data.bills || []);
            setStats(data.stats || {});
        } catch (err) {
            console.error('Failed to load bills:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = bills.filter(b => {
        const matchSearch = !search ||
            b.bill_number.toLowerCase().includes(search.toLowerCase()) ||
            b.contractor.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusOptions = [
        { value: '', label: 'All' },
        { value: 'received', label: 'Received' },
        { value: 'pending_approval', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' }
    ];

    const getDueText = (bill) => {
        if (bill.status !== 'overdue' || !bill.due_date) return '';
        const due = new Date(bill.due_date);
        const now = new Date();
        const diff = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `Overdue ${diff}d` : '';
    };

    return (
        <div className="billing-page">
            <Header />
            <div className="billing-content">
                <div className="billing-header-row">
                    <button className="detail-back" onClick={() => window.history.back()}>← </button>
                    <div>
                        <h2 className="billing-heading">Automated Billing</h2>
                        <p className="billing-sub">Control billing cycles, deviations & payment release.</p>
                    </div>
                </div>

                {/* Search */}
                <div className="billing-search">
                    <svg width="16" height="16" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Ex: BILL-2024-0847"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className={`filter-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
                        <svg width="16" height="16" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
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

                {/* Average Billing Cycle */}
                <div className="billing-cycle-badge">
                    <span>Average Billing Cycle: <strong>{stats.average_billing_cycle || 12} Days</strong></span>
                </div>

                {/* Stat cards */}
                <div className="billing-stats-grid">
                    <div className="bill-stat-card">
                        <span className="bsc-number text-green">{stats.total_received || 0}</span>
                        <span className="bsc-label">Total Received</span>
                    </div>
                    <div className="bill-stat-card">
                        <span className="bsc-number text-red">{stats.pending_approval || 0}</span>
                        <span className="bsc-label">Pending Approval</span>
                    </div>
                    <div className="bill-stat-card">
                        <span className="bsc-number text-green">{stats.paid || 0}</span>
                        <span className="bsc-label">Paid</span>
                    </div>
                    <div className="bill-stat-card">
                        <span className="bsc-number text-red">{stats.overdue || 0}</span>
                        <span className="bsc-label">Over Due</span>
                    </div>
                </div>

                {/* Bills list */}
                <h3 className="billing-list-title">{statusFilter ? statusOptions.find(o => o.value === statusFilter)?.label : 'All Bills'} ({filtered.length})</h3>
                <div className="bill-list">
                    {loading ? (
                        <div className="empty-state"><p>Loading bills...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state"><p>No bills found</p></div>
                    ) : (
                        filtered.map((bill, idx) => (
                            <div key={bill.billing_id} className="bill-item fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
                                <div className="bill-item-top">
                                    <div>
                                        <span className="bill-number">{bill.bill_number}</span>
                                        <span className="bill-dot">•</span>
                                        <span className="bill-contractor">{bill.contractor}</span>
                                    </div>
                                    <span className="bill-amount">{formatAmt(bill.amount)}</span>
                                </div>
                                <p className="bill-project">{bill.project_id?.slice(0, 8)}...</p>
                                <div className="bill-item-bottom">
                                    {bill.status === 'overdue' && (
                                        <>
                                            <span className="pill pill-red">Over Due</span>
                                            <span className="bill-due-text">{getDueText(bill)} →</span>
                                        </>
                                    )}
                                    {bill.status === 'paid' && <span className="pill pill-green">Paid</span>}
                                    {bill.status === 'pending_approval' && <span className="pill pill-orange">Pending</span>}
                                    {bill.status === 'received' && <span className="pill pill-blue">Received</span>}
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
