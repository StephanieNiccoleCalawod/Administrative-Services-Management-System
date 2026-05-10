-- CREATE DATABASE service_catalog_db; (Already created or run this separately!)

CREATE TYPE service_classification AS ENUM (
  'medical',
  'dental',
  'administrative'
);

CREATE TYPE service_type AS ENUM (
  'consultation',
  'clearance',
  'certificate',
  'borrowing',
  'reservation',
  'permit',
  'circulation'
);

CREATE TYPE service_category AS ENUM (
  'emergency',
  'non_emergency',
  'standard'
);

CREATE TABLE IF NOT EXISTS services (
  service_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    VARCHAR NOT NULL,
  description             TEXT,
  total_processing_time   INT,
  classification          service_classification NOT NULL,
  type                    service_type NOT NULL,
  category                service_category NOT NULL,
  is_active               BOOLEAN NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);