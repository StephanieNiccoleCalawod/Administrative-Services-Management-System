CREATE DATABASE transaction_db;


CREATE TABLE transactions (
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