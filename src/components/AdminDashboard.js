import { supabase } from '../main.js';

// Create the admin dashboard UI
export function renderAdminDashboard() {
  // Create the dashboard container first
  const dashboard = document.createElement('div');
  dashboard.className = 'admin-panel';

  // Check if Supabase is properly initialized
  if (!supabase) {
    dashboard.innerHTML = `
      <div class="error-container" style="color: red; padding: 20px; border: 1px solid red; margin: 20px; border-radius: 4px;">
        <h2>Error: Supabase Not Connected</h2>
        <p>The admin dashboard requires a connection to Supabase.</p>
        <p>Please check your environment variables in the .env file:</p>
        <ul>
          <li>VITE_SUPABASE_URL must be set to your Supabase project URL</li>
          <li>VITE_SUPABASE_ANON_KEY must be set to your Supabase anonymous key</li>
        </ul>
        <p>After fixing these settings, restart the development server.</p>
      </div>
    `;
    return dashboard;
  }

  // Log Supabase information (safely)
  try {
    console.log('Supabase URL:', supabase.supabaseUrl || 'not available');

    // Check auth in a safer way
    try {
      const session = supabase.auth.session && supabase.auth.session();
      console.log('Supabase auth status:', !!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  } catch (e) {
    console.error('Error accessing Supabase:', e);
  }

  // Initialize storage buckets in background, don't block UI rendering
  setTimeout(() => {
    try {
      if (supabase && supabase.storage) {
        // Test if we have upload permissions by trying to list bucket contents
        (async () => {
          try {
            console.log('Testing storage permissions...');

            // Try listing files in blog-images bucket
            const { data: filesList, error: listError } = await supabase.storage
              .from('blog-images')
              .list();

            if (listError) {
              console.error('Error listing files:', listError);

              // Only show warning if this is a permission issue
              if (listError.message && listError.message.includes('permission')) {
                const storagePermissionWarning = document.createElement('div');
                storagePermissionWarning.className = 'storage-permission-warning';
                storagePermissionWarning.style.backgroundColor = '#fff3e0';
                storagePermissionWarning.style.color = '#e65100';
                storagePermissionWarning.style.padding = '10px';
                storagePermissionWarning.style.margin = '10px 0';
                storagePermissionWarning.style.borderRadius = '4px';
                storagePermissionWarning.style.border = '1px solid #ffe0b2';
                storagePermissionWarning.innerHTML = `
                  <p><strong>Storage Permission Issue:</strong> Your Supabase buckets may not have the correct permissions.</p>
                  <p>To fix this, go to your Supabase Dashboard → Storage → Policies and ensure you have these policies:</p>
                  <ul>
                    <li>A policy allowing the anon role to SELECT files (for viewing images)</li>
                    <li>A policy allowing the anon role to INSERT files (for uploading images)</li>
                  </ul>
                `;
                dashboard.prepend(storagePermissionWarning);
              }
            } else {
              console.log(`Storage permissions verified successfully. Found ${filesList?.length || 0} files in blog-images bucket.`);
            }
          } catch (err) {
            console.error('Error checking storage permissions:', err);
          }
        })();
      } else {
        console.warn('Supabase storage not available, image uploads will not work');
        // Display warning message on the dashboard
        const warningMsg = document.createElement('div');
        warningMsg.className = 'storage-warning';
        warningMsg.style.backgroundColor = '#fff8e1';
        warningMsg.style.color = '#f57f17';
        warningMsg.style.padding = '10px';
        warningMsg.style.margin = '10px 0';
        warningMsg.style.borderRadius = '4px';
        warningMsg.innerHTML = '<strong>Warning:</strong> Supabase storage not available, image uploads will not work. Check browser console for details.';
        dashboard.prepend(warningMsg);
      }
    } catch (err) {
      console.error('Error initializing storage:', err);
    }
  }, 1000);

  // Add modal overlay styles
  try {
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
      }
      
      .form-group input[type="text"],
      .form-group input[type="date"],
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      
      .form-group select {
        height: 36px;
        background-color: white;
      }
      
      /* Image upload styling */
      .image-upload-container {
        margin-top: 5px;
      }
      
      .image-preview-container {
        margin-top: 10px;
        position: relative;
        display: inline-block;
      }
      
      .image-preview {
        max-width: 100%;
        max-height: 200px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 3px;
      }
      
      .remove-image-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 3px;
        padding: 3px 8px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .image-upload-progress {
        margin-top: 10px;
        width: 100%;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-bar {
        height: 10px;
        background-color: #4CAF50;
        width: 0%;
        transition: width 0.3s;
      }
      
      .progress-text {
        font-size: 12px;
        text-align: center;
        margin-top: 2px;
      }
      
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
      
      .form-actions button {
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 4px;
      }
      
      .save-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
      }
      
      .cancel-btn {
        background-color: #f44336;
        color: white;
        border: none;
      }
      
      /* Gallery upload styling */
      .gallery-upload-container {
        margin-top: 10px;
      }
      
      .gallery-preview-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      
      .gallery-preview-item {
        position: relative;
      }
      
      .gallery-preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .remove-gallery-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 3px;
        padding: 3px 8px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .gallery-upload-progress {
        margin-top: 10px;
        width: 100%;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
      }
      
      /* Category input styling */
      .category-input-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .category-input-group select {
        flex-grow: 1;
      }
      
      .new-category-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
      }
      
      .new-category-btn:hover {
        background-color: #45a049;
      }
      
      .new-category-btn:active {
        background-color: #3e8e41;
      }
    `;
    document.head.appendChild(style);
  } catch (err) {
    console.error('Error adding styles:', err);
  }

  // Set up UI
  dashboard.innerHTML = `
    <h1>Admin Dashboard</h1>
    <nav class="admin-nav">
      <a href="#posts" class="admin-nav-link active" data-section="posts">Blog Posts</a>
      <a href="#projects" class="admin-nav-link" data-section="projects">Projects</a>
      <a href="#pages" class="admin-nav-link" data-section="pages">Pages</a>
      <a href="#categories" class="admin-nav-link" data-section="categories">Categories</a>
    </nav>
    <div id="admin-content">
      <div id="posts-panel" class="admin-panel-content active">
        <h2>Blog Posts</h2>
        <button id="new-post-btn" class="action-btn">New Post</button>
        <div id="posts-list">
          <p>Loading posts...</p>
        </div>
      </div>
      <div id="projects-panel" class="admin-panel-content">
        <h2>Projects</h2>
        <button id="new-project-btn" class="action-btn">New Project</button>
        <div id="projects-list">Loading projects...</div>
      </div>
      <div id="pages-panel" class="admin-panel-content">
        <h2>Pages</h2>
        <button id="new-page-btn" class="action-btn">New Page</button>
        <div id="pages-list">Loading pages...</div>
      </div>
      <div id="categories-panel" class="admin-panel-content">
        <h2>Categories</h2>
        <button id="new-category-btn" class="action-btn">New Category</button>
        <div id="categories-list">Loading categories...</div>
      </div>
    </div>
  `;

  // Set up navigation behavior
  dashboard.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class from all links and panels
      dashboard.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
      dashboard.querySelectorAll('.admin-panel-content').forEach(p => p.classList.remove('active'));

      // Add active class to clicked link and corresponding panel
      link.classList.add('active');
      const sectionId = `${link.dataset.section}-panel`;
      const panel = document.getElementById(sectionId);
      panel.classList.add('active');

      // Load content for the section
      const section = link.dataset.section;
      switch (section) {
        case 'posts':
          // Only load if not already loaded or if there was an error
          const postsList = document.getElementById('posts-list');
          if (!postsList.dataset.loaded || postsList.dataset.loaded === 'error') {
            loadPosts();
          }
          break;
        case 'projects':
          // Only load if not already loaded
          const projectsList = document.getElementById('projects-list');
          if (!projectsList.dataset.loaded) {
            loadProjects();
            projectsList.dataset.loaded = 'true';
          }
          break;
        case 'pages':
          // Only load if not already loaded
          const pagesList = document.getElementById('pages-list');
          if (!pagesList.dataset.loaded) {
            loadPages();
            pagesList.dataset.loaded = 'true';
          }
          break;
        case 'categories':
          // Only load if not already loaded
          const categoriesList = document.getElementById('categories-list');
          if (!categoriesList.dataset.loaded) {
            loadCategories();
            categoriesList.dataset.loaded = 'true';
          }
          break;
      }
    });
  });

  // Add event listeners for action buttons
  dashboard.querySelector('#new-post-btn').addEventListener('click', () => {
    try {
      showPostForm();
    } catch (error) {
      console.error('Error showing post form:', error);
      alert('Failed to open post form: ' + (error.message || 'Unknown error'));
    }
  });

  dashboard.querySelector('#new-project-btn').addEventListener('click', () => {
    try {
      showProjectForm();
    } catch (error) {
      console.error('Error showing project form:', error);
      alert('Failed to open project form: ' + (error.message || 'Unknown error'));
    }
  });

  dashboard.querySelector('#new-page-btn').addEventListener('click', () => {
    try {
      showPageForm();
    } catch (error) {
      console.error('Error showing page form:', error);
      alert('Failed to open page form: ' + (error.message || 'Unknown error'));
    }
  });

  dashboard.querySelector('#new-category-btn').addEventListener('click', () => {
    try {
      showCategoryForm();
    } catch (error) {
      console.error('Error showing category form:', error);
      alert('Failed to open category form: ' + (error.message || 'Unknown error'));
    }
  });

  // Load blog posts immediately when dashboard is loaded
  // Instead of using a timeout, we'll use a reliable approach to ensure DOM is ready
  // This will ensure posts are loaded when the admin page first loads
  setTimeout(() => {
    // Load initial posts data
    loadPosts();

    // Also set up a mutation observer to watch for DOM changes
    // This ensures the posts load even if there's a page refresh or SPA navigation
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' &&
          document.getElementById('posts-list') &&
          document.getElementById('posts-panel').classList.contains('active')) {
          loadPosts();
          observer.disconnect(); // Only load once
          break;
        }
      }
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });
  }, 0);

  // Add an event listener for the admin-dashboard-mounted event
  document.addEventListener('admin-dashboard-mounted', () => {
    console.log('Admin dashboard mounted event received, loading posts');
    loadPosts();
  });

  return dashboard;
}

// Load blog posts for the admin panel
async function loadPosts() {
  console.log('loadPosts called - checking requirements');

  // Ensure we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to load admin posts outside of admin page');
    return;
  }

  // Get the posts list element, handling the case when it doesn't exist
  const postsList = document.getElementById('posts-list');
  if (!postsList) {
    console.error('Could not find posts-list element');
    // Element isn't available yet - we'll try again later via MutationObserver
    return;
  }

  // Check if we've already loaded the posts (to avoid duplicate loads)
  if (postsList.dataset.loaded === 'true' && postsList.querySelectorAll('table').length > 0) {
    console.log('Posts already loaded, skipping loadPosts call');
    return;
  }

  // Display loading indicator
  postsList.innerHTML = '<p>Loading posts...</p>';
  console.log('Starting to load posts from Supabase');

  try {
    // Check if supabase is properly initialized
    if (!supabase || !supabase.from) {
      console.error('Supabase client not properly initialized for database operations');
      throw new Error('Supabase client not properly initialized');
    }

    console.log('Attempting to load posts from blog_posts table...');

    // Check if table exists first
    try {
      // First, verify we can access the database at all with a simple query
      const { count, error: countError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error verifying blog_posts table:', countError);
        if (countError.message && countError.message.includes('does not exist')) {
          throw new Error('The blog_posts table does not exist in your database');
        } else if (countError.message && countError.message.includes('permission')) {
          throw new Error('Permission denied: Check your RLS policies for the blog_posts table');
        }
        throw countError;
      }

      console.log(`Blog posts table exists with approximately ${count} posts`);
    } catch (tableError) {
      console.error('Table check error:', tableError);
      throw tableError;
    }

    // If we get here, the table exists and we have permission to query it
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase query error:', error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }

    console.log('Posts data received:', data ? `${data.length} posts found` : 'No data returned');

    if (!data || data.length === 0) {
      postsList.innerHTML = `
        <p>No posts available yet.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
          <h3>Getting Started</h3>
          <p>Click the "New Post" button above to create your first blog post.</p>
        </div>
      `;
      return;
    }

    postsList.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(post => `
            <tr>
              <td>${post.title || 'Untitled'}</td>
              <td>${post.category || 'None'}</td>
              <td>${post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown'}</td>
              <td class="actions">
                <button class="edit-post-btn" data-id="${post.id}">Edit</button>
                <button class="delete-post-btn" data-id="${post.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Add event listeners for edit and delete buttons
    try {
      postsList.querySelectorAll('.edit-post-btn').forEach(button => {
        button.addEventListener('click', () => {
          try {
            const postId = button.dataset.id;
            showPostForm(postId);
          } catch (err) {
            console.error('Error opening edit form:', err);
            alert('Failed to open edit form: ' + (err.message || 'Unknown error'));
          }
        });
      });

      postsList.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', async () => {
          try {
            const postId = button.dataset.id;
            if (confirm('Are you sure you want to delete this post?')) {
              await deletePost(postId);
              // Reload after deletion without full page refresh
              loadPosts();
            }
          } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post: ' + (err.message || 'Unknown error'));
          }
        });
      });
    } catch (eventError) {
      console.error('Error setting up button event listeners:', eventError);
    }

    // Mark as loaded when complete
    postsList.dataset.loaded = 'true';
  } catch (error) {
    console.error('Error loading posts:', error);

    // Show a more specific error message with troubleshooting help
    let errorMessage = error.message || 'Unknown error';
    let troubleshootingTips = '';

    if (errorMessage.includes('does not exist')) {
      troubleshootingTips = `
        <h4>Troubleshooting:</h4>
        <ol>
          <li>Go to your Supabase dashboard and check if the "blog_posts" table exists</li>
          <li>If it doesn't exist, create it with the necessary columns (id, title, slug, content, etc.)</li>
        </ol>
      `;
    } else if (errorMessage.includes('permission')) {
      troubleshootingTips = `
        <h4>Troubleshooting:</h4>
        <ol>
          <li>Go to your Supabase dashboard > Authentication > Policies</li>
          <li>Check if there's a policy for the "blog_posts" table that allows the anon role to select data</li>
          <li>If not, create a policy with the following settings:
            <ul>
              <li>Policy name: Allow anon select</li>
              <li>Target roles: anon, authenticated</li>
              <li>Using expression: true</li>
            </ul>
          </li>
        </ol>
      `;
    }

    postsList.innerHTML = `
      <div style="padding: 15px; background-color: #ffebee; border-radius: 4px; border: 1px solid #ffcdd2;">
        <h3 style="color: #c62828;">Error Loading Posts</h3>
        <p>${errorMessage}</p>
        ${troubleshootingTips}
      </div>
    `;

    // Even if there was an error, mark as loaded to prevent continuous retries
    postsList.dataset.loaded = 'error';
  }
}

