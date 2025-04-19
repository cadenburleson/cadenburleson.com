import './style.css'
import { createClient } from '@supabase/supabase-js'
import { renderNavigation } from './components/Navigation.js'
import { renderHomePage } from './pages/Home.js'
import { renderAboutPage } from './pages/About.js'
import { renderProjectsPage } from './pages/Projects.js'
import { renderProjectDetailPage } from './pages/ProjectDetail.js'
import { renderBlogPage, renderBlogPostPage } from './pages/Blog.js'
import { renderContactPage } from './pages/Contact.js'
import { renderAdminPage } from './pages/Admin.js'

// Initialize Supabase client
let supabase = null;
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Only create client if we have valid URL and key
  if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase credentials not properly configured, using mock data only');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Export supabase client (might be null if initialization failed)
export { supabase };

// Handle routing
async function handleRoute() {
  const path = window.location.pathname;
  const projectSlug = path.match(/^\/projects\/([a-z0-9-]+)/)?.[1];
  const blogPostSlug = path.match(/^\/blog\/([a-z0-9-]+)/)?.[1];

  const app = document.querySelector('#app');
  app.innerHTML = '';

  // Special handling for admin page
  if (path === '/admin') {
    renderAdminPage(app);
    return;
  }

  // Add navigation
  const nav = renderNavigation(path);
  app.appendChild(nav);

  // Add main content based on route
  const main = document.createElement('main');
  app.appendChild(main);

  if (path === '/' || path === '/index.html') {
    await renderHomePage(main);
  } else if (path === '/about') {
    renderAboutPage(main);
  } else if (path === '/projects') {
    renderProjectsPage(main);
  } else if (projectSlug) {
    renderProjectDetailPage(main, projectSlug);
  } else if (path === '/blog') {
    renderBlogPage(main);
  } else if (blogPostSlug) {
    renderBlogPostPage(main, blogPostSlug);
  } else if (path === '/contact') {
    renderContactPage(main);
  } else {
    // 404 page
    main.innerHTML = `
      <div class="container">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" class="button">Go Home</a>
      </div>
    `;
  }
}

// Handle custom event for route changes
document.addEventListener('route-changed', () => {
  handleRoute().catch(error => {
    console.error('Error handling route:', error);
  });
});

// Handle navigation without page reload
document.addEventListener('click', (e) => {
  const target = e.target.closest('a');
  if (target && target.getAttribute('href') &&
    target.getAttribute('href').startsWith('/') &&
    !target.getAttribute('target')) {
    e.preventDefault();
    window.history.pushState({}, '', target.getAttribute('href'));
    handleRoute().catch(error => {
      console.error('Error handling route after click:', error);
    });
  }
});

// Listen for popstate to handle browser back/forward
window.addEventListener('popstate', () => {
  handleRoute().catch(error => {
    console.error('Error handling route after popstate:', error);
  });
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  handleRoute().catch(error => {
    console.error('Error during initial route handling:', error);
  });
});
