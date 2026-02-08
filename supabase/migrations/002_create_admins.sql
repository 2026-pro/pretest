-- Create admins table for site administrators
CREATE TABLE IF NOT EXISTS public.admins (
  id text PRIMARY KEY,
  password text NOT NULL,
  name text NOT NULL,
  organization text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Optional: add an index on email
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
