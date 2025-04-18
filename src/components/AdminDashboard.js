import { supabase } from '../main.js';

// Create the admin dashboard UI
export function renderAdminDashboard() {
    const dashboard = document.createElement('div');
    dashboard.className = 'admin-panel';
    dashboard.innerHTML = `
    <h1>Admin Dashboard</h1>
    <nav class="admin-nav">
      <a href="#posts" class="admin-nav-link active" data-section="posts">Blog Posts</a>
      <a href="#pages" class="admin-nav-link" data-section="pages">Pages</a>
      <a href="#categories" class="admin-nav-link" data-section="categories">Categories</a>
    </nav>
    <div id="admin-content">
      <div id="posts-panel" class="admin-panel-content active">
        <h2>Blog Posts</h2>
        <button id="new-post-btn" class="action-btn">New Post</button>
        <div id="posts-list">Loading posts...</div>
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

    // Add event listeners for navigation
    const navLinks = dashboard.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show the corresponding panel
            const section = link.dataset.section;
            const panels = dashboard.querySelectorAll('.admin-panel-content');
            panels.forEach(panel => panel.classList.remove('active'));
            dashboard.querySelector(`#${section}-panel`).classList.add('active');

            // Load content for the section
            switch (section) {
                case 'posts':
                    loadPosts();
                    break;
                case 'pages':
                    loadPages();
                    break;
                case 'categories':
                    loadCategories();
                    break;
            }
        });
    });

    // Add event listeners for action buttons
    dashboard.querySelector('#new-post-btn').addEventListener('click', () => {
        showPostForm();
    });

    dashboard.querySelector('#new-page-btn').addEventListener('click', () => {
        showPageForm();
    });

    dashboard.querySelector('#new-category-btn').addEventListener('click', () => {
        showCategoryForm();
    });

    // Load initial data
    loadPosts();

    return dashboard;
}

// Load blog posts for the admin panel
async function loadPosts() {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, categories(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const postsList = document.getElementById('posts-list');

        if (!data || data.length === 0) {
            postsList.innerHTML = '<p>No posts available yet.</p>';
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
              <td>${post.title}</td>
              <td>${post.categories ? post.categories.name : 'None'}</td>
              <td>${new Date(post.created_at).toLocaleDateString()}</td>
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
        document.querySelectorAll('.edit-post-btn').forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.dataset.id;
                showPostForm(postId);
            });
        });

        document.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const postId = button.dataset.id;
                if (confirm('Are you sure you want to delete this post?')) {
                    await deletePost(postId);
                }
            });
        });

    } catch (error) {
        console.error('Error loading posts:', error);
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
}

// Load pages for the admin panel
async function loadPages() {
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
        document.querySelectorAll('.edit-page-btn').forEach(button => {
            button.addEventListener('click', () => {
                const pageId = button.dataset.id;
                showPageForm(pageId);
            });
        });

        document.querySelectorAll('.delete-page-btn').forEach(button => {
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
        document.querySelectorAll('.edit-category-btn').forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.dataset.id;
                showCategoryForm(categoryId);
            });
        });

        document.querySelectorAll('.delete-category-btn').forEach(button => {
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
    let post = { title: '', slug: '', body: '', excerpt: '', category_id: '' };
    let categories = [];

    try {
        // Get categories for the dropdown
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (categoryError) throw categoryError;
        categories = categoryData || [];

        // If editing, get the post data
        if (postId) {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;
            post = data;
        }

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <h2>${postId ? 'Edit' : 'New'} Blog Post</h2>
        <form id="post-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" value="${post.title}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="slug" value="${post.slug}" required>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category">
              <option value="">-- Select Category --</option>
              ${categories.map(cat => `
                <option value="${cat.id}" ${post.category_id === cat.id ? 'selected' : ''}>${cat.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="excerpt">Excerpt</label>
            <textarea id="excerpt" rows="2">${post.excerpt || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="body">Content</label>
            <textarea id="body" rows="10" required>${post.body || ''}</textarea>
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
        const form = overlay.querySelector('#post-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                title: form.querySelector('#title').value,
                slug: form.querySelector('#slug').value,
                category_id: form.querySelector('#category').value || null,
                excerpt: form.querySelector('#excerpt').value,
                body: form.querySelector('#body').value
            };

            if (postId) {
                await updatePost(postId, formData);
            } else {
                await createPost(formData);
            }

            // Remove the modal
            document.body.removeChild(overlay);
            // Reload posts
            loadPosts();
        });

        // Handle cancel button
        overlay.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Auto-generate slug from title
        const titleInput = overlay.querySelector('#title');
        const slugInput = overlay.querySelector('#slug');

        titleInput.addEventListener('input', () => {
            if (!postId) { // Only auto-generate for new posts
                slugInput.value = titleInput.value
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, '-');
            }
        });

    } catch (error) {
        console.error('Error showing post form:', error);
        alert('Failed to load form data. Please try again.');
    }
}

// Show page form for creating or editing a page
async function showPageForm(pageId = null) {
    let page = { title: '', slug: '', body: '', meta_title: '', meta_description: '' };

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

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <h2>${pageId ? 'Edit' : 'New'} Page</h2>
        <form id="page-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" value="${page.title}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="slug" value="${page.slug}" required>
          </div>
          <div class="form-group">
            <label for="meta_title">Meta Title (SEO)</label>
            <input type="text" id="meta_title" value="${page.meta_title || ''}">
          </div>
          <div class="form-group">
            <label for="meta_description">Meta Description (SEO)</label>
            <textarea id="meta_description" rows="2">${page.meta_description || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="body">Content</label>
            <textarea id="body" rows="10" required>${page.body || ''}</textarea>
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
        const form = overlay.querySelector('#page-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                title: form.querySelector('#title').value,
                slug: form.querySelector('#slug').value,
                meta_title: form.querySelector('#meta_title').value,
                meta_description: form.querySelector('#meta_description').value,
                body: form.querySelector('#body').value
            };

            if (pageId) {
                await updatePage(pageId, formData);
            } else {
                await createPage(formData);
            }

            // Remove the modal
            document.body.removeChild(overlay);
            // Reload pages
            loadPages();
        });

        // Handle cancel button
        overlay.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Auto-generate slug from title
        const titleInput = overlay.querySelector('#title');
        const slugInput = overlay.querySelector('#slug');

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

// Show category form for creating or editing a category
async function showCategoryForm(categoryId = null) {
    let category = { name: '', slug: '', description: '' };

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

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <h2>${categoryId ? 'Edit' : 'New'} Category</h2>
        <form id="category-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" value="${category.name}" required>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="slug" value="${category.slug}" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" rows="4">${category.description || ''}</textarea>
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
        const form = overlay.querySelector('#category-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: form.querySelector('#name').value,
                slug: form.querySelector('#slug').value,
                description: form.querySelector('#description').value
            };

            if (categoryId) {
                await updateCategory(categoryId, formData);
            } else {
                await createCategory(formData);
            }

            // Remove the modal
            document.body.removeChild(overlay);
            // Reload categories
            loadCategories();
        });

        // Handle cancel button
        overlay.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Auto-generate slug from name
        const nameInput = overlay.querySelector('#name');
        const slugInput = overlay.querySelector('#slug');

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

// CRUD operations for posts
async function createPost(formData) {
    try {
        const { error } = await supabase
            .from('posts')
            .insert([{ ...formData, created_at: new Date(), updated_at: new Date() }]);

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
            .from('posts')
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
            .from('posts')
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