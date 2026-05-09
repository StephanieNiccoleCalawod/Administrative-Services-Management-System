CREATE DATABASE commitment_db;


CREATE TABLE commitments (
  commitment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id          UUID NOT NULL,
  period_id           UUID NOT NULL,
  created_by          UUID NOT NULL,
  target_unit         target_unit NOT NULL,
  target_value        NUMERIC NOT NULL,
  success_indicator   TEXT,
  timeline            TEXT,
  status              commitment_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
