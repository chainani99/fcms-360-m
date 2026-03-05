const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');
const approvalService = require('../services/approvalService');
const demoData = require('../models/demoData');

// GET /api/approvals/:mbId
router.get('/:mbId', authMiddleware, (req, res) => {
    const approvals = demoData.approvals.filter(a => a.mb_id === req.params.mbId);
    const status = approvalService.getApprovalStatus(approvals);
    res.json({ approvals, status });
});

// POST /api/approvals
router.post('/', authMiddleware, auditMiddleware('approve', 'measurement_book'), (req, res) => {
    const { mb_id, measurement_id, remarks } = req.body;
    if (!mb_id) return res.status(400).json({ error: 'mb_id is required' });

    const mb = demoData.measurementBooks.find(m => m.mb_id === mb_id);
    if (!mb) return res.status(404).json({ error: 'Measurement book not found' });
    if (mb.is_locked) return res.status(400).json({ error: 'MB is already locked/fully approved' });

    const existingApprovals = demoData.approvals.filter(a => a.mb_id === mb_id);

    if (!approvalService.canApprove(req.user.role, existingApprovals)) {
        return res.status(403).json({
            error: 'Cannot approve: previous approval steps not completed',
            chain: approvalService.getApprovalStatus(existingApprovals)
        });
    }

    const approval = {
        approval_id: uuidv4(),
        mb_id,
        measurement_id: measurement_id || null,
        approved_by: req.user.user_id,
        role: req.user.role,
        status: 'approved',
        remarks: remarks || '',
        approval_date: new Date().toISOString()
    };

    demoData.approvals.push(approval);

    // Check if fully approved → lock MB
    const allApprovals = demoData.approvals.filter(a => a.mb_id === mb_id);
    if (approvalService.isFullyApproved(allApprovals)) {
        mb.is_locked = true;
        mb.status = 'locked';
    }

    res.status(201).json({
        approval,
        mbStatus: approvalService.getApprovalStatus(allApprovals)
    });
});

module.exports = router;