// Load projects for the admin panel
async function loadProjects() {
  // Ensure we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to load admin projects outside of admin page');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const projectsList = document.getElementById('projects-list');

    if (!data || data.length === 0) {
      projectsList.innerHTML = '<p>No projects available yet.</p>';
      return;
    }

    projectsList.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(project => `
            <tr>
              <td>${project.title}</td>
              <td>${project.category || 'None'}</td>
              <td>${project.launch_date ? new Date(project.launch_date).toLocaleDateString() : 'N/A'}</td>
              <td>${project.featured ? 'Yes' : 'No'}</td>
              <td class="actions">
                <button class="edit-project-btn" data-id="${project.id}">Edit</button>
                <button class="delete-project-btn" data-id="${project.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Add event listeners for edit and delete buttons
    projectsList.querySelectorAll('.edit-project-btn').forEach(button => {
      button.addEventListener('click', () => {
        const projectId = button.dataset.id;
        showProjectForm(projectId);
      });
    });

    projectsList.querySelectorAll('.delete-project-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const projectId = button.dataset.id;
        if (confirm('Are you sure you want to delete this project?')) {
          await deleteProject(projectId);
        }
      });
    });

  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
  }
}

// Load pages for the admin panel
async function loadPages() {
  // Ensure we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to load admin pages outside of admin page');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    const pagesList = document.getElementById('pages-list');

    if (!data || data.length === 0) {
      pagesList.innerHTML = '<p>No pages available yet.</p>';
      return;
    }

    pagesList.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(page => `
            <tr>
              <td>${page.title}</td>
              <td>${page.slug}</td>
              <td>${new Date(page.updated_at).toLocaleDateString()}</td>
              <td class="actions">
                <button class="edit-page-btn" data-id="${page.id}">Edit</button>
                <button class="delete-page-btn" data-id="${page.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Add event listeners for edit and delete buttons
    pagesList.querySelectorAll('.edit-page-btn').forEach(button => {
      button.addEventListener('click', () => {
        const pageId = button.dataset.id;
        showPageForm(pageId);
      });
    });

    pagesList.querySelectorAll('.delete-page-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const pageId = button.dataset.id;
        if (confirm('Are you sure you want to delete this page?')) {
          await deletePage(pageId);
        }
      });
    });

  } catch (error) {
    console.error('Error loading pages:', error);
    const pagesList = document.getElementById('pages-list');
    pagesList.innerHTML = '<p>Failed to load pages. Please try again later.</p>';
  }
}

