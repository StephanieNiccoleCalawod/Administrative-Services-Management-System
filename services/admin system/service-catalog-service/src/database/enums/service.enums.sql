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