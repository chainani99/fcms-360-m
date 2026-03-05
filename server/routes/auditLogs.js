const express = require('express');
const router = express.Router();
const { authMiddleware, roleAuth } = require('../middleware/auth');
const { getAuditLogs } = require('../middleware/audit');

router.get('/', authMiddleware, roleAuth('GE', 'CWE', 'CE', 'Command', 'E-in-C'), (req, res) => {
    const { userId, entityType, from, to } = req.query;
    const logs = getAuditLogs({ userId, entityType, from, to });
    res.json({ total: logs.length, logs });
});

module.exports = router;