// Load categories for the admin panel
async function loadCategories() {
  // Ensure we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to load admin categories outside of admin page');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const categoriesList = document.getElementById('categories-list');

    if (!data || data.length === 0) {
      categoriesList.innerHTML = '<p>No categories available yet.</p>';
      return;
    }

    categoriesList.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(category => `
            <tr>
              <td>${category.name}</td>
              <td>${category.slug}</td>
              <td class="actions">
                <button class="edit-category-btn" data-id="${category.id}">Edit</button>
                <button class="delete-category-btn" data-id="${category.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Add event listeners for edit and delete buttons
    categoriesList.querySelectorAll('.edit-category-btn').forEach(button => {
      button.addEventListener('click', () => {
        const categoryId = button.dataset.id;
        showCategoryForm(categoryId);
      });
    });

    categoriesList.querySelectorAll('.delete-category-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const categoryId = button.dataset.id;
        if (confirm('Are you sure you want to delete this category?')) {
          await deleteCategory(categoryId);
        }
      });
    });

  } catch (error) {
    console.error('Error loading categories:', error);
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '<p>Failed to load categories. Please try again later.</p>';
  }
}

// Show post form for creating or editing a blog post
async function showPostForm(postId = null) {
  // Check if we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to show post form outside of admin page');
    return;
  }

  let post = { title: '', slug: '', content: '', excerpt: '', category: '', image_url: '' };
  let categories = [];

  try {
    // If editing, get the post data
    if (postId) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      post = data;
    }

    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;
    categories = categoriesData || [];

    // Remove any existing modal overlays
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'admin-post-form-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h2>${postId ? 'Edit' : 'New'} Blog Post</h2>
        <form id="admin-post-form" class="admin-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="post-title" name="title" value="${post.title}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="post-slug" name="slug" value="${post.slug}" required>
            <small>This will be automatically updated when you change the title</small>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="post-category" name="category">
              <option value="">-- Select Category --</option>
              ${categories.map(category => `
                <option value="${category.name}" ${post.category === category.name ? 'selected' : ''}>
                  ${category.name}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="image">Featured Image</label>
            <div class="image-upload-container">
              <input type="file" id="post-image-file" name="image_file" accept="image/*">
              <input type="hidden" id="post-image-url" name="image_url" value="${post.image_url || ''}">
              ${post.image_url ? `
                <div class="image-preview-container">
                  <img src="${post.image_url}" alt="Preview" class="image-preview">
                  <button type="button" class="remove-image-btn">Remove</button>
                </div>
              ` : `<div class="image-preview-container" style="display: none;">
                    <img src="" alt="Preview" class="image-preview">
                    <button type="button" class="remove-image-btn">Remove</button>
                  </div>`}
              <div class="image-upload-progress" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text">Uploading: 0%</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="excerpt">Excerpt</label>
            <textarea id="post-excerpt" name="excerpt" rows="2">${post.excerpt || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="post-content" name="content" rows="10" required>${post.content || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Set up form event listeners
    const form = overlay.querySelector('#admin-post-form');
    const titleInput = form.querySelector('#post-title');
    const slugInput = form.querySelector('#post-slug');

    // Function to generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Trim hyphens from start and end
    };

    // Update slug when title changes
    titleInput.addEventListener('input', () => {
      const newSlug = generateSlug(titleInput.value);
      slugInput.value = newSlug;
    });

    // Allow manual editing of slug if needed
    slugInput.addEventListener('input', () => {
      slugInput.value = generateSlug(slugInput.value);
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        title: titleInput.value,
        slug: slugInput.value,
        category: form.querySelector('[name="category"]').value || null,
        excerpt: form.querySelector('[name="excerpt"]').value,
        content: form.querySelector('[name="content"]').value,
        image_url: form.querySelector('[name="image_url"]').value || null
      };

      try {
        if (postId) {
          await updatePost(postId, formData);
        } else {
          await createPost(formData);
        }

        // Remove the modal
        document.body.removeChild(overlay);
        // Reload posts
        loadPosts();
      } catch (error) {
        console.error('Error saving post:', error);
        alert('Failed to save post: ' + (error.message || 'Unknown error'));
      }
    });

    // Handle cancel button
    overlay.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

  } catch (error) {
    console.error('Error showing post form:', error);
    alert('Failed to load form data. Please try again.');
  }
}

