import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

// Define the type for a full blog post
interface Post {
    id: number;
    title: string;
    slug: string;
    body: string;
    created_at: string;
    tags: string[];
}

// This will fetch a single post from Supabase
async function getPost(slug: string): Promise<Post | null> {
    // For now, return mock data since we don't have actual Supabase setup yet
    // In a real implementation, use the commented code below
    /*
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, body, created_at, tags')
      .eq('slug', slug)
      .single();
  
    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  
    return data;
    */

    // Mock data
    const posts = [
        {
            id: 1,
            title: 'Getting Started with Next.js and Supabase',
            slug: 'getting-started-with-nextjs-and-supabase',
            body: `
# Getting Started with Next.js and Supabase

Next.js and Supabase are a powerful combination for building modern web applications. In this post, we'll explore how to set them up and create a basic application.

## Setting Up Your Project

First, let's create a new Next.js project:

\`\`\`bash
npx create-next-app my-project
cd my-project
\`\`\`

Next, add Supabase:

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

## Connecting to Supabase

Create a utility file to initialize the Supabase client:

\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
\`\`\`

## Building Your First Feature

Now you're ready to build features using this powerful stack!
      `,
            created_at: '2023-10-15T12:00:00Z',
            tags: ['Next.js', 'Supabase', 'Web Development']
        },
        {
            id: 2,
            title: 'Building Responsive UIs with Tailwind CSS',
            slug: 'building-responsive-uis-with-tailwind-css',
            body: `
# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how developers approach UI design. Here's how to get started and build responsive interfaces.

## Setting Up Tailwind

First, install Tailwind in your project:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Configuring Tailwind

Update your tailwind.config.js file:

\`\`\`javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## Building Responsive Components

Here's a simple responsive card component:

\`\`\`jsx
function Card() {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold">Card Title</h2>
      <p className="mt-2 text-gray-600">Card content goes here...</p>
    </div>
  );
}
\`\`\`

With Tailwind's responsive modifiers, creating adaptive UIs is straightforward!
      `,
            created_at: '2023-09-28T14:30:00Z',
            tags: ['CSS', 'Tailwind', 'Frontend']
        },
        {
            id: 3,
            title: 'The Power of TypeScript in Modern Applications',
            slug: 'the-power-of-typescript-in-modern-applications',
            body: `
# The Power of TypeScript in Modern Applications

TypeScript has become an essential tool for many JavaScript developers. Let's explore why it's so valuable.

## Why TypeScript?

TypeScript adds static typing to JavaScript, which helps catch errors early in the development process. Here are some benefits:

- Early error detection
- Better IDE support with intelligent code completion
- Improved code documentation
- Enhanced refactoring capabilities

## Basic TypeScript Examples

Here's a simple function with type annotations:

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// This works fine
console.log(greet("World"));

// This would cause a compilation error
// console.log(greet(123));
\`\`\`

## Interfaces and Types

TypeScript's interfaces and type aliases help define complex data structures:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

function getUserInfo(user: User): string {
  return \`\${user.name} (\${user.email}) - \${user.role}\`;
}
\`\`\`

TypeScript is a game-changer for maintaining large codebases and working in teams!
      `,
            created_at: '2023-09-10T09:15:00Z',
            tags: ['TypeScript', 'JavaScript', 'Development']
        },
        {
            id: 4,
            title: 'Deploying Next.js Applications to Cloudflare Pages',
            slug: 'deploying-nextjs-applications-to-cloudflare-pages',
            body: `
# Deploying Next.js Applications to Cloudflare Pages

Cloudflare Pages is a fast, secure, and easy way to deploy your Next.js applications. Here's how to get started.

## Prerequisites

Before you begin, make sure you have:

- A Next.js application ready for deployment
- A Cloudflare account
- Your code hosted on GitHub or GitLab

## Setting Up Your Deployment

1. Log in to your Cloudflare dashboard
2. Navigate to Pages and click "Create a project"
3. Connect your GitHub or GitLab account
4. Select your repository
5. Configure your build settings:
   - Build command: \`npm run build\`
   - Build output directory: \`out\`
6. Click "Save and Deploy"

## Configuring Your Next.js Project

For optimal compatibility with Cloudflare Pages, update your next.config.js:

\`\`\`javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
\`\`\`

## Configuring Custom Domains

1. Navigate to your Pages project in the Cloudflare dashboard
2. Go to "Custom domains"
3. Add your domain and follow the verification steps

Cloudflare Pages provides excellent performance with its global CDN and integrated security features!
      `,
            created_at: '2023-08-22T11:45:00Z',
            tags: ['Next.js', 'Cloudflare', 'Deployment']
        }
    ];

    const post = posts.find(p => p.slug === slug);
    return post || null;
}

type Props = {
    params: {
        slug: string;
    };
};

export default async function BlogPost({ params }: Props) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto">
            <article className="space-y-8">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold">{post.title}</h1>
                    <div className="flex items-center text-sm text-gray-500">
                        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                        <span className="mx-2">•</span>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="prose max-w-none">
                    {/* 
            In a real app, you'd use a markdown renderer like react-markdown 
            This is just a simple implementation for demonstration
          */}
                    {post.body.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                            return <h1 key={index} className="text-3xl font-bold my-4">{line.substring(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-2xl font-bold my-4">{line.substring(3)}</h2>;
                        } else if (line.startsWith('- ')) {
                            return <li key={index} className="ml-6 list-disc my-1">{line.substring(2)}</li>;
                        } else if (line.trim().startsWith('```')) {
                            return (
                                <pre key={index} className="bg-gray-100 p-4 rounded overflow-x-auto my-4">
                                    <code>{line}</code>
                                </pre>
                            );
                        } else {
                            return <p key={index} className="my-3">{line}</p>;
                        }
                    })}
                </div>
            </article>

            <div className="mt-12 pt-8 border-t">
                <Link href="/blog" className="text-blue-600 hover:underline">
                    ← Back to Blog
                </Link>
            </div>
        </div>
    );
} 