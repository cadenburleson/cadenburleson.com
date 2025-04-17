import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="font-bold text-xl">
                            Caden Burleson
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/about" className="hover:text-blue-600">
                            About
                        </Link>
                        <Link href="/projects" className="hover:text-blue-600">
                            Projects
                        </Link>
                        <Link href="/blog" className="hover:text-blue-600">
                            Blog
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 