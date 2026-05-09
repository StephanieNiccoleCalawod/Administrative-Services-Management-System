


CREATE TYPE commitment_status AS ENUM (
  'draft',
  'submitted',
  'locked'
);

CREATE TYPE target_unit AS ENUM (
  'percentage',
  'count',
  'minutes'
);