// CRUD operations for posts
async function createPost(formData) {
  try {
    const now = new Date();
    const { error } = await supabase
      .from('blog_posts')
      .insert([{
        ...formData,
        created_at: now,
        updated_at: now,
        published_at: now
      }]);

    if (error) throw error;

    alert('Post created successfully!');
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post. Please try again.');
  }
}

async function updatePost(postId, formData) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .update({ ...formData, updated_at: new Date() })
      .eq('id', postId);

    if (error) throw error;

    alert('Post updated successfully!');
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  }
}

async function deletePost(postId) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    alert('Post deleted successfully!');
    loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post. Please try again.');
  }
}

// CRUD operations for pages
async function createPage(formData) {
  try {
    const { error } = await supabase
      .from('pages')
      .insert([{ ...formData, created_at: new Date(), updated_at: new Date() }]);

    if (error) throw error;

    alert('Page created successfully!');
  } catch (error) {
    console.error('Error creating page:', error);
    alert('Failed to create page. Please try again.');
  }
}

async function updatePage(pageId, formData) {
  try {
    const { error } = await supabase
      .from('pages')
      .update({ ...formData, updated_at: new Date() })
      .eq('id', pageId);

    if (error) throw error;

    alert('Page updated successfully!');
  } catch (error) {
    console.error('Error updating page:', error);
    alert('Failed to update page. Please try again.');
  }
}

