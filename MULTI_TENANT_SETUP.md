# Multi-Tenant Database Setup Guide

This guide explains the multi-tenant architecture for CadenBurleson.com and how to add new apps to share the same Supabase database while keeping data properly isolated.

## Overview

This setup uses a **shared authentication + isolated data** architecture:

- ✅ **Single user identity** - Users create ONE account that works across all apps
- ✅ **Shared core tables** - User profiles, authentication stored once
- ✅ **App-specific data** - Each app's content is isolated by `project_id`
- ✅ **RLS policies** - Automatic enforcement of data isolation at the database level
- ✅ **User tracking** - Know which users signed up with which app

## Architecture

### Core Tables

1. **`projects`** (Tenant Management)
   - Stores app/tenant metadata
   - Columns: `id`, `name`, `display_name`, `subdomain`, `domain`, `settings`, `is_active`
   - Default project: "cadenburleson"

2. **`projects_users_tie`** (User-Project Relationships)
   - Many-to-many relationship between users and projects
   - Columns: `project_id`, `user_id`, `role` (owner/admin/member), `joined_at`
   - Supports role-based access control (RBAC)

3. **Content Tables** (All have `project_id`)
   - `profiles` - User profiles
   - `portfolio_projects` - Portfolio projects (renamed from `projects`)
   - `blog_posts` - Blog articles
   - `contact_messages` - Contact form submissions
   - `pages` - Static pages
   - `categories` - Content categories

### Data Isolation Strategy

Each content table has:
- A `project_id` UUID column with foreign key to `projects(id)`
- Database indexes on `project_id` for query performance
- RLS policies enforcing project-level access

## Initial Setup (CadenBurleson.com)

### Prerequisites

- Supabase project with CLI installed
- Git repository for cadenburleson.com
- Node.js and npm installed

### Step 1: Run Migrations

If you have an **existing database** with data in the `projects` table:

```bash
# 1. First, rename the existing projects table to portfolio_projects
# Run this in Supabase SQL Editor or via CLI
psql -f supabase/migrations/20231201_rename_projects_table.sql

# 2. Run the multi-tenant migrations in order
psql -f supabase/migrations/20240101_base_schema.sql
psql -f supabase/migrations/20251014_add_multi_tenant.sql
psql -f supabase/migrations/20251018_create_projects_users_tie.sql
psql -f supabase/migrations/20251020_add_rls_policies_for_multi_tenant.sql
```

Or use Supabase CLI:

```bash
cd cadenburleson.com
supabase db push
```

If you have a **fresh database** without data:

```bash
# Just run all migrations in order
supabase db push
```

### Step 2: Verify Setup

Check that the default 'cadenburleson' project was created:

```sql
SELECT * FROM public.projects;
-- Should show: cadenburleson | Caden Burleson | ...
```

Check that existing users were migrated:

```sql
SELECT * FROM public.projects_users_tie;
-- Should show all existing users linked to cadenburleson project
```

### Step 3: Update Environment Variables

In your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Multi-Tenant Configuration
VITE_PROJECT_NAME=cadenburleson

# Other config...
```

### Step 4: Update Application Code

If your app references the old `projects` table, update to use `portfolio_projects`:

```javascript
// Before
const { data } = await supabase.from('projects').select('*')

// After
const { data } = await supabase.from('portfolio_projects').select('*')
```

## Adding a New App

### Step 1: Create New Project in Database

In Supabase SQL Editor:

```sql
-- Create a new project for your second app
INSERT INTO public.projects (name, display_name, subdomain, domain, is_active)
VALUES ('my-new-app', 'My New App', 'mynewapp', 'mynewapp.com', true)
ON CONFLICT (name) DO NOTHING;

-- Verify it was created
SELECT * FROM public.projects;
```

**Important:** Replace `'my-new-app'` with your actual app identifier (lowercase, no spaces).

### Step 2: Set Up New App Repository

In your **new app's** repository:

#### Create `.env` file

```env
# Supabase Configuration (SAME as CadenBurleson.com)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Multi-Tenant Configuration (DIFFERENT from CadenBurleson.com)
VITE_PROJECT_NAME=my-new-app  # Must match what you inserted in Step 1
```

#### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

#### Create Supabase Client

Create `src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Update Signup Flow

