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