import Link from 'next/link';
import { notFound } from 'next/navigation';

// This would normally come from a database
const projectsData = [
    {
        id: 1,
        title: 'Project One',
        description: 'A detailed description of project one. This will explain the project goals, technologies used, challenges faced, and solutions implemented.',
        image: '/project-1.jpg',
        tags: ['Next.js', 'React', 'Tailwind CSS'],
        slug: 'project-one',
        github: 'https://github.com/cadenburleson/project-one',
        liveDemo: 'https://project-one.demo',
        features: [
            'Responsive design for all devices',
            'Server-side rendering for optimal performance',
            'Authentication and authorization system',
            'Data visualization components'
        ]
    },
    {
        id: 2,
        title: 'Project Two',
        description: 'A detailed description of project two. This will explain the project goals, technologies used, challenges faced, and solutions implemented.',
        image: '/project-2.jpg',
        tags: ['Node.js', 'Express', 'MongoDB'],
        slug: 'project-two',
        github: 'https://github.com/cadenburleson/project-two',
        liveDemo: 'https://project-two.demo',
        features: [
            'RESTful API design',
            'Database optimization',
            'Rate limiting and security features',
            'Comprehensive documentation'
        ]
    },
    {
        id: 3,
        title: 'Project Three',
        description: 'A detailed description of project three. This will explain the project goals, technologies used, challenges faced, and solutions implemented.',
        image: '/project-3.jpg',
        tags: ['React Native', 'Firebase'],
        slug: 'project-three',
        github: 'https://github.com/cadenburleson/project-three',
        liveDemo: 'https://project-three.demo',
        features: [
            'Cross-platform mobile application',
            'Real-time data synchronization',
            'Offline support',
            'Push notifications'
        ]
    }
];

type Props = {
    params: {
        slug: string;
    };
};

export default function ProjectDetail({ params }: Props) {
    const project = projectsData.find(p => p.slug === params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                    [Project Hero Image]
                </div>
            </div>

            <div className="space-y-6">
                <h1 className="text-4xl font-bold">{project.title}</h1>

                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        GitHub Repository
                    </a>
                    <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Live Demo
                    </a>
                </div>

                <div className="prose max-w-none">
                    <p className="text-lg">{project.description}</p>

                    <h2>Key Features</h2>
                    <ul>
                        {project.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t">
                <Link href="/projects" className="text-blue-600 hover:underline">
                    ← Back to Projects
                </Link>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return projectsData.map((project) => ({
        slug: project.slug,
    }));
} 