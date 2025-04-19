// Email.js Integration for contact form
// This utility handles sending emails using the EmailJS service
// You'll need to sign up at https://www.emailjs.com/ and get your service, template, and user IDs

// EmailJS CDN is loaded in index.html
// If EmailJS isn't available yet, this will load it
function loadEmailJSScript() {
    if (window.emailjs) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/sdk/2.6.4/email.min.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize EmailJS with your user ID
export async function initializeEmailJS() {
    try {
        await loadEmailJSScript();

        // Get user ID from environment variables
        const userId = import.meta.env.VITE_EMAILJS_USER_ID;

        if (!userId) {
            console.warn('EmailJS User ID not found in environment variables. Email functionality will not work.');
            return false;
        }

        window.emailjs.init(userId);
        console.log('EmailJS initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return false;
    }
}

// Send email using EmailJS
export async function sendEmail({ name, email, subject, message }) {
    try {
        // Check if EmailJS is available
        if (!window.emailjs) {
            const initialized = await loadEmailJSScript();
            if (!initialized) {
                throw new Error('EmailJS could not be initialized');
            }
        }

        // Get service and template IDs from environment variables
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        if (!serviceId || !templateId) {
            throw new Error('EmailJS Service ID or Template ID not found in environment variables');
        }

        // Prepare template parameters
        const templateParams = {
            from_name: name,
            reply_to: email,
            subject: subject,
            message: message
        };

        // Send the email
        const response = await window.emailjs.send(
            serviceId,  // Email Service ID
            templateId, // Email Template ID
            templateParams
        );

        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
} 