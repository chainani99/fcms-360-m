const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const demoData = require('../models/demoData');

// GET /api/messages?project_id=xxx
router.get('/', authMiddleware, (req, res) => {
    let msgs = [...demoData.messages];
    const { project_id } = req.query;
    if (project_id) msgs = msgs.filter(m => m.project_id === project_id);
    msgs = msgs.filter(m => m.sender_id === req.user.user_id || m.receiver_id === req.user.user_id);
    res.json({ total: msgs.length, messages: msgs });
});

// POST /api/messages
router.post('/', authMiddleware, (req, res) => {
    const { project_id, receiver_id, content } = req.body;
    if (!receiver_id || !content) {
        return res.status(400).json({ error: 'receiver_id and content are required' });
    }
    const msg = {
        message_id: uuidv4(),
        project_id: project_id || null,
        sender_id: req.user.user_id,
        receiver_id,
        content,
        is_read: false,
        created_at: new Date().toISOString()
    };
    demoData.messages.push(msg);
    res.status(201).json(msg);
});

module.exports = router;
