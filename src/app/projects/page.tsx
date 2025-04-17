import Link from 'next/link';

export default function Projects() {
    const projects = [
        {
            id: 1,
            title: 'Project One',
            description: 'A short description of the first project with a bit more detail than on the homepage.',
            image: '/project-1.jpg',
            tags: ['Next.js', 'React', 'Tailwind CSS'],
            slug: 'project-one'
        },
        {
            id: 2,
            title: 'Project Two',
            description: 'A short description of the second project with a bit more detail than on the homepage.',
            image: '/project-2.jpg',
            tags: ['Node.js', 'Express', 'MongoDB'],
            slug: 'project-two'
        },
        {
            id: 3,
            title: 'Project Three',
            description: 'A short description of the third project with a bit more detail than on the homepage.',
            image: '/project-3.jpg',
            tags: ['React Native', 'Firebase'],
            slug: 'project-three'
        },
        {
            id: 4,
            title: 'Project Four',
            description: 'A short description of the fourth project with a bit more detail than on the homepage.',
            image: '/project-4.jpg',
            tags: ['Vue.js', 'Nuxt', 'Supabase'],
            slug: 'project-four'
        },
        {
            id: 5,
            title: 'Project Five',
            description: 'A short description of the fifth project with a bit more detail than on the homepage.',
            image: '/project-5.jpg',
            tags: ['WordPress', 'PHP', 'MySQL'],
            slug: 'project-five'
        },
        {
            id: 6,
            title: 'Project Six',
            description: 'A short description of the sixth project with a bit more detail than on the homepage.',
            image: '/project-6.jpg',
            tags: ['Python', 'Django', 'PostgreSQL'],
            slug: 'project-six'
        }
    ];

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">My Projects</h1>
                <p className="text-xl text-gray-600 mb-8">
                    A collection of my work, including web applications, designs, and open-source contributions.
                </p>
            </section>

            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <div className="relative h-48 bg-gray-200">
                                {/* Replace with actual images later */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    [Project Image]
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    View Project →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
} 