When users sign up, include the project name in metadata:

```javascript
import { supabase } from './supabaseClient.js'

const projectName = import.meta.env.VITE_PROJECT_NAME || 'my-new-app'

// Email/Password Signup
async function handleSignup(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        project_name: projectName  // This assigns user to your project!
      }
    }
  })

  if (error) throw error
}

// Google OAuth Signup
async function handleGoogleSignup() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      data: {
        project_name: projectName  // This assigns user to your project!
      }
    }
  })

  if (error) throw error
}
```

**Key Point:** The `data: { project_name: projectName }` option is what assigns new users to your app!

### Step 3: Create App-Specific Tables (Optional)

If your new app needs additional tables beyond the shared ones:

```sql
-- Example: Create a table specific to your new app
CREATE TABLE IF NOT EXISTS public.my_app_feature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_my_app_feature_project_id ON public.my_app_feature(project_id);
CREATE INDEX idx_my_app_feature_user_id ON public.my_app_feature(user_id);

-- Enable RLS
ALTER TABLE public.my_app_feature ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data in their projects"
    ON public.my_app_feature
    FOR SELECT
    USING (
        project_id IN (
            SELECT project_id FROM public.projects_users_tie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own data"
    ON public.my_app_feature
    FOR INSERT
    WITH CHECK (
        project_id IN (
            SELECT project_id FROM public.projects_users_tie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own data"
    ON public.my_app_feature
    FOR UPDATE
    USING (
        project_id IN (
            SELECT project_id FROM public.projects_users_tie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own data"
    ON public.my_app_feature
    FOR DELETE
    USING (
        project_id IN (
            SELECT project_id FROM public.projects_users_tie WHERE user_id = auth.uid()
        )
    );
```

### Step 4: Query Data with Project Context

Always include project context when querying data:

```javascript
// Get the current user's project ID
const projectName = import.meta.env.VITE_PROJECT_NAME

const { data: projects } = await supabase
  .from('projects')
  .select('id')
  .eq('name', projectName)
  .single()

const currentProjectId = projects?.id

// Insert data with project_id
await supabase
  .from('my_app_feature')
  .insert({
    project_id: currentProjectId,  // Always include this!
    data: { /* your data */ }
  })

// Query data (RLS automatically filters by project)
const { data } = await supabase
  .from('my_app_feature')
  .select('*')
```

## Shared Tables

### Tables Shared Between Apps

- `auth.users` - User authentication (Supabase built-in)
- `public.profiles` - User profiles (name, avatar, etc.)
- `public.projects` - App definitions
- `public.projects_users_tie` - User-to-app memberships

These tables can be accessed across all apps:

```javascript
// Get current user's profile (works across all apps)
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

## User Experience Flow

### New User Signing Up on Your App

1. User visits `your-app.com/signup`
2. Signs up with email/password or OAuth
3. Signup includes `data: { project_name: 'my-new-app' }`
4. Database triggers automatically:
   - Create entry in `projects_users_tie` with `my-new-app` project_id
   - Create profile with `my-new-app` project_id
   - User is now tagged as a "my-new-app" user
5. User can only see data from "my-new-app"

### Existing CadenBurleson.com User Visiting Your App

1. User already has CadenBurleson.com account
2. Visits `your-app.com` - **automatically logged in** (same Supabase session!)
3. On first visit, you can auto-add them to your app:

```javascript
// Check if user has access to current app
const projectName = import.meta.env.VITE_PROJECT_NAME
const { data: project } = await supabase
  .from('projects')
  .select('id')
  .eq('name', projectName)
  .single()

const { data: hasAccess } = await supabase
  .from('projects_users_tie')
  .select('*')
  .eq('user_id', user.id)
  .eq('project_id', project.id)
  .single()