async function deletePage(pageId) {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;

    alert('Page deleted successfully!');
    loadPages();
  } catch (error) {
    console.error('Error deleting page:', error);
    alert('Failed to delete page. Please try again.');
  }
}

// CRUD operations for categories
async function createCategory(formData) {
  try {
    const { error } = await supabase
      .from('categories')
      .insert([{ ...formData, created_at: new Date(), updated_at: new Date() }]);

    if (error) throw error;

    alert('Category created successfully!');
  } catch (error) {
    console.error('Error creating category:', error);
    alert('Failed to create category. Please try again.');
  }
}

async function updateCategory(categoryId, formData) {
  try {
    const { error } = await supabase
      .from('categories')
      .update({ ...formData, updated_at: new Date() })
      .eq('id', categoryId);

    if (error) throw error;

    alert('Category updated successfully!');
  } catch (error) {
    console.error('Error updating category:', error);
    alert('Failed to update category. Please try again.');
  }
}

async function deleteCategory(categoryId) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;

    alert('Category deleted successfully!');
    loadCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category. Please try again.');
  }
}

// Create a new project
async function createProject(formData) {
  try {
    // Remove the live_url property if it's causing problems
    const { live_url, ...safeFormData } = formData;

    const { data, error } = await supabase
      .from('projects')
      .insert([safeFormData])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
async function updateProject(projectId, formData) {
  try {
    // Remove the live_url property if it's causing problems
    const { live_url, ...safeFormData } = formData;

    const { data, error } = await supabase
      .from('projects')
      .update(safeFormData)
      .eq('id', projectId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
async function deleteProject(projectId) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    // Reload the projects list
    loadProjects();
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Failed to delete project. Please try again.');
  }
}

// Add function to ensure storage buckets exist
// Function to ensure a bucket exists
async function ensureBucketExists(bucketName) {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);

    // Check if the storage API has the right methods
    if (!supabase || !supabase.storage) {
      console.error('Supabase storage API not available');
      throw new Error('Supabase storage API not available. Check your connection.');
    }

    // Get list of all buckets first to check API compatibility
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      // Output more detailed error info
      console.error('Error details:', JSON.stringify(listError));

      // Check if it's a permissions issue
      if (listError.message && listError.message.includes('permission')) {
        throw new Error('Storage permission denied. Please check your Supabase policies and API key permissions.');
      }

      throw new Error(`Failed to list storage buckets: ${listError.message || 'Unknown error'}`);
    }

    console.log('Available buckets:', buckets?.map(b => b.name).join(', ') || 'none');

    // Check if our bucket exists in the list
    const bucketExists = buckets && buckets.some(b => b.name === bucketName);

    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }

    // Bucket doesn't exist, create it
    console.log(`Bucket ${bucketName} does not exist, creating it...`);
    const { data: createData, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true, // Allow public access to files
      fileSizeLimit: 5242880 // 5MB limit
    });

    if (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError);
      console.error('Error details:', JSON.stringify(createError));

      if (createError.message && createError.message.includes('permission')) {
        throw new Error('Storage permission denied. Unable to create bucket. Please check your Supabase policies and API key permissions.');
      }

      throw new Error(`Failed to create bucket: ${createError.message || 'Unknown error'}`);
    }

    console.log(`Bucket ${bucketName} created successfully`);

    // Update bucket public policy
    console.log(`Setting public access policy for ${bucketName}...`);
    try {
      const { data: policyData, error: policyError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880
      });

      if (policyError) {
        console.error(`Error setting bucket policy for ${bucketName}:`, policyError);
        console.error('Policy error details:', JSON.stringify(policyError));
      } else {
        console.log(`Public access policy set for ${bucketName}`);
      }
    } catch (policyError) {
      console.error('Error updating bucket policy:', policyError);
      // Continue anyway as this is not critical
    }

    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    // Throw the error to be handled by the calling function
    throw error;
  }
}

