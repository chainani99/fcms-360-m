const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/mb', require('./routes/measurementBooks'));
app.use('/api/measurements', require('./routes/measurements'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/audit-logs', require('./routes/auditLogs'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`FCMS-360 Server running on port ${PORT}`);
});

module.exports = app;
