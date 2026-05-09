CREATE DATABASE period_db;

CREATE TABLE periods (
  period_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR NOT NULL,
  period_type period_type NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      period_status NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);