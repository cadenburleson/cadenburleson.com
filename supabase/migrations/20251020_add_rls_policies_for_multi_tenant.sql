-- Add RLS Policies for Multi-Tenant Data Isolation
-- This ensures users can only access data from projects they belong to
-- Adapted from Fitnit multi-tenant setup

-- Step 1: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.portfolio_projects;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.blog_posts;

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.contact_messages;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.pages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.pages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.pages;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.categories;

-- Drop new policy names if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view profiles in their projects" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view portfolio projects in active projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Users can create portfolio projects in their projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Users can update portfolio projects in their projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Users can delete portfolio projects in their projects" ON public.portfolio_projects;

DROP POLICY IF EXISTS "Anyone can view blog posts in active projects" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can create blog posts in their projects" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update blog posts in their projects" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete blog posts in their projects" ON public.blog_posts;

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Project admins can view contact messages in their projects" ON public.contact_messages;
DROP POLICY IF EXISTS "Project admins can update contact messages in their projects" ON public.contact_messages;
DROP POLICY IF EXISTS "Project admins can delete contact messages in their projects" ON public.contact_messages;

DROP POLICY IF EXISTS "Anyone can view pages in active projects" ON public.pages;
DROP POLICY IF EXISTS "Users can create pages in their projects" ON public.pages;
DROP POLICY IF EXISTS "Users can update pages in their projects" ON public.pages;
DROP POLICY IF EXISTS "Users can delete pages in their projects" ON public.pages;

DROP POLICY IF EXISTS "Anyone can view categories in active projects" ON public.categories;
DROP POLICY IF EXISTS "Users can create categories in their projects" ON public.categories;
DROP POLICY IF EXISTS "Users can update categories in their projects" ON public.categories;
DROP POLICY IF EXISTS "Users can delete categories in their projects" ON public.categories;

-- Step 2: Create new RLS policies with project isolation

-- PROFILES: Users can only see profiles from their own projects
CREATE POLICY "Users can view profiles in their projects"
    ON public.profiles
    FOR SELECT
    USING (
        project_id IN (
            SELECT project_id FROM public.projects_users_tie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (id = auth.uid());

-- PORTFOLIO_PROJECTS: Public read access, but project-scoped for write operations
-- Public can view all portfolio projects (for public portfolio site)
CREATE POLICY "Anyone can view portfolio projects in active projects"
    ON public.portfolio_projects
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE is_active = true
        )
    );

-- Authenticated users can only insert projects into their own projects
CREATE POLICY "Users can create portfolio projects in their projects"
    ON public.portfolio_projects
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only update portfolio projects in their own projects
CREATE POLICY "Users can update portfolio projects in their projects"
    ON public.portfolio_projects
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only delete portfolio projects in their own projects
CREATE POLICY "Users can delete portfolio projects in their projects"
    ON public.portfolio_projects
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- BLOG_POSTS: Public read access, but project-scoped for write operations
-- Public can view all blog posts from active projects
CREATE POLICY "Anyone can view blog posts in active projects"
    ON public.blog_posts
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE is_active = true
        )
    );

-- Authenticated users can only insert blog posts into their own projects
CREATE POLICY "Users can create blog posts in their projects"
    ON public.blog_posts
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only update blog posts in their own projects
CREATE POLICY "Users can update blog posts in their projects"
    ON public.blog_posts
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only delete blog posts in their own projects
CREATE POLICY "Users can delete blog posts in their projects"
    ON public.blog_posts
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- CONTACT_MESSAGES: Anyone can insert, but only project admins can read
-- Public can insert contact messages (for contact forms)
CREATE POLICY "Anyone can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated users from the project can read contact messages
CREATE POLICY "Project admins can view contact messages in their projects"
    ON public.contact_messages
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Only project admins can update contact messages (e.g., mark as read)
CREATE POLICY "Project admins can update contact messages in their projects"
    ON public.contact_messages
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Only project admins can delete contact messages
CREATE POLICY "Project admins can delete contact messages in their projects"
    ON public.contact_messages
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- PAGES: Public read access, but project-scoped for write operations
-- Public can view all pages from active projects
CREATE POLICY "Anyone can view pages in active projects"
    ON public.pages
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE is_active = true
        )
    );

-- Authenticated users can only insert pages into their own projects
CREATE POLICY "Users can create pages in their projects"
    ON public.pages
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only update pages in their own projects
CREATE POLICY "Users can update pages in their projects"
    ON public.pages
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only delete pages in their own projects
CREATE POLICY "Users can delete pages in their projects"
    ON public.pages
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- CATEGORIES: Public read access, but project-scoped for write operations
-- Public can view all categories from active projects
CREATE POLICY "Anyone can view categories in active projects"
    ON public.categories
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE is_active = true
        )
    );

-- Authenticated users can only insert categories into their own projects
CREATE POLICY "Users can create categories in their projects"
    ON public.categories
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only update categories in their own projects
CREATE POLICY "Users can update categories in their projects"
    ON public.categories
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Authenticated users can only delete categories in their own projects
CREATE POLICY "Users can delete categories in their projects"
    ON public.categories
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND
        project_id IN (
            SELECT project_id FROM public.projects_users_tie
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Step 3: Grant necessary permissions
GRANT SELECT ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects_users_tie TO authenticated;
