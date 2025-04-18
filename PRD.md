# Product Requirements Document (PRD)

## Project: Caden Burleson Personal Portfolio Website

---

### Overview

Build a sleek, fast, and developer-friendly personal portfolio website for **Caden Burleson**. The site will showcase Caden’s biography, blog, and projects. Content management for both blog posts **and static pages** will be powered by **Supabase**. Deployment and hosting will be on **Cloudflare Pages**.

The visual style should be **vibrant, colorful, friendly, and engaging**, reflecting personality and creativity.

---

### Objectives

- Highlight Caden’s skills, background, and featured projects.
- Allow dynamic publishing and editing of blog content, pages, and categories via Supabase.
- Prioritize a user-friendly **CMS experience** integrated directly into the website’s UI.
- Make the site blazing fast and easily updatable.
- Host the site on Cloudflare with optimal caching and security.
- Deliver a visually delightful experience with bold colors, animations, and friendly UI components.

---

### Pages and Features

#### 1. **Home Page / Hero + Projects**
- Hero section with name, tagline, and CTA (e.g., "See My Work").
- Featured projects preview (cards/grid style with thumbnails).
- Use vibrant gradients or colorful backgrounds.
- Each project links to its own project page.

#### 2. **About Page**
- Short professional bio with profile photo.
- Optional timeline or visual resume format.
- List of skills and tools used.
- Playful iconography and friendly layout.

#### 3. **Projects Page**
- Grid or list layout of all projects.
- Each entry links to a dedicated project detail page.
- Hover effects or animated transitions encouraged.

#### 4. **Project Detail Page (Template)**
- Title, description, tech used, images/screenshots.
- External links (e.g. GitHub, live demo).
- Emphasize visuals and readable typography.

#### 5. **Blog Page (Supabase-powered)**
- List of posts (title, date, short preview).
- Pagination or infinite scroll.
- Clicking a post opens a dedicated blog detail page.
- Stylized post cards and engaging layout.

#### 6. **Blog Post Page**
- Full content from Supabase DB.
- Include title, published date, and tags.
- Optional share or comment section (optional for v1).
- Focus on legibility and pleasant reading experience.

#### 7. **CMS-Driven Static Pages**
- Pages like "About", "Contact", or custom pages should be dynamically generated from Supabase.
- Table in Supabase: `pages` with fields: `id`, `slug`, `title`, `body`, `meta_title`, `meta_description`, `created_at`, `updated_at`.
- Support Markdown or rich-text rendering.
- Visual consistency with other pages.

#### 8. **Integrated CMS UI (Admin Dashboard)**
- Built into the portfolio site's UI (protected/admin-only route).
- Features:
  - Create, edit, delete **blog posts**
  - Create, edit, delete **pages**
  - Create, edit, delete **categories** (for blog post organization)
- Forms with fields mapped to Supabase schema.
- Display previews and allow easy content updates.

---

### CMS / Backend

- Supabase for content management.
  - **Posts** stored in a `posts` table with fields: `id`, `title`, `slug`, `body`, `excerpt`, `tags`, `category_id`, `created_at`, `updated_at`.
  - **Pages** stored in a `pages` table with fields: `id`, `slug`, `title`, `body`, `meta_title`, `meta_description`, `created_at`, `updated_at`.
  - **Categories** stored in a `categories` table with fields: `id`, `name`, `slug`, `description`, `created_at`, `updated_at`.
  - Admin interface integrated into site UI and powered by Supabase API.

---

### Hosting & Deployment

- Use **Cloudflare Pages** for hosting.
- Connect to GitHub for CI/CD.
- Enable caching and security headers via Cloudflare.
- Use **Vite** as the local development environment and build tool:
  - Fast dev server with hot module reload
  - Compatible with vanilla JavaScript
  - Optimized build for Cloudflare Pages

---

### Tech Stack (Recommended)

- Language: **Vanilla JavaScript** (no framework)
- Styling: **Vanilla CSS only**, no UI frameworks or libraries (no Tailwind, Bootstrap, etc.)
- Blog + Pages CMS: Supabase
- Hosting: Cloudflare Pages
- Dev Tooling: **Vite**

---

### Non-Functional Requirements

- Responsive design
- SEO friendly (meta tags, open graph, etc.)
- Fast page load times
- Minimal external dependencies
- **Visual design should be colorful, modern, and friendly**

---

### Stretch Goals (Optional)

- Newsletter signup (Mailchimp/Substack/etc.)
- Project filter by tags
- Animated transitions or scroll effects

---

### Deliverables

- Full source code in GitHub repo
- Working production site hosted on Cloudflare
- README with instructions for content updates and development

