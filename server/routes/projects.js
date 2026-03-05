const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');
const demoData = require('../models/demoData');

// GET /api/projects
router.get('/', authMiddleware, (req, res) => {
    let projects = [...demoData.projects];
    const { status, category, formation, search } = req.query;
    if (status) projects = projects.filter(p => p.status === status);
    if (category) projects = projects.filter(p => p.category === category);
    if (formation) projects = projects.filter(p => p.formation === formation);
    if (search) {
        const s = search.toLowerCase();
        projects = projects.filter(p =>
            p.project_name.toLowerCase().includes(s) ||
            p.location.toLowerCase().includes(s) ||
            p.contractor.toLowerCase().includes(s)
        );
    }
    res.json({ total: projects.length, projects });
});

// GET /api/projects/:id
router.get('/:id', authMiddleware, (req, res) => {
    const project = demoData.projects.find(p => p.project_id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const projectMilestones = demoData.milestones.filter(m => m.project_id === project.project_id);
    res.json({ ...project, milestones: projectMilestones });
});

// POST /api/projects
router.post('/', authMiddleware, auditMiddleware('create', 'project'), (req, res) => {
    const { milestones: milestonesData, ...projectData } = req.body;
    const project = {
        project_id: uuidv4(),
        ...projectData,
        status: 'on_track',
        progress: 0,
        category: 'all_safe',
        formation: req.user.formation || 'CE-SC',
        assigned_to: req.user.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    demoData.projects.push(project);

    // Create milestones if provided
    if (milestonesData && Array.isArray(milestonesData)) {
        milestonesData.forEach(ms => {
            demoData.milestones.push({
                milestone_id: uuidv4(),
                project_id: project.project_id,
                title: ms.title,
                code_head: ms.code_head || '',
                start_date: ms.start_date || null,
                end_date: ms.end_date || null,
                status: 'pending',
                sub_milestones: ms.sub_milestones || []
            });
        });
    }

    const projectMilestones = demoData.milestones.filter(m => m.project_id === project.project_id);
    res.status(201).json({ ...project, milestones: projectMilestones });
});

// PUT /api/projects/:id
router.put('/:id', authMiddleware, auditMiddleware('update', 'project'), (req, res) => {
    const idx = demoData.projects.findIndex(p => p.project_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    demoData.projects[idx] = { ...demoData.projects[idx], ...req.body, updated_at: new Date().toISOString() };
    res.json(demoData.projects[idx]);
});

module.exports = router;
