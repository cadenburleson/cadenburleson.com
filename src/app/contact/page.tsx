import Link from 'next/link';

export default function Contact() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <section>
                <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
                <p className="text-xl text-gray-600 mb-8">
                    I'm always open to new opportunities and collaborations. Feel free to reach out using any of the methods below.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Email</h3>
                            <a href="mailto:hello@cadenburleson.com" className="text-blue-600 hover:underline">
                                hello@cadenburleson.com
                            </a>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Connect</h3>
                            <div className="flex space-x-4 mt-2">
                                <a
                                    href="https://github.com/cadenburleson"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:text-blue-600"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="https://linkedin.com/in/cadenburleson"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:text-blue-600"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://twitter.com/cadenburleson"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:text-blue-600"
                                >
                                    Twitter
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Location</h3>
                            <p className="text-gray-700">
                                Based in San Francisco, CA
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your message"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                    <p className="text-sm text-gray-500 mt-4">
                        Note: This form is for demonstration purposes. For a functional form, you'll need to
                        integrate with a service like Formspree, EmailJS, or create your own API endpoint.
                    </p>
                </div>
            </section>
        </div>
    );
} 