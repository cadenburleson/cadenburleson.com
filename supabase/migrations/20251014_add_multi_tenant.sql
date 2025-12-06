-- Multi-Tenant Architecture Migration for CadenBurleson.com
-- Adds project_id to support multiple apps on single Supabase instance
-- Adapted from Fitnit multi-tenant setup

-- Step 1: Create projects table (for tenant/app management, not portfolio projects)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    domain TEXT UNIQUE,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_subdomain ON public.projects(subdomain);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON public.projects(domain);

-- Step 2: Insert default 'cadenburleson' project
INSERT INTO public.projects (name, display_name, subdomain, domain, is_active)
VALUES ('cadenburleson', 'Caden Burleson', 'cadenburleson', 'cadenburleson.com', true)
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add project_id to all content tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Step 4: Update existing data to use cadenburleson project
DO $$
DECLARE
    default_project_id UUID;
BEGIN
    SELECT id INTO default_project_id FROM public.projects WHERE name = 'cadenburleson';
    IF default_project_id IS NOT NULL THEN
        UPDATE public.profiles SET project_id = default_project_id WHERE project_id IS NULL;
        UPDATE public.portfolio_projects SET project_id = default_project_id WHERE project_id IS NULL;
        UPDATE public.blog_posts SET project_id = default_project_id WHERE project_id IS NULL;
        UPDATE public.contact_messages SET project_id = default_project_id WHERE project_id IS NULL;
        UPDATE public.pages SET project_id = default_project_id WHERE project_id IS NULL;
        UPDATE public.categories SET project_id = default_project_id WHERE project_id IS NULL;
    END IF;
END $$;

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_project_id ON public.profiles(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_project_id ON public.portfolio_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_project_id ON public.blog_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_project_id ON public.contact_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_pages_project_id ON public.pages(project_id);
CREATE INDEX IF NOT EXISTS idx_categories_project_id ON public.categories(project_id);

-- Step 6: Update handle_new_user function to set project_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
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

    -- Create profile with project_id
    INSERT INTO public.profiles (id, display_name, avatar_url, project_id)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'avatar_url',
        user_project_id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
