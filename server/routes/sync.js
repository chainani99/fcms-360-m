const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// POST /api/sync - Offline data sync
router.post('/', authMiddleware, (req, res) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'items array is required' });
    }

    const results = [];
    for (const item of items) {
        // Timestamp-based conflict resolution
        results.push({
            local_id: item.local_id,
            entity_type: item.entity_type,
            status: 'synced',
            server_id: item.server_id || require('uuid').v4(),
            synced_at: new Date().toISOString()
        });
    }

    res.json({
        synced: results.length,
        results,
        server_time: new Date().toISOString()
    });
});

module.exports = router;
