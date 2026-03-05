-- FCMS-360 Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    user_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('JE','AGE','GE','CWE','CE','Command','E-in-C')),
    formation     VARCHAR(100),
    appointment   VARCHAR(100),
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
    project_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name      VARCHAR(255) NOT NULL,
    location          VARCHAR(255),
    latitude          DECIMAL(10,7),
    longitude         DECIMAL(10,7),
    contractor        VARCHAR(255),
    start_date        DATE,
    end_date          DATE,
    code_head         VARCHAR(100),
    budget_allocation DECIMAL(15,2) DEFAULT 0,
    budget_utilized   DECIMAL(15,2) DEFAULT 0,
    budget_withdrawn  DECIMAL(15,2) DEFAULT 0,
    status            VARCHAR(30) DEFAULT 'on_track' CHECK (status IN ('on_track','delayed','requires_attention','completed')),
    progress          INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    formation         VARCHAR(100),
    assigned_to       UUID REFERENCES users(user_id),
    milestone         VARCHAR(255),
    category          VARCHAR(30) DEFAULT 'all_safe' CHECK (category IN ('critical_issues','weather_risk','budget_issue','all_safe')),
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEASUREMENT BOOKS
-- ============================================================
CREATE TABLE measurement_books (
    mb_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mb_number     VARCHAR(100) UNIQUE NOT NULL,
    project_id    UUID NOT NULL REFERENCES projects(project_id),
    created_by    UUID NOT NULL REFERENCES users(user_id),
    status        VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','submitted','verified','approved','locked')),
    is_locked     BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEASUREMENTS
-- ============================================================
CREATE TABLE measurements (
    measurement_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mb_id           UUID NOT NULL REFERENCES measurement_books(mb_id),
    work_item       VARCHAR(255) NOT NULL,
    quantity        DECIMAL(12,3) NOT NULL,
    unit            VARCHAR(50),
    entered_by      UUID NOT NULL REFERENCES users(user_id),
    remarks         TEXT,
    image_reference VARCHAR(500),
    geo_latitude    DECIMAL(10,7),
    geo_longitude   DECIMAL(10,7),
    geo_altitude    DECIMAL(8,2),
    geo_accuracy    DECIMAL(6,2),
    entered_date    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPROVALS
-- ============================================================
CREATE TABLE approvals (
    approval_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mb_id          UUID NOT NULL REFERENCES measurement_books(mb_id),
    measurement_id UUID REFERENCES measurements(measurement_id),
    approved_by    UUID NOT NULL REFERENCES users(user_id),
    role           VARCHAR(20) NOT NULL CHECK (role IN ('JE','AGE','GE','CWE','CE')),
    status         VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    remarks        TEXT,
    approval_date  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS (append-only)
-- ============================================================
CREATE TABLE audit_logs (
    log_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users(user_id),
    action       VARCHAR(100) NOT NULL,
    entity_type  VARCHAR(50),
    entity_id    UUID,
    details      JSONB,
    ip_address   VARCHAR(45),
    timestamp    TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent UPDATE and DELETE on audit_logs
CREATE RULE audit_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ============================================================
-- BILLING RECORDS
-- ============================================================
CREATE TABLE billing_records (
    billing_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_number   VARCHAR(100) UNIQUE NOT NULL,
    project_id    UUID NOT NULL REFERENCES projects(project_id),
    contractor    VARCHAR(255),
    amount        DECIMAL(15,2) NOT NULL,
    status        VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received','pending_approval','paid','overdue')),
    due_date      DATE,
    paid_date     DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
    message_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id   UUID REFERENCES projects(project_id),
    sender_id    UUID NOT NULL REFERENCES users(user_id),
    receiver_id  UUID NOT NULL REFERENCES users(user_id),
    content      TEXT NOT NULL,
    is_read      BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_projects_assigned ON projects(assigned_to);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_mb_project ON measurement_books(project_id);
CREATE INDEX idx_measurements_mb ON measurements(mb_id);
CREATE INDEX idx_approvals_mb ON approvals(mb_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_billing_project ON billing_records(project_id);
CREATE INDEX idx_messages_project ON messages(project_id);
