# Caden Burleson Portfolio Website

A personal portfolio website showcasing projects, blog posts, and contact information.

## Features

- **Home Page**: Introduction and featured projects
- **About Page**: Information about skills, experience, and background
- **Projects Page**: Portfolio of work with filtering capability
- **Project Detail Pages**: In-depth information about each project
- **Blog**: Collection of articles with category filtering
- **Contact Page**: Form to send messages and contact details

## Tech Stack

- Vanilla JavaScript
- Vite.js for build tooling
- Supabase for backend and database
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account (for backend functionality)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/cadenburleson/cadenburleson.com.git
   cd cadenburleson.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### Supabase Setup

1. Create a new project in Supabase
2. Use the SQL in `supabase/schema.sql` to set up your database tables and policies
3. Create storage buckets for images if needed

### Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Project Structure

```
├── public/              # Static assets
│   └── images/          # Image files
├── src/                 # Source files
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── main.js          # Main application entry point
│   └── style.css        # Global styles
├── supabase/            # Supabase configuration
│   └── schema.sql       # Database schema
├── index.html           # Main HTML file
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## Adding Content

### Projects

Projects can be added through the Supabase database in the `projects` table. Each project should have:

- `title`: Project name
- `slug`: URL-friendly identifier
- `category`: Project category
- `description`: Short description
- `full_description`: Detailed description (supports markdown)
- `image_url`: Main project image
- `gallery`: Array of additional images
- `technologies`: Array of technologies used
- `features`: Array of key features
- `demo_url`: Link to live demo (optional)
- `github_url`: Link to source code (optional)
- `launch_date`: Date when project was launched
- `featured`: Boolean to indicate if it should be featured

### Blog Posts

Blog posts can be added through the Supabase database in the `blog_posts` table. Each post should have:

- `title`: Post title
- `slug`: URL-friendly identifier
- `excerpt`: Brief summary
- `content`: Full post content (supports markdown)
- `image_url`: Featured image
- `published_at`: Publication date
- `category`: Post category
- `author`: Author name

## License

MIT 