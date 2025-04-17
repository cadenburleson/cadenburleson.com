# Caden Burleson Personal Website

This is a personal website and blog built with Next.js, Tailwind CSS, and Supabase.

## Features

- Responsive design for all devices
- Dynamic content management via Supabase
- Blog with markdown support
- Portfolio/Projects showcase
- Fast performance with Next.js

## Tech Stack

- **Frontend**: Next.js with App Router, TypeScript, Tailwind CSS
- **Content Management**: Supabase (PostgreSQL)
- **Hosting**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cadenburleson/cadenburleson.com.git
   cd cadenburleson.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Use the SQL Editor to run the schema script in `supabase/schema.sql`
3. Update your environment variables with the project URL and anon key

## Content Management

### Blog Posts

Posts are stored in the `posts` table with the following structure:
- `id`: Unique identifier
- `title`: Post title
- `slug`: URL-friendly identifier
- `body`: Main content (supports Markdown)
- `excerpt`: Short summary for previews
- `tags`: Array of tags
- `created_at`: Publication date
- `updated_at`: Last update date

To add or edit posts, use the Supabase dashboard:
1. Navigate to the Table Editor
2. Select the `posts` table
3. Add a new row or edit an existing one

### Projects

Projects are stored in the `projects` table with the following structure:
- `id`: Unique identifier
- `title`: Project title
- `slug`: URL-friendly identifier
- `description`: Short description
- `body`: Detailed information (supports Markdown)
- `image`: Path to the project image
- `tags`: Array of technologies used
- `github_url`: Link to GitHub repository
- `live_url`: Link to live demo
- `featured`: Boolean flag for featured projects
- `created_at`: Creation date
- `updated_at`: Last update date

### Static Pages

Static pages like "About" or custom pages are stored in the `pages` table:
- `id`: Unique identifier
- `slug`: URL-friendly identifier
- `title`: Page title
- `body`: Page content (supports Markdown)
- `meta_title`: SEO title
- `meta_description`: SEO description
- `created_at`: Creation date
- `updated_at`: Last update date

## Deployment

### Cloudflare Pages Setup

1. Push your code to a GitHub repository
2. Log in to Cloudflare Dashboard
3. Navigate to Pages and click "Create a project"
4. Connect your GitHub account and select the repository
5. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
6. Add environment variables from your `.env.local` file
7. Deploy

## Customization

- Update personal information in the About page
- Add your own projects to the projects table
- Customize the design by modifying Tailwind classes or components

## License

This project is licensed under the MIT License - see the LICENSE file for details.
