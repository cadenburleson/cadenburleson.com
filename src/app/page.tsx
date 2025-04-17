import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: 'Project One',
      description: 'A short description of the first project.',
      image: '/project-1.jpg',
      tags: ['Next.js', 'React', 'Tailwind CSS'],
      slug: 'project-one'
    },
    {
      id: 2,
      title: 'Project Two',
      description: 'A short description of the second project.',
      image: '/project-2.jpg',
      tags: ['Node.js', 'Express', 'MongoDB'],
      slug: 'project-two'
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'A short description of the third project.',
      image: '/project-3.jpg',
      tags: ['React Native', 'Firebase'],
      slug: 'project-three'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6">Caden Burleson</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Web Developer & Designer creating beautiful, functional digital experiences.
        </p>
        <Link
          href="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          See My Work
        </Link>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Link href="/projects" className="text-blue-600 hover:underline">
            View All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
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
