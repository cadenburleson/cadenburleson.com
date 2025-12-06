# Multi-Tenant Setup Instructions for CadenBurleson.com

## ✅ Completed Setup

Your CadenBurleson.com project now has a full multi-tenant infrastructure similar to Fitnit! Here's what was done:

### 1. Database Migrations Created

All migration files are in `supabase/migrations/`:

- **`20231201_rename_projects_table.sql`** - Renames existing `projects` table to `portfolio_projects` (run this first if you have existing data)
- **`20240101_base_schema.sql`** - Base schema with `profiles` table and core content tables
- **`20251014_add_multi_tenant.sql`** - Adds multi-tenant infrastructure (projects table, project_id columns)
- **`20251018_create_projects_users_tie.sql`** - Creates user-project relationships table
- **`20251020_add_rls_policies_for_multi_tenant.sql`** - Adds Row-Level Security policies for data isolation

### 2. Code Updated

All JavaScript files have been updated to use `portfolio_projects` instead of `projects`:

- ✅ `src/main.js` - Updated fetch functions
- ✅ `src/pages/Projects.js` - Updated projects page
- ✅ `src/pages/ProjectDetail.js` - Updated project detail page
- ✅ `src/pages/Admin.js` - Updated admin panel (6 occurrences)
- ✅ `src/components/AdminDashboard.js` - Updated dashboard (5 occurrences)

### 3. Environment Configuration

- ✅ `.env.example` updated with `VITE_PROJECT_NAME=cadenburleson`

### 4. Documentation Created

- ✅ `MULTI_TENANT_SETUP.md` - Comprehensive guide for adding new apps

## 🚀 Next Steps

### Option A: If You Have an Existing Database with Data

1. **Backup your database first!**

2. **Run the migrations in order:**

```bash
# Navigate to your project
cd /Users/cadenburleson/Documents/WebProjects/cadenburleson.com

# Option 1: Using Supabase SQL Editor
# Copy and run each migration file in the Supabase SQL Editor in this exact order:
# 1. supabase/migrations/20231201_rename_projects_table.sql
# 2. supabase/migrations/20240101_base_schema.sql
# 3. supabase/migrations/20251014_add_multi_tenant.sql
# 4. supabase/migrations/20251018_create_projects_users_tie.sql
# 5. supabase/migrations/20251020_add_rls_policies_for_multi_tenant.sql

# Option 2: Using Supabase CLI (if you have it set up)
supabase db push
```

3. **Update your `.env` file:**

```env
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_PROJECT_NAME=cadenburleson
```

4. **Verify the setup:**

Run this query in Supabase SQL Editor:

```sql
-- Check that the 'cadenburleson' project was created
SELECT * FROM public.projects;

-- Check that portfolio_projects table exists
SELECT * FROM public.portfolio_projects LIMIT 5;

-- Check that existing users were migrated (if you have users)
SELECT * FROM public.projects_users_tie;
```

5. **Test your application:**

```bash
npm run dev
```

### Option B: If You Have a Fresh Database (No Existing Data)

1. **Skip the rename migration** (no need to run `20231201_rename_projects_table.sql`)

2. **Run the other migrations:**

```bash
cd /Users/cadenburleson/Documents/WebProjects/cadenburleson.com

# Using Supabase SQL Editor, run these in order:
# 1. supabase/migrations/20240101_base_schema.sql
# 2. supabase/migrations/20251014_add_multi_tenant.sql
# 3. supabase/migrations/20251018_create_projects_users_tie.sql
# 4. supabase/migrations/20251020_add_rls_policies_for_multi_tenant.sql

# OR use Supabase CLI:
supabase db push
```

3. **Update your `.env` file** (same as Option A step 3)

4. **Test your application** (same as Option A step 5)

## 📋 What Changed?

### Database Changes

1. **New `projects` table** - Stores tenant/app information (not to be confused with portfolio projects)
2. **`portfolio_projects` table** - Your portfolio projects (renamed from `projects`)
3. **New `projects_users_tie` table** - Links users to apps they have access to
4. **All content tables now have `project_id`** - Ensures data isolation between apps
5. **RLS policies** - Automatically filter data so users only see content from their apps

### Code Changes

- All references to `supabase.from('projects')` now use `supabase.from('portfolio_projects')`
- This affects portfolio project queries only - the new multi-tenant `projects` table is separate

### Authentication Flow

When users sign up, they'll automatically be:
1. Added to the `cadenburleson` project via the `projects_users_tie` table
2. Given a profile with the `cadenburleson` project_id
3. Able to only see content from the `cadenburleson` project

## 🔧 Troubleshooting

### Error: "relation 'projects' does not exist"

You need to run the migration that renames the table first:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/20231201_rename_projects_table.sql
```

### Error: "duplicate key value violates unique constraint"

The `cadenburleson` project already exists. This is fine - the migration uses `ON CONFLICT DO NOTHING`.

### RLS is blocking all queries

Make sure you have at least one user in the database and they're linked to the project:

```sql
-- Check user-project relationships
SELECT * FROM projects_users_tie;

-- If empty, manually add your user:
INSERT INTO projects_users_tie (project_id, user_id, role)
VALUES (
  (SELECT id FROM projects WHERE name = 'cadenburleson'),
  'your-user-id-here',
  'owner'
);
```

### Need to manually insert data?

When inserting data, always include the `project_id`:

```sql
-- Get the cadenburleson project ID
SELECT id FROM projects WHERE name = 'cadenburleson';

-- Insert a portfolio project with project_id
INSERT INTO portfolio_projects (title, slug, category, description, project_id)
VALUES (
  'My Project',
  'my-project',
  'Web App',
  'Description here',
  (SELECT id FROM projects WHERE name = 'cadenburleson')
);
```

## 📚 Adding New Apps

See `MULTI_TENANT_SETUP.md` for detailed instructions on adding new apps that share this database!

Quick summary:
1. Create new project entry in `projects` table
2. Set `VITE_PROJECT_NAME` in new app's `.env`
3. Use same Supabase credentials
4. Users who sign up on new app get isolated data automatically

## 🎉 You're Done!

Your CadenBurleson.com project now has:
- ✅ Full multi-tenant database architecture
- ✅ Data isolation between projects/apps
- ✅ Automatic user-project assignment on signup
- ✅ Row-Level Security policies enforcing access control
- ✅ Ability to add new apps sharing the same database
- ✅ All code updated to use the new schema

Questions? Check `MULTI_TENANT_SETUP.md` for more details!
