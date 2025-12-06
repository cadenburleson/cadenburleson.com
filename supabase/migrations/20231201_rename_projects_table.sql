-- Pre-migration: Rename existing 'projects' table to 'portfolio_projects'
-- This migration should ONLY be run if you have an existing 'projects' table with data
-- Run this BEFORE running the multi-tenant migrations

-- Step 1: Rename the table
DO $$
BEGIN
    -- Check if 'projects' table exists and 'portfolio_projects' doesn't
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'projects'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'portfolio_projects'
    ) THEN
        -- Rename the table
        ALTER TABLE public.projects RENAME TO portfolio_projects;

        -- Rename the primary key constraint
        ALTER INDEX IF EXISTS projects_pkey RENAME TO portfolio_projects_pkey;

        -- Rename the unique constraint on slug
        ALTER INDEX IF EXISTS projects_slug_key RENAME TO portfolio_projects_slug_key;

        RAISE NOTICE 'Successfully renamed projects table to portfolio_projects';
    ELSE
        RAISE NOTICE 'Skipping: projects table does not exist or portfolio_projects already exists';
    END IF;
END $$;
