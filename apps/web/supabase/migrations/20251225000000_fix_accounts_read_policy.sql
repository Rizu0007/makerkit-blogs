-- Fix accounts read policy to allow reading all accounts
-- This is needed so users can see blog post authors' information

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS accounts_read ON public.accounts;

-- Create a new policy that allows anyone (authenticated or not) to read accounts
-- This is safe because accounts table only contains public information (name, email, picture)
CREATE POLICY accounts_read_public ON public.accounts
  FOR SELECT
  USING (true);

-- Also grant select permission to anon role for public access
GRANT SELECT ON public.accounts TO anon;
