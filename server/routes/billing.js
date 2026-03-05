const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const demoData = require('../models/demoData');

// GET /api/billing
router.get('/', authMiddleware, (req, res) => {
    let bills = [...demoData.billingRecords];
    const { status, search, project_id } = req.query;

    if (status) bills = bills.filter(b => b.status === status);
    if (project_id) bills = bills.filter(b => b.project_id === project_id);
    if (search) {
        const s = search.toLowerCase();
        bills = bills.filter(b =>
            b.bill_number.toLowerCase().includes(s) ||
            b.contractor.toLowerCase().includes(s)
        );
    }

    const stats = {
        total_received: demoData.billingRecords.filter(b => b.status === 'received').length,
        pending_approval: demoData.billingRecords.filter(b => b.status === 'pending_approval').length,
        paid: demoData.billingRecords.filter(b => b.status === 'paid').length,
        overdue: demoData.billingRecords.filter(b => b.status === 'overdue').length,
        average_billing_cycle: 12 // days (demo)
    };

    res.json({ stats, total: bills.length, bills });
});

module.exports = router;
