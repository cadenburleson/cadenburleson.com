import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-8">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mb-10">
                Sorry, the page you are looking for might have been removed, had its name changed, or is
                temporarily unavailable.
            </p>
            <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
                Return to Home
            </Link>
        </div>
    );
} 