if (!hasAccess) {
  // Grant access to this app
  await supabase.from('projects_users_tie').insert({
    user_id: user.id,
    project_id: project.id,
    role: 'member'
  })
}
```

4. User now has access to both apps!
5. Their CadenBurleson.com data stays separate from new app data

## Testing the Setup

### Test 1: Verify Project Isolation

```sql
-- Get a CadenBurleson.com user ID
SELECT id FROM auth.users LIMIT 1;

-- Check they can't see your new app's project (should return 0 rows)
SELECT * FROM projects_users_tie
WHERE user_id = 'user-id-here'
AND project_id = (SELECT id FROM projects WHERE name = 'my-new-app');
```

### Test 2: Verify RLS Works

```javascript
// In your new app, log in as a test user
// Try to query CadenBurleson.com-specific data
const { data, error } = await supabase
  .from('portfolio_projects')  // CadenBurleson.com's portfolio
  .select('*')

// Should return empty array (RLS blocks access to cadenburleson project data)
console.log(data)  // []
```

### Test 3: Create Test User

```javascript
// Sign up a new user in your app
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
  options: {
    data: { project_name: 'my-new-app' }
  }
})

// Verify they were added to your app
const { data: membership } = await supabase
  .from('projects_users_tie')
  .select('project_id, projects(name)')
  .eq('user_id', data.user.id)

console.log(membership)  // Should show 'my-new-app'
```

## Troubleshooting

### Users Not Being Assigned to Project

**Problem:** New users aren't appearing in `projects_users_tie`

**Solution:** Check the trigger is working:

```sql
-- Verify the trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created_add_to_project';

-- If missing, re-run the migration
-- supabase/migrations/20251018_create_projects_users_tie.sql
```

### RLS Blocking All Queries

**Problem:** Can't query any data, even your own

**Solution:** Check you're authenticated:

```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('User ID:', session?.user?.id)  // Must have a valid user

// Check user has project access
const { data } = await supabase
  .from('projects_users_tie')
  .select('*')
  .eq('user_id', session.user.id)
console.log('Projects:', data)  // Should show at least one project
```

### Data Showing from Wrong Project

**Problem:** Seeing data from another app

**Solution:** Check RLS policies are enabled:

```sql
-- Verify RLS is enabled on the table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'your_table_name';

-- rowsecurity should be 't' (true)

-- If false, enable it
ALTER TABLE public.your_table_name ENABLE ROW LEVEL SECURITY;
```

## Important Notes

### Environment Variables

- **CadenBurleson.com:** `VITE_PROJECT_NAME=cadenburleson`
- **Your New App:** `VITE_PROJECT_NAME=my-new-app`
- Both apps use the **SAME** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Security

- RLS policies enforce data isolation automatically
- Users can't bypass restrictions (enforced at database level)
- Even if your app code has a bug, users can't access other projects' data

### Costs

- **Single Supabase project** - Only pay for one database
- **Shared storage** - User profiles stored once, not duplicated
- **Separate billing** - You can still have separate Stripe/payment systems per app

## Next Steps

1. ✅ Run migrations (if not done already)
2. ✅ Verify cadenburleson project exists
3. ✅ Update environment variables
4. ✅ Test signup flow with new users
5. ✅ Build your new app's unique features!

## Questions?

**Q: Can a user access both apps?**
A: Yes! They sign in once and the same session works for both. You can auto-grant access or require explicit signup.

**Q: Can I share specific data between apps?**
A: Yes! Either use shared tables (like `profiles`) or explicitly query across projects if user has access to both.

**Q: What if I want totally separate users?**
A: Create a separate Supabase project. This multi-tenant setup assumes shared auth is beneficial.

**Q: How do I migrate existing app data?**
A: If your new app already has data elsewhere, import it with the correct `project_id` via bulk insert.

---

**Ready to deploy?** Make sure to set environment variables in your hosting platform:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_PROJECT_NAME=your-app-name
```
