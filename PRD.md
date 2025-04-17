Objectives

Highlight Caden’s skills, background, and featured projects.

Allow dynamic publishing and editing of blog content and pages via Supabase.

Make the site blazing fast and easily updatable.

Host the site on Cloudflare with optimal caching and security.

Pages and Features

1. Home Page / Hero + Projects

Hero section with name, tagline, and CTA (e.g., "See My Work").

Featured projects preview (cards/grid style with thumbnails).

Each project links to its own project page.

2. About Page

Short professional bio with profile photo.

Optional timeline or visual resume format.

List of skills and tools used.

3. Projects Page

Grid or list layout of all projects.

Each entry links to a dedicated project detail page.

4. Project Detail Page (Template)

Title, description, tech used, images/screenshots.

External links (e.g. GitHub, live demo).

5. Blog Page (Supabase-powered)

List of posts (title, date, short preview).

Pagination or infinite scroll.

Clicking a post opens a dedicated blog detail page.

6. Blog Post Page

Full content from Supabase DB.

Include title, published date, and tags.

Optional share or comment section (optional for v1).

7. CMS-Driven Static Pages

Pages like "About", "Contact", or custom pages should be dynamically generated from Supabase.

Table in Supabase: pages with fields: id, slug, title, body, meta_title, meta_description, created_at, updated_at.

Support Markdown or rich-text rendering.

CMS / Backend

Supabase for content management.

Posts stored in a posts table with fields: id, title, slug, body, excerpt, tags, created_at, updated_at.

Pages stored in a pages table with fields: id, slug, title, body, meta_title, meta_description, created_at, updated_at.

Admin interface optional (can be managed via Supabase dashboard initially).

Hosting & Deployment

Use Cloudflare Pages for hosting.

Connect to GitHub for CI/CD.

Enable caching and security headers via Cloudflare.

Tech Stack (Recommended)

Framework: Next.js or Astro

Styling: Tailwind CSS

Blog + Pages CMS: Supabase

Hosting: Cloudflare Pages

Non-Functional Requirements

Responsive design

SEO friendly (meta tags, open graph, etc.)

Fast page load times

Minimal external dependencies

Stretch Goals (Optional)

Dark mode toggle

Newsletter signup (Mailchimp/Substack/etc.)

Project filter by tags

CMS dashboard for blog posts and pages

Deliverables

Full source code in GitHub repo

Working production site hosted on Cloudflare

README with instructions for content updates and development