# Caden Burleson Portfolio Site

A sleek, fast, and developer-friendly personal portfolio website that showcases my biography, blog, and projects.

## Features

- **Responsive Design**: Works seamlessly on all devices
- **Dynamic Content**: Blog posts and pages are managed via Supabase
- **Built-in CMS**: Admin interface for content management
- **Fast Load Times**: Vanilla JavaScript with minimal dependencies
- **Modern UI**: Vibrant colors and engaging animations

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS
- **CMS/Backend**: Supabase
- **Build Tool**: Vite
- **Hosting**: Cloudflare Pages

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/cadenburleson/cadenburleson.com.git
cd cadenburleson.com
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

Create a new Supabase project and set up the following tables:

- `posts` - Blog posts
  - `id`: uuid (primary key)
  - `title`: text
  - `slug`: text (unique)
  - `body`: text
  - `excerpt`: text
  - `category_id`: uuid (foreign key to categories)
  - `created_at`: timestamp
  - `updated_at`: timestamp

- `pages` - Static pages
  - `id`: uuid (primary key)
  - `slug`: text (unique)
  - `title`: text
  - `body`: text
  - `meta_title`: text
  - `meta_description`: text
  - `created_at`: timestamp
  - `updated_at`: timestamp

- `categories` - Blog categories
  - `id`: uuid (primary key)
  - `name`: text
  - `slug`: text (unique)
  - `description`: text
  - `created_at`: timestamp
  - `updated_at`: timestamp

- `projects` - Portfolio projects
  - `id`: uuid (primary key)
  - `title`: text
  - `slug`: text (unique)
  - `description`: text
  - `excerpt`: text
  - `image_url`: text
  - `tech_stack`: text
  - `github_url`: text
  - `live_url`: text
  - `featured`: boolean
  - `created_at`: timestamp
  - `updated_at`: timestamp

4. **Create environment variables**

Create a `.env` file in the root directory and add your Supabase URL and anon key:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. **Update Supabase configuration**

Open `src/main.js` and replace the placeholder Supabase credentials with the environment variables:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

6. **Start the development server**

```bash
npm run dev
```

7. **Open in browser**

Navigate to `http://localhost:5173` in your browser.

## Deployment

### Cloudflare Pages

1. Push your code to a GitHub repository

2. In Cloudflare Pages, create a new project and connect it to your GitHub repository

3. Configure the build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Add environment variables from your `.env` file

4. Deploy the site

## Content Management

### Accessing the Admin Dashboard

1. Navigate to `/admin` on your site
2. Log in with your Supabase user credentials

### Managing Content

- **Blog Posts**: Create, edit, and delete blog posts
- **Pages**: Manage static pages like About, Contact, etc.
- **Categories**: Organize blog posts into categories
- **Projects**: Showcase your work with details and links

## Customization

### Styling

The site's appearance can be customized by editing `src/style.css`. The color scheme is defined at the top of the file using CSS variables.

### Navigation

Update the navigation links in `src/components/Navigation.js`.

## License

MIT 