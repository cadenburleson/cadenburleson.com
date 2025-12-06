-- Create projects_users_tie table for many-to-many relationship
-- This enables users to be members of multiple projects and projects to have multiple users
-- Adapted from Fitnit multi-tenant setup

-- Step 1: Create the tie table
CREATE TABLE IF NOT EXISTS public.projects_users_tie (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Step 2: Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_projects_users_tie_project_id ON public.projects_users_tie(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_users_tie_user_id ON public.projects_users_tie(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_users_tie_role ON public.projects_users_tie(role);

-- Step 3: Add RLS (Row Level Security) policies
ALTER TABLE public.projects_users_tie ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own project memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can view all project memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can add members" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can update memberships" ON public.projects_users_tie;
DROP POLICY IF EXISTS "Project admins can remove members" ON public.projects_users_tie;

-- Allow users to see their own project memberships
CREATE POLICY "Users can view their own project memberships"
    ON public.projects_users_tie
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow project owners/admins to view all memberships in their projects
CREATE POLICY "Project admins can view all project memberships"
    ON public.projects_users_tie
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects_users_tie
            WHERE project_id = projects_users_tie.project_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Allow project owners/admins to insert new members
CREATE POLICY "Project admins can add members"
    ON public.projects_users_tie
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects_users_tie
            WHERE project_id = projects_users_tie.project_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Allow project owners/admins to update memberships (e.g., change roles)
CREATE POLICY "Project admins can update memberships"
    ON public.projects_users_tie
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects_users_tie
            WHERE project_id = projects_users_tie.project_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Allow project owners/admins to remove members
CREATE POLICY "Project admins can remove members"
    ON public.projects_users_tie
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects_users_tie
            WHERE project_id = projects_users_tie.project_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Step 4: Migrate existing users to the tie table
-- All existing users should be members of the 'cadenburleson' project
DO $$
DECLARE
    default_project_id UUID;
BEGIN
    SELECT id INTO default_project_id FROM public.projects WHERE name = 'cadenburleson';

    IF default_project_id IS NOT NULL THEN
        -- Insert all existing users as members of the cadenburleson project
        INSERT INTO public.projects_users_tie (project_id, user_id, role, joined_at)
        SELECT
            default_project_id,
            id,
            'member',
            created_at
        FROM auth.users
        ON CONFLICT (project_id, user_id) DO NOTHING;

        -- Set the first user as owner (or update existing owner)
        UPDATE public.projects_users_tie
        SET role = 'owner'
        WHERE project_id = default_project_id
        AND user_id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1);
    END IF;
END $$;

-- Step 5: Create helper function to add user to project on signup
CREATE OR REPLACE FUNCTION public.add_user_to_default_project()
RETURNS TRIGGER AS $$
DECLARE
    user_project_id UUID;
    user_project_name TEXT;
BEGIN
    -- Get project from metadata or default to 'cadenburleson'
    IF NEW.raw_user_meta_data->>'project_name' IS NOT NULL THEN
        user_project_name := NEW.raw_user_meta_data->>'project_name';
    ELSE
        user_project_name := 'cadenburleson';
    END IF;

    -- Get the project ID
    SELECT id INTO user_project_id FROM public.projects WHERE name = user_project_name;

    -- If project doesn't exist, use cadenburleson as fallback
    IF user_project_id IS NULL THEN
        SELECT id INTO user_project_id FROM public.projects WHERE name = 'cadenburleson';
    END IF;

    -- Add the new user to the project with timestamp preserving original created_at
    INSERT INTO public.projects_users_tie (project_id, user_id, role, joined_at)
    VALUES (user_project_id, NEW.id, 'member', NEW.created_at)
    ON CONFLICT (project_id, user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add new users to their project
DROP TRIGGER IF EXISTS on_auth_user_created_add_to_project ON auth.users;
CREATE TRIGGER on_auth_user_created_add_to_project
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.add_user_to_default_project();
