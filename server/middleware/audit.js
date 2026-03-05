const { v4: uuidv4 } = require('uuid');

// In-memory audit log store (demo)
const auditLogs = [];

function auditMiddleware(action, entityType) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            if (res.statusCode < 400) {
                auditLogs.push({
                    log_id: uuidv4(),
                    user_id: req.user?.user_id || null,
                    action,
                    entity_type: entityType,
                    entity_id: req.params?.id || data?.id || null,
                    details: { method: req.method, path: req.path },
                    ip_address: req.ip,
                    timestamp: new Date().toISOString()
                });
            }
            return originalJson(data);
        };
        next();
    };
}

function getAuditLogs(filters = {}) {
    let logs = [...auditLogs];
    if (filters.userId) logs = logs.filter(l => l.user_id === filters.userId);
    if (filters.entityType) logs = logs.filter(l => l.entity_type === filters.entityType);
    if (filters.from) logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.from));
    if (filters.to) logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.to));
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = { auditMiddleware, getAuditLogs, auditLogs };
