const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { users } = require('../models/demoData');

router.get('/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.user_id === req.user.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
});

router.get('/', authMiddleware, (req, res) => {
    const safeUsers = users.map(({ password_hash, ...u }) => u);
    res.json(safeUsers);
});

module.exports = router;
