-- Fix foreign key constraints that may be pointing to wrong tables
-- This should be run AFTER 20251014_add_multi_tenant.sql and BEFORE 20251018_create_projects_users_tie.sql

-- Drop the projects_users_tie table if it exists with incorrect foreign keys
DROP TABLE IF EXISTS public.projects_users_tie CASCADE;

-- Ensure the projects table exists (it should from previous migration)
-- This is the tenant/app projects table, NOT portfolio_projects
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        RAISE EXCEPTION 'The projects table does not exist. Please run 20251014_add_multi_tenant.sql first.';
    END IF;
END $$;
