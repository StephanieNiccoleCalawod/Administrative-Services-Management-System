-- CREATE DATABASE office_user_db; (Already created or run this separately!)

CREATE TYPE user_role AS ENUM (
  'admin_officer',
  'clinic_nurse',
  'clinic_dentist'
);

CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'suspended'
);

CREATE TABLE IF NOT EXISTS office_users (
  office_user_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR NOT NULL,
  email           VARCHAR NOT NULL UNIQUE,
  role            user_role NOT NULL,
  status          user_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);