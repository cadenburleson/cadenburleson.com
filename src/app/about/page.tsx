import Image from 'next/image';

export default function About() {
    const skills = [
        { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Supabase'] },
        { category: 'Tools', items: ['Git', 'VS Code', 'Figma', 'Vercel', 'Cloudflare'] }
    ];

    return (
        <div className="space-y-12">
            <section className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                <div className="w-64 h-64 relative rounded-full overflow-hidden flex-shrink-0">
                    {/* Replace with your profile image */}
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                        Profile Photo
                    </div>
                </div>
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">About Me</h1>
                    <div className="prose max-w-none">
                        <p>
                            Hello! I'm Caden Burleson, a passionate web developer and designer
                            focused on creating clean, user-friendly experiences on the web.
                        </p>
                        <p>
                            With a background in [your background], I combine technical expertise with
                            creative problem-solving to build websites and applications that are both
                            functional and beautiful.
                        </p>
                        <p>
                            When I'm not coding, you can find me [your hobbies/interests].
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Skills & Technologies</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skills.map(skill => (
                        <div key={skill.category} className="border rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">{skill.category}</h3>
                            <ul className="space-y-2">
                                {skill.items.map(item => (
                                    <li key={item} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Experience Timeline</h2>
                <div className="space-y-8">
                    {/* Timeline items */}
                    <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                            <div className="w-1 h-full bg-blue-600"></div>
                        </div>
                        <div className="pb-8">
                            <p className="text-sm text-gray-500">2022 - Present</p>
                            <h3 className="text-xl font-semibold">Senior Web Developer</h3>
                            <p className="text-gray-700">Company Name</p>
                            <p className="mt-2">
                                Description of your role and responsibilities.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                            <div className="w-1 h-full bg-blue-600"></div>
                        </div>
                        <div className="pb-8">
                            <p className="text-sm text-gray-500">2020 - 2022</p>
                            <h3 className="text-xl font-semibold">Web Developer</h3>
                            <p className="text-gray-700">Previous Company</p>
                            <p className="mt-2">
                                Description of your role and responsibilities.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">2018 - 2020</p>
                            <h3 className="text-xl font-semibold">Junior Developer</h3>
                            <p className="text-gray-700">First Company</p>
                            <p className="mt-2">
                                Description of your role and responsibilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 