// Function to optimize and upload an image to Supabase Storage
async function optimizeAndUploadImage(file, bucketName = 'blog-images') {
  try {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      throw new Error('Please select an image file (jpg, png, etc.)');
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    console.log(`Preparing to upload ${file.name} (${Math.round(file.size / 1024)} KB) to ${bucketName}`);

    // Check if supabase client is available
    if (!supabase || !supabase.storage) {
      console.error('Supabase client not properly initialized');
      throw new Error('Unable to connect to storage service. Please check your connection.');
    }

    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    console.log(`Uploading file: ${fileName} to bucket: ${bucketName}`);

    // Skip bucket creation step - we know buckets already exist
    // Directly upload the file to the existing bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      console.error('Error details:', JSON.stringify(error));

      // Check for specific error types
      if (error.message && error.message.includes('security policy')) {
        throw new Error(`Storage permission denied. Please check RLS policies to ensure uploads are allowed.`);
      } else if (error.message && error.message.includes('not found')) {
        throw new Error(`Bucket "${bucketName}" not found. Please check that it exists in your Supabase project.`);
      }

      throw new Error(`Failed to upload file: ${error.message || 'Unknown error'}`);
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    const imageUrl = publicUrlData.publicUrl;
    console.log('Upload completed successfully, URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Show project form for creating or editing a project
async function showProjectForm(projectId = null) {
  // Check if we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to show project form outside of admin page');
    return;
  }

  let project = {
    title: '',
    slug: '',
    description: '',
    full_description: '',
    category: '',
    image_url: '',
    technologies: [],
    featured: false,
    github_url: '',
    demo_url: '',
    launch_date: '',
    gallery: [],
    features: []
  };
  let categories = [];

  try {
    // If editing, get the project data
    if (projectId) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      project = data;

      // Ensure technologies is an array
      if (project.technologies && typeof project.technologies === 'string') {
        try {
          project.technologies = JSON.parse(project.technologies);
        } catch (e) {
          project.technologies = project.technologies.split(',').map(t => t.trim());
        }
      }
    }

    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;
    categories = categoriesData || [];

    // Remove any existing modal overlays
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'admin-project-form-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h2>${projectId ? 'Edit' : 'New'} Project</h2>
        <form id="admin-project-form" class="admin-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="project-title" name="title" value="${project.title}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="project-slug" name="slug" value="${project.slug}" required>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <div class="category-input-group">
              <select id="project-category" name="category">
                <option value="">-- Select Category --</option>
                ${categories.map(category => `
                  <option value="${category.name}" ${project.category === category.name ? 'selected' : ''}>
                    ${category.name}
                  </option>
                `).join('')}
              </select>
              <button type="button" class="add-category-btn">+ New Category</button>
            </div>
          </div>
          <div class="form-group">
            <label for="featured">Featured Project</label>
            <input type="checkbox" id="project-featured" name="featured" ${project.featured ? 'checked' : ''}>
          </div>
          <div class="form-group">
            <label for="launch_date">Launch Date</label>
            <input type="date" id="project-launch-date" name="launch_date" value="${project.launch_date ? project.launch_date.split('T')[0] : ''}">
          </div>
          <div class="form-group">
            <label for="image">Featured Image</label>
            <div class="image-upload-container">
              <input type="file" id="project-image-file" name="image_file" accept="image/*">
              <input type="hidden" id="project-image-url" name="image_url" value="${project.image_url || ''}">
              ${project.image_url ? `
                <div class="image-preview-container">
                  <img src="${project.image_url}" alt="Preview" class="image-preview">
                  <button type="button" class="remove-image-btn">Remove</button>
                </div>
              ` : `<div class="image-preview-container" style="display: none;">
                    <img src="" alt="Preview" class="image-preview">
                    <button type="button" class="remove-image-btn">Remove</button>
                  </div>`}
              <div class="image-upload-progress" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text">Uploading: 0%</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="gallery">Gallery Images</label>
            <div class="gallery-upload-container">
              <input type="file" id="project-gallery-files" name="gallery_files" accept="image/*" multiple>
              <div class="gallery-preview-container">
                ${project.gallery && Array.isArray(project.gallery) ? project.gallery.map((url, index) => `
                  <div class="gallery-preview-item">
                    <img src="${url}" alt="Gallery preview ${index + 1}" class="gallery-preview">
                    <button type="button" class="remove-gallery-btn" data-index="${index}">Remove</button>
                  </div>
                `).join('') : ''}
              </div>
              <input type="hidden" id="project-gallery-urls" name="gallery_urls" value="${project.gallery && Array.isArray(project.gallery) ? JSON.stringify(project.gallery) : '[]'}">
              <div class="gallery-upload-progress" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text">Uploading: 0%</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="description">Short Description</label>
            <textarea id="project-description" name="description" rows="2">${project.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="full_description">Full Description</label>
            <textarea id="project-full-description" name="full_description" rows="6">${project.full_description || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="features">Key Features (one per line)</label>
            <textarea id="project-features" name="features" rows="4">${project.features && Array.isArray(project.features) ? project.features.join('\n') : ''}</textarea>
          </div>
          <div class="form-group">
            <label for="technologies">Technologies (comma separated)</label>
            <input type="text" id="project-technologies" name="technologies" value="${project.technologies ? (Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies) : ''}">
          </div>
          <div class="form-group">
            <label for="github_url">GitHub URL</label>
            <input type="url" id="project-github-url" name="github_url" value="${project.github_url || ''}">
          </div>
          <div class="form-group">
            <label for="demo_url">Live URL</label>
            <input type="url" id="project-demo-url" name="demo_url" value="${project.demo_url || ''}">
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Set up image preview and upload functionality
    const imageFileInput = overlay.querySelector('#project-image-file');
    const imageUrlInput = overlay.querySelector('#project-image-url');
    const imagePreviewContainer = overlay.querySelector('.image-preview-container');
    const imagePreview = overlay.querySelector('.image-preview');
    const removeImageBtn = overlay.querySelector('.remove-image-btn');
    const uploadProgressContainer = overlay.querySelector('.image-upload-progress');
    const progressBar = overlay.querySelector('.progress-bar');
    const progressText = overlay.querySelector('.progress-text');

    // Preview selected image before upload
    imageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        let progressInterval;

        try {
          // Show upload progress
          uploadProgressContainer.style.display = 'block';
          progressBar.style.width = '0%';
          progressText.textContent = 'Preparing image...';

          // Start with a fast progress up to 20% to show system is working
          progressBar.style.width = '20%';

          // Create a variable to track if upload has completed
          let uploadComplete = false;

          // Use a smarter progress simulation
          progressInterval = setInterval(() => {
            // Don't update once complete
            if (uploadComplete) return;

            // Get current width percentage
            const currentWidth = parseInt(progressBar.style.width) || 20;

            // Apply different increment rates based on progress
            // Move faster at beginning, slower as we approach 95%
            let increment = 10;
            if (currentWidth < 50) increment = 10;
            else if (currentWidth < 70) increment = 5;
            else if (currentWidth < 85) increment = 3;
            else if (currentWidth < 95) increment = 1;
            else increment = 0; // Stop at 95%

            // Calculate new width (max 95%)
            const newWidth = Math.min(95, currentWidth + increment);

            // Apply new width if we haven't reached 95%
            if (newWidth <= 95) {
              progressBar.style.width = `${newWidth}%`;
              progressText.textContent = `Uploading: ${newWidth}%`;
            }
          }, 300);

          // Upload and optimize image
          console.log('Starting image optimization and upload...');
          const imageUrl = await optimizeAndUploadImage(file);
          console.log('Upload completed successfully, URL:', imageUrl);

          // Mark as complete to stop the interval
          uploadComplete = true;

          // Clear the progress interval
          clearInterval(progressInterval);
          progressInterval = null;

          // Show 100% completion
          progressBar.style.width = '100%';
          progressText.textContent = 'Upload complete!';

          // Hide progress after a moment
          setTimeout(() => {
            uploadProgressContainer.style.display = 'none';
          }, 1000);

          // Update preview and hidden input
          imageUrlInput.value = imageUrl;
          imagePreview.src = imageUrl;
          imagePreviewContainer.style.display = 'block';
        } catch (error) {
          console.error('Error uploading image:', error);

          // Clear the progress bar
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }

          // Show user-friendly error
          uploadProgressContainer.style.display = 'block';
          progressBar.style.width = '100%';
          progressBar.style.backgroundColor = '#f44336';

          let errorMessage = 'Unknown error uploading image';
          if (error.message) {
            errorMessage = error.message;
          }

          progressText.textContent = `Error: ${errorMessage}`;

          // Hide error after 8 seconds
          setTimeout(() => {
            uploadProgressContainer.style.display = 'none';
            progressBar.style.backgroundColor = '#4CAF50';
          }, 8000);
        }
      }
    });

    // Handle remove image button
    removeImageBtn.addEventListener('click', () => {
      imageFileInput.value = '';
      imageUrlInput.value = '';
      imagePreviewContainer.style.display = 'none';
    });

    // Set up gallery image upload functionality
    const galleryFilesInput = overlay.querySelector('#project-gallery-files');
    const galleryUrlsInput = overlay.querySelector('#project-gallery-urls');
    const galleryPreviewContainer = overlay.querySelector('.gallery-preview-container');
    const galleryUploadProgressContainer = overlay.querySelector('.gallery-upload-progress');
    const galleryProgressBar = galleryUploadProgressContainer.querySelector('.progress-bar');
    const galleryProgressText = galleryUploadProgressContainer.querySelector('.progress-text');

    // Initialize gallery array from project data
    let currentGallery = [];
    try {
      currentGallery = project.gallery || [];
      if (!Array.isArray(currentGallery)) {
        currentGallery = typeof project.gallery === 'string' ? JSON.parse(project.gallery) : [];
      }
    } catch (error) {
      console.error('Error parsing initial gallery data:', error);
      currentGallery = [];
    }

    // Update gallery URLs input with initial data
    galleryUrlsInput.value = JSON.stringify(currentGallery);

    // Display existing gallery images
    const displayGalleryImages = (images) => {
      galleryPreviewContainer.innerHTML = ''; // Clear existing previews
      images.forEach((url, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'gallery-preview-item';
        previewItem.innerHTML = `
          <img src="${url}" alt="Gallery preview ${index + 1}" class="gallery-preview">
          <button type="button" class="remove-gallery-btn" data-index="${index}">Remove</button>
        `;
        galleryPreviewContainer.appendChild(previewItem);
      });
    };

    // Display initial gallery images
    displayGalleryImages(currentGallery);

    // Handle gallery image uploads
    galleryFilesInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        galleryUploadProgressContainer.style.display = 'block';
        galleryProgressBar.style.width = '0%';
        galleryProgressText.textContent = 'Preparing to upload images...';

        try {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            galleryProgressBar.style.width = `${(i / files.length) * 90}%`;
            galleryProgressText.textContent = `Uploading image ${i + 1} of ${files.length}...`;

            const imageUrl = await optimizeAndUploadImage(file);
            currentGallery.push(imageUrl);

            // Update display and hidden input after each successful upload
            displayGalleryImages(currentGallery);
            galleryUrlsInput.value = JSON.stringify(currentGallery);
          }

          galleryProgressBar.style.width = '100%';
          galleryProgressText.textContent = 'All images uploaded successfully!';
        } catch (error) {
          console.error('Error uploading gallery images:', error);
          galleryProgressBar.style.backgroundColor = '#f44336';
          galleryProgressText.textContent = `Error: ${error.message}`;
        }

        // Reset file input
        galleryFilesInput.value = '';

        // Hide progress after all uploads
        setTimeout(() => {
          galleryUploadProgressContainer.style.display = 'none';
          galleryProgressBar.style.backgroundColor = '#4CAF50';
          galleryProgressBar.style.width = '0%';
        }, 2000);
      }
    });

    // Handle remove gallery image buttons
    galleryPreviewContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-gallery-btn')) {
        const index = parseInt(e.target.dataset.index);
        currentGallery.splice(index, 1);
        galleryUrlsInput.value = JSON.stringify(currentGallery);
        displayGalleryImages(currentGallery);
      }
    });

    // Add event listener for new category button
    const addCategoryBtn = overlay.querySelector('.add-category-btn');
    addCategoryBtn.addEventListener('click', async () => {
      const categoryName = prompt('Enter new category name:');
      if (categoryName) {
        try {
          // Create slug from category name
          const categorySlug = categoryName
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');

          // Add category to database
          const { data, error } = await supabase
            .from('categories')
            .insert([{
              name: categoryName,
              slug: categorySlug
            }])
            .select()
            .single();

          if (error) throw error;

          // Add new option to select
          const select = overlay.querySelector('#project-category');
          const option = document.createElement('option');
          option.value = data.name;
          option.textContent = data.name;
          option.selected = true;
          select.appendChild(option);

          alert('Category created successfully!');
        } catch (error) {
          console.error('Error creating category:', error);
          alert('Failed to create category: ' + (error.message || 'Unknown error'));
        }
      }
    });

    // Handle form submission
    const form = overlay.querySelector('#admin-project-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Process technologies input to create an array
      const technologiesInput = form.querySelector('[name="technologies"]').value;
      const technologiesArray = technologiesInput ?
        technologiesInput.split(',').map(tech => tech.trim()) : [];

      // Process features input to create an array
      const featuresInput = form.querySelector('[name="features"]').value;
      const featuresArray = featuresInput ?
        featuresInput.split('\n').filter(feature => feature.trim() !== '') : [];

      const formData = {
        title: form.querySelector('[name="title"]').value,
        slug: form.querySelector('[name="slug"]').value,
        category: form.querySelector('[name="category"]').value || null,
        featured: form.querySelector('[name="featured"]').checked,
        launch_date: form.querySelector('[name="launch_date"]').value || null,
        description: form.querySelector('[name="description"]').value,
        full_description: form.querySelector('[name="full_description"]').value,
        technologies: technologiesArray,
        features: featuresArray,
        gallery: JSON.parse(form.querySelector('[name="gallery_urls"]').value),
        github_url: form.querySelector('[name="github_url"]').value || null,
        image_url: form.querySelector('[name="image_url"]').value || null,
        demo_url: form.querySelector('[name="demo_url"]').value || null
      };

      try {
        if (projectId) {
          await updateProject(projectId, formData);
          alert('Project updated successfully!');
        } else {
          await createProject(formData);
          alert('Project created successfully!');
        }

        // Remove the modal
        document.body.removeChild(overlay);
        // Reload projects
        loadProjects();
      } catch (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project: ' + (error.message || 'Unknown error'));
      }
    });

    // Handle cancel button
    overlay.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Auto-generate slug from title for new projects
    const titleInput = overlay.querySelector('#project-title');
    const slugInput = overlay.querySelector('#project-slug');

    titleInput.addEventListener('input', () => {
      if (!projectId) { // Only auto-generate for new projects
        slugInput.value = titleInput.value
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }
    });

  } catch (error) {
    console.error('Error showing project form:', error);
    alert('Failed to load form data. Please try again.');
  }
}

