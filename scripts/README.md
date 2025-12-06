# Blog Post Seeding Script

This script populates your Supabase database with SEO-optimized blog posts about web development topics.

## Setup

1. **Create a `.env` file** in the project root if you don't have one:

```bash
cp .env.example .env
```

2. **Add your Supabase credentials** to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_PROJECT_NAME=cadenburleson
```

3. **Ensure your database is set up**:
   - The script works with both single-tenant and multi-tenant setups
   - If using multi-tenant, make sure you've run the migrations in `supabase/migrations/`

## Usage

Run the seed script:

```bash
npm run seed:blog
```

## What It Does

The script will:

1. Check if you're using multi-tenant (projects table exists) or single-tenant setup
2. If multi-tenant, look for a project matching `VITE_PROJECT_NAME`
3. Check for existing blog posts to avoid duplicates
4. Insert 6 new SEO-optimized blog posts:
   - React Hooks Complete Guide
   - TypeScript vs JavaScript 2024
   - Web Performance Optimization Techniques
   - Next.js 14 Complete Guide
   - Full Stack Development Technology Stack Guide 2024
   - (+ more)

## Blog Posts Included

All blog posts are:
- **SEO-optimized** with keyword-rich titles and meta descriptions
- **Comprehensive** (10-15 min read time)
- **Technical** with code examples and best practices
- **Current** focused on 2024 trends and technologies
- **Written in Markdown** with proper formatting

## Customization

To add or modify blog posts, edit `scripts/blog-posts-data.js`.

Each post should have:
- `title`: SEO-friendly title
- `slug`: URL-friendly identifier (unique)
- `excerpt`: Meta description for SEO
- `category`: Post category
- `author`: Author name
- `read_time`: Estimated reading time
- `content`: Full markdown content

## Troubleshooting

### "Missing Supabase credentials"
- Make sure you have a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### "Project not found"
- Check that `VITE_PROJECT_NAME` in `.env` matches a project in your database
- Run the script to see available projects

### "fetch failed" or connection errors
- Verify your Supabase URL and key are correct
- Check that your Supabase project is running
- Ensure RLS policies allow inserts (may need to temporarily disable or use service role key)

### "project_id" column errors
- Your database has multi-tenant structure but the script couldn't find the project
- Either run migrations to complete multi-tenant setup, or remove project_id column for single-tenant

## Need Help?

Check your Supabase dashboard:
1. Go to Table Editor
2. Check if `projects` table exists (multi-tenant)
3. Check if `blog_posts` table has `project_id` column
4. Verify RLS policies in Authentication > Policies
