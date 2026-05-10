-- CREATE DATABASE transaction_db; (Already created or run this separately!)

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'na'
);

CREATE TYPE documentary_status AS ENUM (
  'complete',
  'incomplete',
  'for_compliance'
);

CREATE TYPE client_type AS ENUM (
  'employee',
  'student',
  'dependent'
);

CREATE TYPE case_type AS ENUM (
  'new_patient',
  'follow_up',
  'emergency',
  'non_emergency'
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id        UUID NOT NULL,
  period_id         UUID NOT NULL,
  transaction_log   TEXT,
  logged_by         UUID NOT NULL,
  date              DATE NOT NULL,
  time_in           TIMESTAMPTZ NOT NULL,
  time_out          TIMESTAMPTZ,
  processing_time   INT,
  client_name       VARCHAR NOT NULL,
  client_type       client_type NOT NULL,
  status            transaction_status NOT NULL DEFAULT 'pending',
  remarks           TEXT,
  is_referred       BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);