// Show category form for creating or editing a category
async function showCategoryForm(categoryId = null) {
  // Check if we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to show category form outside of admin page');
    return;
  }

  let category = { name: '', slug: '' };

  try {
    // If editing, get the category data
    if (categoryId) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      category = data;
    }

    // Remove any existing modal overlays
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'admin-category-form-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h2>${categoryId ? 'Edit' : 'New'} Category</h2>
        <form id="admin-category-form" class="admin-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="category-name" name="name" value="${category.name}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="category-slug" name="slug" value="${category.slug}" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Handle form submission
    const form = overlay.querySelector('#admin-category-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form.querySelector('[name="name"]').value,
        slug: form.querySelector('[name="slug"]').value
      };

      try {
        if (categoryId) {
          await updateCategory(categoryId, formData);
        } else {
          await createCategory(formData);
        }

        // Remove the modal
        document.body.removeChild(overlay);
        // Reload categories
        loadCategories();
      } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category: ' + (error.message || 'Unknown error'));
      }
    });

    // Handle cancel button
    overlay.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Auto-generate slug from name for new categories
    const nameInput = overlay.querySelector('#category-name');
    const slugInput = overlay.querySelector('#category-slug');

    nameInput.addEventListener('input', () => {
      if (!categoryId) { // Only auto-generate for new categories
        slugInput.value = nameInput.value
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }
    });

  } catch (error) {
    console.error('Error showing category form:', error);
    alert('Failed to load form data. Please try again.');
  }
}

