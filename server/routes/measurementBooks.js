const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');
const mbNumberService = require('../services/mbNumberService');
const demoData = require('../models/demoData');

// GET /api/mb
router.get('/', authMiddleware, (req, res) => {
    let mbs = [...demoData.measurementBooks];
    const { project_id, status } = req.query;
    if (project_id) mbs = mbs.filter(m => m.project_id === project_id);
    if (status) mbs = mbs.filter(m => m.status === status);
    res.json({ total: mbs.length, measurementBooks: mbs });
});

// GET /api/mb/:id
router.get('/:id', authMiddleware, (req, res) => {
    const mb = demoData.measurementBooks.find(m => m.mb_id === req.params.id);
    if (!mb) return res.status(404).json({ error: 'Measurement book not found' });

    const measurements = demoData.measurements.filter(m => m.mb_id === mb.mb_id);
    const approvals = demoData.approvals.filter(a => a.mb_id === mb.mb_id);

    res.json({ ...mb, measurements, approvals });
});

// POST /api/mb - Auto-generate MB number
router.post('/', authMiddleware, auditMiddleware('create', 'measurement_book'), (req, res) => {
    const { project_id, contract_id } = req.body;
    if (!project_id) return res.status(400).json({ error: 'project_id is required' });

    const project = demoData.projects.find(p => p.project_id === project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const formation = req.user.formation || project.formation || 'CE-SC';
    const contractKey = contract_id || `CONTRACT${String(demoData.measurementBooks.length + 1).padStart(3, '0')}`;

    const mbNumber = mbNumberService.generate(formation, contractKey);

    const mb = {
        mb_id: uuidv4(),
        mb_number: mbNumber,
        project_id,
        created_by: req.user.user_id,
        status: 'draft',
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    demoData.measurementBooks.push(mb);
    res.status(201).json(mb);
});

module.exports = router;
