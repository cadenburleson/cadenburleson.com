import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-600">
                            © {currentYear} Caden Burleson. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="https://github.com/cadenburleson" className="text-gray-600 hover:text-blue-600">
                            GitHub
                        </Link>
                        <Link href="https://linkedin.com/in/cadenburleson" className="text-gray-600 hover:text-blue-600">
                            LinkedIn
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 