const path = require('path');
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fcms360-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fcms360',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  roles: ['JE', 'AGE', 'GE', 'CWE', 'CE', 'Command', 'E-in-C'],
  approvalChain: ['JE', 'AGE', 'GE', 'CWE', 'CE']
};
