const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const demoData = require('../models/demoData');

// GET /api/milestones?project_id=
router.get('/', authMiddleware, (req, res) => {
    let ms = [...demoData.milestones];
    const { project_id, status } = req.query;
    if (project_id) ms = ms.filter(m => m.project_id === project_id);
    if (status) ms = ms.filter(m => m.status === status);
    res.json({ total: ms.length, milestones: ms });
});

// GET /api/milestones/:id
router.get('/:id', authMiddleware, (req, res) => {
    const ms = demoData.milestones.find(m => m.milestone_id === req.params.id);
    if (!ms) return res.status(404).json({ error: 'Milestone not found' });

    // Get billing records linked to this milestone's code_head + project
    const bills = demoData.billingRecords.filter(b =>
        b.project_id === ms.project_id
    );

    res.json({ ...ms, billing: bills });
});

// POST /api/milestones
router.post('/', authMiddleware, (req, res) => {
    const { project_id, title, code_head, start_date, end_date, sub_milestones } = req.body;
    if (!project_id || !title) return res.status(400).json({ error: 'project_id and title are required' });

    const milestone = {
        milestone_id: uuidv4(),
        project_id,
        title,
        code_head: code_head || '',
        start_date: start_date || null,
        end_date: end_date || null,
        status: 'pending',
        sub_milestones: sub_milestones || []
    };

    demoData.milestones.push(milestone);
    res.status(201).json(milestone);
});

// PUT /api/milestones/:id
router.put('/:id', authMiddleware, (req, res) => {
    const idx = demoData.milestones.findIndex(m => m.milestone_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
    demoData.milestones[idx] = { ...demoData.milestones[idx], ...req.body };
    res.json(demoData.milestones[idx]);
});

// DELETE /api/milestones/:id
router.delete('/:id', authMiddleware, (req, res) => {
    const idx = demoData.milestones.findIndex(m => m.milestone_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
    demoData.milestones.splice(idx, 1);
    res.json({ message: 'Milestone deleted' });
});

module.exports = router;
