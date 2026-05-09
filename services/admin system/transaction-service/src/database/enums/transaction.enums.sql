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