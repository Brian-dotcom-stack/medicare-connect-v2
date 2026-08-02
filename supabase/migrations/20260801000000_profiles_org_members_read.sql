-- Allow authenticated org members to read the profile rows of other members
-- of the same organisation(s). This powers the Settings → Team members list,
-- which previously showed "—" for every member because profiles RLS only
-- permitted reading your own profile.
CREATE POLICY "profiles read by org members" ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships om
      WHERE om.user_id = public.profiles.id
        AND public.is_org_member(om.org_id, auth.uid())
    )
  );

-- Keep the membership-by-user lookup fast.
CREATE INDEX IF NOT EXISTS org_memberships_user_id_idx ON public.org_memberships (user_id);

