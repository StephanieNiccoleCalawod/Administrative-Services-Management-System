CREATE DATABASE office_user_db; 

CREATE TABLE office_users (
  office_user_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR NOT NULL,
  email           VARCHAR NOT NULL UNIQUE,
  role            user_role NOT NULL,
  status          user_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);