// Show page form for creating or editing a page
async function showPageForm(pageId = null) {
  // Check if we're on the admin page
  if (!window.location.pathname.includes('/admin')) {
    console.error('Attempted to show page form outside of admin page');
    return;
  }

  let page = { title: '', slug: '', content: '' };

  try {
    // If editing, get the page data
    if (pageId) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;
      page = data;
    }

    // Remove any existing modal overlays
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'admin-page-form-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h2>${pageId ? 'Edit' : 'New'} Page</h2>
        <form id="admin-page-form" class="admin-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="page-title" name="title" value="${page.title}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="page-slug" name="slug" value="${page.slug}" required>
          </div>
          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="page-content" name="content" rows="10" required>${page.content || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Handle form submission
    const form = overlay.querySelector('#admin-page-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        title: form.querySelector('[name="title"]').value,
        slug: form.querySelector('[name="slug"]').value,
        content: form.querySelector('[name="content"]').value
      };

      try {
        if (pageId) {
          await updatePage(pageId, formData);
        } else {
          await createPage(formData);
        }

        // Remove the modal
        document.body.removeChild(overlay);
        // Reload pages
        loadPages();
      } catch (error) {
        console.error('Error saving page:', error);
        alert('Failed to save page: ' + (error.message || 'Unknown error'));
      }
    });

    // Handle cancel button
    overlay.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Auto-generate slug from title for new pages
    const titleInput = overlay.querySelector('#page-title');
    const slugInput = overlay.querySelector('#page-slug');

    titleInput.addEventListener('input', () => {
      if (!pageId) { // Only auto-generate for new pages
        slugInput.value = titleInput.value
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }
    });

  } catch (error) {
    console.error('Error showing page form:', error);
    alert('Failed to load form data. Please try again.');
  }
}
