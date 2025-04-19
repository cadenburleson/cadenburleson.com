import { renderLoginForm, renderSignupForm, isAuthenticated, signOut } from '../components/Auth.js';
import { renderAdminDashboard } from '../components/AdminDashboard.js';

export async function renderAdminPage(container) {
    container.className = 'admin-page-container';
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated();

        if (authenticated) {
            renderAdminDashboardPage(container);
        } else {
            renderLoginPage(container);
        }
    } catch (error) {
        console.error('Error rendering admin page:', error);
        container.innerHTML = `
      <div class="error-container">
        <h2>Error</h2>
        <p>Failed to load the admin panel. Please try again later.</p>
        <button id="retry-btn" class="btn">Retry</button>
      </div>
    `;

        document.getElementById('retry-btn').addEventListener('click', () => {
            renderAdminPage(container);
        });
    }
}

function renderLoginPage(container) {
    container.innerHTML = '';
    const loginForm = renderLoginForm();
    container.appendChild(loginForm);
}

function renderAdminDashboardPage(container) {
    console.log('Rendering admin dashboard page');
    container.innerHTML = '';

    // Add header with logout button
    const header = document.createElement('header');
    header.className = 'admin-header';
    header.innerHTML = `
    <h1>Admin Dashboard</h1>
    <div class="admin-actions">
      <a href="/" class="btn btn-secondary">View Site</a>
      <button id="logout-btn" class="btn btn-outline">Logout</button>
    </div>
  `;

    // Add logout functionality
    header.querySelector('#logout-btn').addEventListener('click', async () => {
        const success = await signOut();
        if (success) {
            renderLoginPage(container);
        } else {
            alert('Failed to logout. Please try again.');
        }
    });

    container.appendChild(header);

    // Add the admin dashboard
    const dashboard = renderAdminDashboard();
    container.appendChild(dashboard);

    // Dispatch event indicating the dashboard has been mounted
    // This can help with timing issues related to loading content
    window.setTimeout(() => {
        document.dispatchEvent(new CustomEvent('admin-dashboard-mounted'));
    }, 0);
} 