CREATE TYPE period_type AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annual'
);

CREATE TYPE period_status AS ENUM (
  'active',
  'inactive',
  'closed'
);
