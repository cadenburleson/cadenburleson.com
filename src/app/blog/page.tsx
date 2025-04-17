import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

// Define the type for a blog post
interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    created_at: string;
    tags: string[];
}

// This will fetch posts from Supabase
async function getPosts(): Promise<Post[]> {
    // For now, return mock data since we don't have actual Supabase setup yet
    // In a real implementation, use the commented code below
    /*
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, created_at, tags')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  
    return data || [];
    */

    // Mock data
    return [
        {
            id: 1,
            title: 'Getting Started with Next.js and Supabase',
            slug: 'getting-started-with-nextjs-and-supabase',
            excerpt: 'Learn how to build a modern web application using Next.js and Supabase as the backend.',
            created_at: '2023-10-15T12:00:00Z',
            tags: ['Next.js', 'Supabase', 'Web Development']
        },
        {
            id: 2,
            title: 'Building Responsive UIs with Tailwind CSS',
            slug: 'building-responsive-uis-with-tailwind-css',
            excerpt: 'Discover how to create beautiful responsive interfaces quickly using Tailwind CSS.',
            created_at: '2023-09-28T14:30:00Z',
            tags: ['CSS', 'Tailwind', 'Frontend']
        },
        {
            id: 3,
            title: 'The Power of TypeScript in Modern Applications',
            slug: 'the-power-of-typescript-in-modern-applications',
            excerpt: 'Explore how TypeScript can improve developer experience and code quality in your projects.',
            created_at: '2023-09-10T09:15:00Z',
            tags: ['TypeScript', 'JavaScript', 'Development']
        },
        {
            id: 4,
            title: 'Deploying Next.js Applications to Cloudflare Pages',
            slug: 'deploying-nextjs-applications-to-cloudflare-pages',
            excerpt: 'Step-by-step guide to deploying your Next.js application to Cloudflare Pages for optimal performance.',
            created_at: '2023-08-22T11:45:00Z',
            tags: ['Next.js', 'Cloudflare', 'Deployment']
        }
    ];
}

export default async function Blog() {
    const posts = await getPosts();

    return (
        <div className="space-y-10">
            <section>
                <h1 className="text-4xl font-bold mb-4">Blog</h1>
                <p className="text-xl text-gray-600">
                    Thoughts, tutorials, and insights about web development and design.
                </p>
            </section>

            <section className="space-y-12">
                {posts.map((post) => (
                    <article key={post.id} className="border-b pb-8">
                        <Link href={`/blog/${post.slug}`} className="group">
                            <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600">
                                {post.title}
                            </h2>
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
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
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Read More →
                        </Link>
                    </article>
                ))}
            </section>
        </div>
    );
} 