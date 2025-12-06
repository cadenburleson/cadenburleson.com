-- Fix the foreign key constraint on projects_users_tie without losing data
-- This migration drops the incorrect foreign key and adds the correct one

-- Step 1: Drop the incorrect foreign key constraint
ALTER TABLE public.projects_users_tie
DROP CONSTRAINT IF EXISTS projects_users_tie_project_id_fkey;

-- Step 2: Verify the projects table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        RAISE EXCEPTION 'The projects table does not exist. Please run 20251014_add_multi_tenant.sql first.';
    END IF;
END $$;

-- Step 3: Add the correct foreign key constraint pointing to the projects table (tenant table)
ALTER TABLE public.projects_users_tie
ADD CONSTRAINT projects_users_tie_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES public.projects(id)
ON DELETE CASCADE;

-- Step 4: Verify the constraint was added correctly
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name='projects_users_tie'
AND kcu.column_name='project_id';
