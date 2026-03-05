const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const { users } = require('../models/demoData');

// Temporary OTP store
const otpStore = {};

// POST /api/auth/login - Send OTP
router.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate 4-digit OTP (demo: always 1234)
    const otp = '1234';
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    res.json({
        message: 'OTP sent successfully',
        email,
        // In production, don't return OTP — sent via SMS/email
        demo_otp: otp
    });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > stored.expires) {
        delete otpStore[email];
        return res.status(400).json({ error: 'OTP expired' });
    }
    if (stored.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    delete otpStore[email];

    const token = jwt.sign(
        { userId: user.user_id, role: user.role, formation: user.formation },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            formation: user.formation,
            appointment: user.appointment
        }
    });
});

module.exports = router;
