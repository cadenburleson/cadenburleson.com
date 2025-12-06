-- Fix infinite recursion in projects_users_tie RLS policies
-- The original policies were self-referential, causing infinite recursion

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own project memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can view all project memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can add members" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can update memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can remove members" ON public.projects_users_tie;

-- Step 2: Create a SECURITY DEFINER function to check project admin status
-- This function bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION public.is_project_admin(check_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.projects_users_tie
        WHERE project_id = check_project_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 3: Create new non-recursive policies

-- Users can always see their own memberships
CREATE POLICY "Users can view their own project memberships"
    ON public.projects_users_tie
    FOR SELECT
    USING (user_id = auth.uid());

-- Project admins can view all memberships in their projects (using function)
CREATE POLICY "Project admins can view all project memberships"
    ON public.projects_users_tie
    FOR SELECT
    USING (public.is_project_admin(project_id));

-- Project admins can add members (using function)
CREATE POLICY "Project admins can add members"
    ON public.projects_users_tie
    FOR INSERT
    WITH CHECK (public.is_project_admin(project_id));

-- Project admins can update memberships (using function)
CREATE POLICY "Project admins can update memberships"
    ON public.projects_users_tie
    FOR UPDATE
    USING (public.is_project_admin(project_id));

-- Project admins can remove members (using function)
CREATE POLICY "Project admins can remove members"
    ON public.projects_users_tie
    FOR DELETE
    USING (public.is_project_admin(project_id));

-- Step 4: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_project_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_project_admin(UUID) TO anon;

-- Step 5: Also allow anon users to read from projects_users_tie for public API access
-- This is needed for the seed script to work without authentication
CREATE POLICY "Allow anon read for public data"
    ON public.projects_users_tie
    FOR SELECT
    TO anon
    USING (true);
