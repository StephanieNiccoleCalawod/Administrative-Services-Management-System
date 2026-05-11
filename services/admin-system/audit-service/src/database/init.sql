CREATE DATABASE audit_db;

\c audit_db;

CREATE TYPE audit_action_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'ACTIVATE',
    'DEACTIVATE',
    'SUBMIT'
);

CREATE TYPE audit_entity_enum AS ENUM (
    'SERVICE',
    'TRANSACTION',
    'COMMITMENT',
    'PERIOD',
    'OFFICE_USER'
);

CREATE TABLE audit_logs (
    audit_log_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id       UUID,
    actor_name     VARCHAR,
    action         audit_action_enum NOT NULL,
    entity         audit_entity_enum NOT NULL,
    entity_id      UUID,
    before_state   JSONB,
    after_state    JSONB,
    timestamp      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Append-only: no UPDATE or DELETE allowed on this table
-- Enforced at application level (no PATCH/DELETE endpoints)
