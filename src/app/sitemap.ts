import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base URL
    const baseUrl = 'https://cadenburleson.com';

    // Static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // In a real app, you would fetch dynamic routes from Supabase
    // Example:
    // const { data: posts } = await supabase.from('posts').select('slug, updated_at');
    // const { data: projects } = await supabase.from('projects').select('slug, updated_at');

    // const postRoutes = posts.map((post) => ({
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   lastModified: new Date(post.updated_at),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.6,
    // }));

    // const projectRoutes = projects.map((project) => ({
    //   url: `${baseUrl}/projects/${project.slug}`,
    //   lastModified: new Date(project.updated_at),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // }));

    // return [...routes, ...postRoutes, ...projectRoutes];

    return routes;
} 