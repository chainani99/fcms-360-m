const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const demoData = require('../models/demoData');

// GET /api/budget/overview
router.get('/overview', authMiddleware, (req, res) => {
    const projects = demoData.projects;
    const totalAllocation = projects.reduce((s, p) => s + (p.budget_allocation || 0), 0);
    const totalUtilized = projects.reduce((s, p) => s + (p.budget_utilized || 0), 0);
    const totalWithdrawn = projects.reduce((s, p) => s + (p.budget_withdrawn || 0), 0);
    const totalBalance = totalAllocation - totalUtilized - totalWithdrawn;

    // Code head breakdown
    const codeHeads = {};
    projects.forEach(p => {
        const head = p.code_head || 'Unclassified';
        if (!codeHeads[head]) {
            codeHeads[head] = { allocation: 0, utilized: 0, withdrawn: 0, balance: 0, projects: 0 };
        }
        codeHeads[head].allocation += p.budget_allocation || 0;
        codeHeads[head].utilized += p.budget_utilized || 0;
        codeHeads[head].withdrawn += p.budget_withdrawn || 0;
        codeHeads[head].balance += (p.budget_allocation || 0) - (p.budget_utilized || 0) - (p.budget_withdrawn || 0);
        codeHeads[head].projects++;
    });

    res.json({
        summary: {
            total_projection: totalAllocation,
            total_utilized: totalUtilized,
            total_withdrawn: totalWithdrawn,
            total_balance: totalBalance,
            active_projects: projects.filter(p => p.status !== 'completed').length,
            utilization_percent: totalAllocation > 0 ? Math.round((totalUtilized / totalAllocation) * 100) : 0
        },
        code_heads: codeHeads,
        risk_highlights: {
            unspent_allocation: totalBalance
        }
    });
});

// GET /api/budget/project/:id
router.get('/project/:id', authMiddleware, (req, res) => {
    const project = demoData.projects.find(p => p.project_id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json({
        project_id: project.project_id,
        project_name: project.project_name,
        code_head: project.code_head,
        allocation: project.budget_allocation,
        utilized: project.budget_utilized,
        withdrawn: project.budget_withdrawn,
        balance: project.budget_allocation - project.budget_utilized - project.budget_withdrawn
    });
});

module.exports = router;
