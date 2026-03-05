const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');
const demoData = require('../models/demoData');

// POST /api/measurements
router.post('/', authMiddleware, auditMiddleware('create', 'measurement'), (req, res) => {
    const { mb_id, work_item, quantity, unit, remarks, geo_latitude, geo_longitude, geo_altitude, geo_accuracy } = req.body;
    if (!mb_id || !work_item || !quantity) {
        return res.status(400).json({ error: 'mb_id, work_item, and quantity are required' });
    }

    const mb = demoData.measurementBooks.find(m => m.mb_id === mb_id);
    if (!mb) return res.status(404).json({ error: 'Measurement book not found' });
    if (mb.is_locked) return res.status(400).json({ error: 'Measurement book is locked' });

    const measurement = {
        measurement_id: uuidv4(),
        mb_id,
        work_item,
        quantity,
        unit: unit || 'cum',
        entered_by: req.user.user_id,
        remarks: remarks || '',
        image_reference: null,
        geo_latitude: geo_latitude || null,
        geo_longitude: geo_longitude || null,
        geo_altitude: geo_altitude || null,
        geo_accuracy: geo_accuracy || null,
        entered_date: new Date().toISOString()
    };

    demoData.measurements.push(measurement);
    res.status(201).json(measurement);
});

// PUT /api/measurements/:id
router.put('/:id', authMiddleware, auditMiddleware('update', 'measurement'), (req, res) => {
    const idx = demoData.measurements.findIndex(m => m.measurement_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Measurement not found' });

    const mb = demoData.measurementBooks.find(m => m.mb_id === demoData.measurements[idx].mb_id);
    if (mb && mb.is_locked) return res.status(400).json({ error: 'Measurement book is locked' });

    demoData.measurements[idx] = { ...demoData.measurements[idx], ...req.body };
    res.json(demoData.measurements[idx]);
});

// POST /api/measurements/:id/images
router.post('/:id/images', authMiddleware, (req, res) => {
    const measurement = demoData.measurements.find(m => m.measurement_id === req.params.id);
    if (!measurement) return res.status(404).json({ error: 'Measurement not found' });

    // In production, handle multipart file upload with multer
    const imageRef = `uploads/${req.params.id}/${Date.now()}.jpg`;
    measurement.image_reference = imageRef;

    res.json({
        message: 'Image uploaded',
        image_reference: imageRef,
        metadata: {
            timestamp: new Date().toISOString(),
            user_id: req.user.user_id,
            geo_latitude: req.body.latitude,
            geo_longitude: req.body.longitude
        }
    });
});

module.exports = router;
