import { supabase } from '../main.js'
import { renderNav } from '../components/Nav.js'

// Update the EDITOR_STYLES first
const EDITOR_STYLES = `<style>
  .medium-style-editor {
    max-width: 740px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  
  .medium-style-editor .title-input {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 32px;
    font-weight: 700;
    border: none;
    outline: none;
    width: 100%;
    margin-bottom: 24px;
    padding: 0;
  }
  
  .medium-style-editor .title-input::placeholder {
    color: #999;
  }
  
  .medium-style-editor .metadata {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    font-size: 14px;
    color: #757575;
  }
  
  .medium-style-editor .metadata select,
  .medium-style-editor .metadata input {
    font-size: 14px;
    color: #757575;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 4px 8px;
  }

  .editor-container {
    position: relative;
    min-height: 400px;
    margin-bottom: 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 2rem;
  }

  .editor-content {
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    outline: none;
    padding: 0;
    margin: 0;
  }

  /* Block container styles */
  .block-container {
    position: relative;
    margin: 0;
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
  }

  .block-container.is-active {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
  }

  /* Plus button styles */
  .plus-menu {
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plus-button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: #e0e0e0;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    opacity: 1;
    transition: background-color 0.2s ease, transform 0.2s ease;
    user-select: none;
    pointer-events: auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .block-container:hover .plus-button {
    transform: scale(1.1);
    background: #d0d0d0;
  }

  .plus-button:hover {
    background: #d0d0d0;
    transform: scale(1.1);
  }

  /* Popup menu styles */
  .plus-popup {
    position: absolute;
    left: 30px;
    top: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 1000;
    min-width: 160px;
    transform: translateY(-50%);
  }

  /* Content element styles */
  .editable-block {
    width: 100%;
    outline: none;
    padding: 0;
    margin: 0;
    line-height: 1.6;
    min-height: 24px;
  }
  
  .editable-block h1, 
  .editable-block h2 {
    font-weight: 700;
    margin: 0;
    padding: 0;
    line-height: 1.2;
  }
  
  .editable-block h1 {
    font-size: 28px;
  }
  
  .editable-block h2 {
    font-size: 24px;
  }
  
  .editable-block p {
    margin: 0;
    padding: 0;
  }
  
  .editable-block img {
    max-width: 100%;
    height: auto;
    margin: 0;
  }
  
  .editable-block:empty::before {
    content: 'Type something...';
    color: #999;
  }
  
  .editable-block blockquote {
    border-left: 3px solid #292929;
    margin: 0;
    padding-left: 20px;
    font-style: italic;
    color: #666;
  }
  
  .editable-block pre {
    background: #f6f8fa;
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
  
  .editable-block code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 14px;
    background: #f6f8fa;
    padding: 2px 4px;
    border-radius: 3px;
  }
</style>`

// Add styles to the head
const style = document.createElement('style');
style.textContent = `
    #blog-content {
        min-height: 500px;
        padding: 40px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Block container styles */
    .block-container {
        position: relative;
        margin: 0;
        padding: 0.3rem 0;
        display: flex;
        align-items: center;
    }

    .block-container.is-active {
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
    }

    /* Plus button styles */
    .plus-menu {
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .plus-button {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: #e0e0e0;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        line-height: 1;
        opacity: 1;
        transition: background-color 0.2s ease, transform 0.2s ease;
        user-select: none;
        pointer-events: auto;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .block-container:hover .plus-button {
        transform: scale(1.1);
        background: #d0d0d0;
    }

    .block-container.is-active .plus-button {
        background: #d0d0d0;
    }

    .plus-button:hover {
        background: #d0d0d0;
        transform: scale(1.1);
    }

    /* Popup menu styles */
    .plus-popup {
        position: absolute;
        left: 30px;
        top: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        padding: 8px 0;
        z-index: 1000;
        min-width: 160px;
        transform: translateY(-50%);
    }

    .plus-popup button {
        display: block;
        width: 100%;
        padding: 8px 16px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        transition: background-color 0.2s ease;
    }

    .plus-popup button:hover {
        background-color: #f5f5f5;
    }

    /* Content element styles */
    .editable-block {
        width: 100%;
        outline: none;
        padding: 0;
        margin: 0;
        line-height: 1.6;
        min-height: 24px;
    }

    .editable-block:empty::before {
        content: 'Type something...';
        color: #999;
    }

    .editable-block img {
        max-width: 100%;
        height: auto;
        margin: 0;
    }

    .editable-block h1 {
        font-size: 2em;
        margin: 0;
        padding: 0;
        font-weight: bold;
        line-height: 1.2;
    }

    .editable-block h2 {
        font-size: 1.5em;
        margin: 0;
        padding: 0;
        font-weight: bold;
        line-height: 1.2;
    }

    .editable-block p {
        margin: 0;
        padding: 0;
    }

    .editable-block blockquote {
        border-left: 4px solid #e0e0e0;
        margin: 0;
        padding: 0 0 0 1rem;
        color: #666;
        background: rgba(0,0,0,0.02);
    }

    .editable-block pre {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        font-family: monospace;
        overflow-x: auto;
        margin: 0;
    }
`;
document.head.appendChild(style);

// Render login form
function renderLoginForm() {
    return `
    ${renderNav()}
    <div class="admin-login">
      <h2>Admin Login</h2>
      <form id="login-form" class="admin-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="admin-button">Login</button>
      </form>
    </div>
  `
}

// Render admin dashboard
function renderDashboard(user) {
    return `
    ${renderNav()}
    <style>
        .category-select-container {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .category-select-container select {
            flex: 1;
        }
        
        .delete-category {
            min-width: 70px;
        }
    </style>
    <div class="admin-dashboard">
      <div class="admin-header">
        <h2>Admin Dashboard</h2>
        <button id="logout-button" class="admin-button">Logout</button>
      </div>
      
      <div class="admin-tabs">
        <button class="tab-button active" data-tab="projects">Projects</button>
        <button class="tab-button" data-tab="blog">Blog Posts</button>
      </div>

      <div class="tab-content active" id="projects-content">
        <div class="content-header">
          <h3>Projects</h3>
          <button id="new-project-button" class="admin-button">New Project</button>
        </div>
        <div id="projects-list" class="admin-list">
          Loading projects...
        </div>
      </div>

      <div class="tab-content" id="blog-content">
        <div class="content-header">
          <h3>Blog Posts</h3>
          <button id="new-post-button" class="admin-button">New Post</button>
        </div>
        <div id="posts-list" class="admin-list">
          Loading posts...
        </div>
      </div>
    </div>
  `
}

// Fetch categories from Supabase
async function fetchCategories() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return categories || []
}

// Create a new category
async function createCategory(name) {
    const slug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

    const { data, error } = await supabase
        .from('categories')
        .insert([{
            name,
            slug,
            description: '' // Optional field in our schema
        }])
        .select()
        .single()

    if (error) {
        console.error('Error creating category:', error)
        throw error
    }

    return data
}

// Add deleteCategory function after createCategory
async function deleteCategory(categoryName) {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryName)

    if (error) {
        console.error('Error deleting category:', error)
        throw error
    }
}

// Render project form
function renderProjectForm(project = null) {
    const isEditing = !!project

    return `
    <form id="project-form" class="admin-form">
      <h3>${isEditing ? 'Edit Project' : 'New Project'}</h3>
      
      <input type="hidden" name="id" value="${project?.id || ''}">
      
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${project?.title || ''}" required>
      </div>

      <div class="form-group">
        <label for="slug">Slug</label>
        <div class="slug-container">
          <input type="text" id="slug" name="slug" value="${project?.slug || ''}" required>
          <button type="button" class="admin-button small regenerate-slug" title="Regenerate from title">↻</button>
        </div>
        <small class="form-help">Auto-generated from title, but can be manually edited</small>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="4" required>${project?.description || ''}</textarea>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <div class="category-container">
            <div class="category-select-container">
                <select id="category" name="category" required>
                    <option value="">Select a category</option>
                    <option value="new">+ Create new category</option>
                </select>
                <button type="button" class="admin-button small danger delete-category" style="display: none;">Delete</button>
            </div>
            <div class="new-category-input" style="display: none;">
                <input type="text" id="new-category" placeholder="Enter new category name">
                <button type="button" class="admin-button small save-category">Add</button>
                <button type="button" class="admin-button small secondary cancel-category">Cancel</button>
            </div>
        </div>
      </div>

      <div class="form-group">
        <label>Project Images</label>
        <div class="image-upload-container">
          <div class="current-images" id="current-images">
            ${project?.image_url ? `
              <div class="image-preview">
                <img src="${project.image_url}" alt="Current project image">
                <button type="button" class="admin-button small danger delete-image" data-image-url="${project.image_url}">Delete</button>
              </div>
            ` : ''}
          </div>
          <div class="upload-area">
            <input type="file" id="image_upload" name="image_upload" accept="image/*" class="image-input">
            <div class="upload-placeholder">
              <span>Drop image here or click to upload</span>
            </div>
          </div>
          <div id="upload-preview" class="upload-preview"></div>
        </div>
      </div>

      <div class="form-buttons">
        <button type="button" class="admin-button secondary" onclick="window.history.back()">Cancel</button>
        <button type="submit" class="admin-button">${isEditing ? 'Update' : 'Create'} Project</button>
      </div>
    </form>
  `
}

// Render blog post form
function renderBlogPostForm(post = null) {
    const isEditing = !!post
    return `
    ${EDITOR_STYLES}
    <div class="medium-style-editor">
      <form id="blog-form" class="admin-form">
        <input type="hidden" name="id" value="${post?.id || ''}">
        
        <input 
          type="text" 
          id="title" 
          name="title" 
          class="title-input" 
          value="${post?.title || ''}" 
          placeholder="Title"
          required
        >
        
        <div class="metadata">
          <div class="slug-container">
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              value="${post?.slug || ''}" 
              placeholder="url-slug"
              required
            >
          </div>
          
          <div class="category-container">
            <select id="category" name="category" required>
              <option value="">Select category</option>
              <option value="new">+ New category</option>
            </select>
          </div>
        </div>
        
        <div class="editor-container">
          <div id="editor" class="editor-content" contenteditable="true">${post?.content || '<p>Tell your story...</p>'}</div>
        </div>
        
        <div class="form-buttons" style="margin-top: 32px; text-align: right;">
          <button type="button" class="admin-button secondary" onclick="window.history.back()">Cancel</button>
          <button type="submit" class="admin-button">${isEditing ? 'Update' : 'Publish'}</button>
        </div>
      </form>
    </div>
  `
}

// Initialize admin page
export async function initAdmin(container) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        // Show login form
        container.innerHTML = renderLoginForm()
        setupLoginHandler()
    } else {
        // Show dashboard
        container.innerHTML = renderDashboard(session.user)
        await setupDashboard()
    }
}

// Setup login form handler
function setupLoginHandler() {
    const form = document.getElementById('login-form')
    if (!form) return

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = form.email.value
        const password = form.password.value

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            window.location.reload()
        } catch (error) {
            console.error('Error logging in:', error)
            alert('Login failed. Please check your credentials.')
        }
    })
}

// Setup dashboard functionality
async function setupDashboard() {
    setupLogoutHandler()
    setupTabHandlers()
    await loadProjects()
    await loadBlogPosts()
    setupNewButtons()
}

// Setup logout handler
function setupLogoutHandler() {
    const logoutButton = document.getElementById('logout-button')
    if (!logoutButton) return

    logoutButton.addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.reload()
    })
}

// Setup tab handlers
function setupTabHandlers() {
    const tabs = document.querySelectorAll('.tab-button')
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')

            // Show corresponding content
            const contents = document.querySelectorAll('.tab-content')
            contents.forEach(content => content.classList.remove('active'))
            document.getElementById(`${tab.dataset.tab}-content`).classList.add('active')
        })
    })
}

// Load projects list
async function loadProjects() {
    const projectsList = document.getElementById('projects-list')
    if (!projectsList) return

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        projectsList.innerHTML = projects.map(project => `
      <div class="admin-list-item">
        <div class="item-content">
          <h4>${project.title}</h4>
          <p>${project.description ? project.description.substring(0, 100) + '...' : ''}</p>
        </div>
        <div class="item-actions">
          <button class="admin-button small edit-project" data-id="${project.id}">Edit</button>
          <button class="admin-button small danger delete-project" data-id="${project.id}">Delete</button>
        </div>
      </div>
    `).join('')

        // Add event listeners after rendering
        setupProjectButtons()
    } catch (error) {
        console.error('Error loading projects:', error)
        projectsList.innerHTML = '<div class="error">Error loading projects</div>'
    }
}

// Load blog posts list
async function loadBlogPosts() {
    const postsList = document.getElementById('posts-list')
    if (!postsList) return

    try {
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        postsList.innerHTML = posts.map(post => `
      <div class="admin-list-item">
        <div class="item-content">
          <h4>${post.title}</h4>
          <p>${post.excerpt || ''}</p>
        </div>
        <div class="item-actions">
          <button class="admin-button small edit-post" data-id="${post.id}">Edit</button>
          <button class="admin-button small danger delete-post" data-id="${post.id}">Delete</button>
        </div>
      </div>
    `).join('')

        // Add event listeners after rendering
        setupBlogButtons()
    } catch (error) {
        console.error('Error loading blog posts:', error)
        postsList.innerHTML = '<div class="error">Error loading blog posts</div>'
    }
}

// Setup new item buttons
function setupNewButtons() {
    const newProjectButton = document.getElementById('new-project-button')
    const newPostButton = document.getElementById('new-post-button')

    if (newProjectButton) {
        newProjectButton.addEventListener('click', () => {
            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderProjectForm()
            setupProjectForm()
        })
    }

    if (newPostButton) {
        newPostButton.addEventListener('click', () => {
            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderBlogPostForm()
            setupBlogPostForm()
        })
    }
}

// Setup project form handlers
function setupProjectForm() {
    const form = document.getElementById('project-form')
    if (!form) return

    // Setup slug generation
    const titleInput = form.querySelector('#title')
    const slugInput = form.querySelector('#slug')
    const regenerateButton = form.querySelector('.regenerate-slug')

    function generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim()                   // Remove leading/trailing spaces
    }

    // Auto-generate slug when typing in title
    titleInput.addEventListener('input', () => {
        if (!slugInput.dataset.manuallyEdited) {
            slugInput.value = generateSlug(titleInput.value)
        }
    })

    // Mark slug as manually edited when user types in it
    slugInput.addEventListener('input', () => {
        slugInput.dataset.manuallyEdited = 'true'
    })

    // Regenerate slug button
    regenerateButton.addEventListener('click', () => {
        slugInput.value = generateSlug(titleInput.value)
        slugInput.dataset.manuallyEdited = 'false'
    })

    // Setup image upload preview
    const imageInput = form.querySelector('#image_upload')
    const uploadPreview = form.querySelector('#upload-preview')
    const uploadArea = form.querySelector('.upload-area')

    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault()
        uploadArea.classList.add('dragover')
    })

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover')
    })

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault()
        uploadArea.classList.remove('dragover')
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files
            handleImagePreview(e.dataTransfer.files[0])
        }
    })

    // Handle file input change
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImagePreview(e.target.files[0])
        }
    })

    // Handle image preview
    function handleImagePreview(file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            uploadPreview.innerHTML = `
                <div class="image-preview">
                    <img src="${e.target.result}" alt="Upload preview">
                    <button type="button" class="admin-button small danger clear-upload">Clear</button>
                </div>
            `

            // Add clear button functionality
            uploadPreview.querySelector('.clear-upload').addEventListener('click', () => {
                uploadPreview.innerHTML = ''
                imageInput.value = ''
            })
        }
        reader.readAsDataURL(file)
    }

    // Handle image deletion
    document.querySelectorAll('.delete-image').forEach(button => {
        button.addEventListener('click', async () => {
            const imageUrl = button.dataset.imageUrl
            if (!confirm('Are you sure you want to delete this image?')) return

            try {
                // Extract file path from URL
                const filePath = imageUrl.split('/').pop()

                // Delete from storage
                const { error: storageError } = await supabase.storage
                    .from('project-images')
                    .remove([filePath])

                if (storageError) throw storageError

                // Update project to remove image URL
                const projectId = form.querySelector('input[name="id"]').value
                const { error: updateError } = await supabase
                    .from('projects')
                    .update({ image_url: null })
                    .eq('id', projectId)

                if (updateError) throw updateError

                // Remove image preview
                button.closest('.image-preview').remove()
            } catch (error) {
                console.error('Error deleting image:', error)
                alert('Error deleting image: ' + error.message)
            }
        })
    })

    // Setup category selection and creation
    const categorySelect = form.querySelector('#category')
    const categoryContainer = form.querySelector('.category-container')
    const newCategoryInput = form.querySelector('.new-category-input')
    const newCategoryField = form.querySelector('#new-category')
    const saveCategoryBtn = form.querySelector('.save-category')
    const cancelCategoryBtn = form.querySelector('.cancel-category')
    const deleteCategoryBtn = form.querySelector('.delete-category')

    // Load existing categories
    async function loadCategories() {
        const categories = await fetchCategories()
        const currentCategory = categorySelect.value

        // Clear existing options except first two
        while (categorySelect.options.length > 2) {
            categorySelect.remove(2)
        }

        // Add categories to select
        categories.forEach(category => {
            const option = new Option(category.name, category.name)
            categorySelect.add(option)
        })

        // Restore selected value if it exists
        if (currentCategory && currentCategory !== 'new') {
            categorySelect.value = currentCategory
        }
    }

    // Initial load of categories
    loadCategories()

    // Handle category selection change
    categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'new') {
            newCategoryInput.style.display = 'flex'
            deleteCategoryBtn.style.display = 'none'
            newCategoryField.focus()
        } else if (categorySelect.value === '') {
            newCategoryInput.style.display = 'none'
            deleteCategoryBtn.style.display = 'none'
        } else {
            newCategoryInput.style.display = 'none'
            deleteCategoryBtn.style.display = 'inline-block'
        }
    })

    // Handle category deletion
    deleteCategoryBtn.addEventListener('click', async () => {
        const categoryName = categorySelect.value
        if (!categoryName || !confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
            return
        }

        try {
            await deleteCategory(categoryName)
            await loadCategories()
            categorySelect.value = ''
            deleteCategoryBtn.style.display = 'none'
        } catch (error) {
            alert('Error deleting category: ' + error.message)
        }
    })

    // Handle new category creation
    saveCategoryBtn.addEventListener('click', async () => {
        const newCategoryName = newCategoryField.value.trim()
        if (!newCategoryName) return

        try {
            const category = await createCategory(newCategoryName)
            await loadCategories()
            categorySelect.value = category.name
            newCategoryInput.style.display = 'none'
            newCategoryField.value = ''
        } catch (error) {
            alert('Error creating category: ' + error.message)
        }
    })

    // Handle cancel new category
    cancelCategoryBtn.addEventListener('click', () => {
        newCategoryInput.style.display = 'none'
        categorySelect.value = ''
        newCategoryField.value = ''
    })

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const isEditing = data.id && data.id.trim() !== ''
        const imageFile = imageInput.files[0]

        try {
            let imageUrl = data.image_url

            // Handle image upload if there's a new image
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            // Prepare project data
            const projectData = {
                title: data.title,
                slug: data.slug,
                description: data.description,
                category: data.category === 'new' ? newCategoryField.value.trim() : data.category,
                image_url: imageUrl
            }

            // Remove empty values
            Object.keys(projectData).forEach(key => {
                if (projectData[key] === undefined || projectData[key] === '') {
                    delete projectData[key]
                }
            })

            let error;
            if (isEditing) {
                // Update existing project
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', data.id)
                error = updateError
            } else {
                // Create new project
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([projectData])
                error = insertError
            }

            if (error) throw error

            // Redirect back to admin dashboard
            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderDashboard()
            await setupDashboard()
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Error saving project: ' + error.message)
        }
    })
}

// Setup blog post form handlers
function setupBlogPostForm() {
    const form = document.getElementById('blog-form')
    if (!form) return

    const editor = document.getElementById('editor')

    // Load categories first
    const categorySelect = form.querySelector('#category')
    loadCategories(categorySelect)

    // Initialize the editor
    initializeEditor(editor)

    // Setup slug generation
    const titleInput = form.querySelector('#title')
    const slugInput = form.querySelector('#slug')
    const regenerateButton = form.querySelector('.regenerate-slug')

    function generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim()                   // Remove leading/trailing spaces
    }

    // Auto-generate slug when typing in title
    titleInput.addEventListener('input', () => {
        if (!slugInput.dataset.manuallyEdited) {
            slugInput.value = generateSlug(titleInput.value)
        }
    })

    // Mark slug as manually edited when user types in it
    slugInput.addEventListener('input', () => {
        slugInput.dataset.manuallyEdited = 'true'
    })

    // Regenerate slug button
    if (regenerateButton) {
        regenerateButton.addEventListener('click', () => {
            slugInput.value = generateSlug(titleInput.value)
            slugInput.dataset.manuallyEdited = 'false'
        })
    }

    // Setup category selection and creation
    const newCategoryInput = form.querySelector('.new-category-input')
    const newCategoryField = form.querySelector('#new-category')
    const saveCategoryBtn = form.querySelector('.save-category')
    const cancelCategoryBtn = form.querySelector('.cancel-category')
    const deleteCategoryBtn = form.querySelector('.delete-category')

    // Handle category selection change
    categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'new') {
            newCategoryInput.style.display = 'flex'
            deleteCategoryBtn.style.display = 'none'
            newCategoryField.focus()
        } else if (categorySelect.value === '') {
            newCategoryInput.style.display = 'none'
            deleteCategoryBtn.style.display = 'none'
        } else {
            newCategoryInput.style.display = 'none'
            deleteCategoryBtn.style.display = 'inline-block'
        }
    })

    // Handle category deletion
    if (deleteCategoryBtn) {
        deleteCategoryBtn.addEventListener('click', async () => {
            const categoryName = categorySelect.value
            if (!categoryName || !confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
                return
            }

            try {
                await deleteCategory(categoryName)
                await loadCategories(categorySelect)
                categorySelect.value = ''
                deleteCategoryBtn.style.display = 'none'
            } catch (error) {
                alert('Error deleting category: ' + error.message)
            }
        })
    }

    // Handle new category creation
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', async () => {
            const newCategoryName = newCategoryField.value.trim()
            if (!newCategoryName) return

            try {
                const category = await createCategory(newCategoryName)
                await loadCategories(categorySelect, category.name)
                categorySelect.value = category.name
                newCategoryInput.style.display = 'none'
                newCategoryField.value = ''
            } catch (error) {
                alert('Error creating category: ' + error.message)
            }
        })
    }

    // Handle cancel new category
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', () => {
            newCategoryInput.style.display = 'none'
            categorySelect.value = ''
            newCategoryField.value = ''
        })
    }

    // Prevent Enter key in category input from submitting form
    if (newCategoryField) {
        newCategoryField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                saveCategoryBtn.click()
            }
        })
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        try {
            // Get content from editor
            const content = editor.innerHTML

            // Generate an excerpt from the content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            const excerpt = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');

            // Prepare post data
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())
            const isEditing = data.id && data.id.trim() !== ''

            const postData = {
                title: data.title,
                slug: data.slug,
                category: data.category === 'new' ? newCategoryField.value.trim() : data.category,
                content: content,
                excerpt: excerpt
            }

            // Remove empty values
            Object.keys(postData).forEach(key => {
                if (postData[key] === undefined || postData[key] === '') {
                    delete postData[key]
                }
            })

            let error
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', data.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert([postData])
                error = insertError
            }

            if (error) throw error

            // Redirect back to admin dashboard
            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderDashboard()
            await setupDashboard()
        } catch (error) {
            console.error('Error saving blog post:', error)
            alert('Error saving blog post: ' + error.message)
        }
    })
}

// Helper function to check if cursor is at start of block
function isAtStart(range) {
    if (!range.collapsed) return false;

    // Find the parent block element
    let node = range.startContainer;
    let blockElement = null;

    // Traverse up the DOM tree until we find a block element or reach the editor
    while (node) {
        if (node.nodeType === 1 &&
            (node.tagName === 'P' || node.tagName === 'H1' || node.tagName === 'H2')) {
            blockElement = node;
            break;
        }
        node = node.parentNode;
    }

    if (!blockElement) return false;

    // Create a range from start of block to cursor position
    const testRange = document.createRange();
    testRange.setStart(blockElement, 0);
    testRange.setEnd(range.startContainer, range.startOffset);

    // Check if there's only whitespace before cursor
    const content = testRange.toString();
    return content.trim() === '';
}

function initializeEditor(editor) {
    if (!editor) return;

    console.log("Initializing editor", editor);

    // Create initial paragraph if editor is empty
    if (editor.innerHTML.trim() === '' || editor.innerHTML === '<p>Tell your story...</p>') {
        editor.innerHTML = '<div class="block-container"><p class="editable-block"><br></p></div>';
    }

    // Convert any direct paragraph elements to block containers
    editor.querySelectorAll('p:not(.editable-block), h1:not(.editable-block), h2:not(.editable-block), blockquote:not(.editable-block), pre:not(.editable-block)').forEach(el => {
        if (el.closest('.block-container')) return; // Skip if already in a container

        const content = el.innerHTML;
        const tagName = el.tagName.toLowerCase();
        const container = document.createElement('div');
        container.className = 'block-container';

        // Create the plus menu
        const plusMenu = document.createElement('div');
        plusMenu.className = 'plus-menu';
        plusMenu.innerHTML = '<button class="plus-button" type="button">+</button>';

        // Create the editable element
        const editable = document.createElement(tagName);
        editable.className = 'editable-block';
        editable.contentEditable = 'true';
        editable.innerHTML = content;

        // Assemble the container
        container.appendChild(plusMenu);
        container.appendChild(editable);

        el.replaceWith(container);
    });

    // Helper function to find the current block container
    function getCurrentBlockContainer(node) {
        while (node && node !== editor) {
            if (node.nodeType === 1 && node.classList && node.classList.contains('block-container')) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    // Helper function to get previous block container
    function getPreviousBlockContainer(block) {
        if (!block) return null;
        return block.previousElementSibling;
    }

    // Helper to position cursor at end of element
    function placeCursorAtEnd(element) {
        if (!element) return;

        const range = document.createRange();
        const selection = window.getSelection();

        // If element has child nodes, put cursor at the end of the last child
        if (element.lastChild) {
            if (element.lastChild.nodeType === 3) { // Text node
                range.setStart(element.lastChild, element.lastChild.length);
            } else {
                // If the last child has content, place at the end of its content
                if (element.lastChild.lastChild) {
                    range.setStartAfter(element.lastChild.lastChild);
                } else {
                    range.setStartAfter(element.lastChild);
                }
            }
        } else {
            range.setStart(element, 0);
        }

        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Create block function
    function createBlock(type = 'p', content = '') {
        const container = document.createElement('div');
        container.className = 'block-container';

        // Create the plus menu
        const plusMenu = document.createElement('div');
        plusMenu.className = 'plus-menu';
        plusMenu.innerHTML = '<button class="plus-button" type="button">+</button>';

        // Create the editable element
        let editable;
        if (type === 'code') {
            editable = document.createElement('pre');
            const code = document.createElement('code');
            code.innerHTML = content || '<br>';
            editable.appendChild(code);
        } else {
            editable = document.createElement(type);
            editable.innerHTML = content || '<br>';
        }

        editable.className = 'editable-block';
        editable.contentEditable = 'true';

        // Assemble the container
        container.appendChild(plusMenu);
        container.appendChild(editable);

        return container;
    }

    // Handle key events (Enter and Backspace)
    editor.addEventListener('keydown', (e) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const currentBlock = getCurrentBlockContainer(range.startContainer);

        // Handle Enter key - create new block
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (currentBlock) {
                const editableBlock = currentBlock.querySelector('.editable-block');

                // Create new container with empty paragraph
                const newContainer = createBlock('p', '');

                // Insert after current block
                currentBlock.after(newContainer);

                // Focus the new block
                const newBlock = newContainer.querySelector('.editable-block');
                newBlock.focus();

                // Place cursor at start of new block
                const newRange = document.createRange();
                newRange.setStart(newBlock, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }

        // Handle Backspace key at the beginning of a block
        if (e.key === 'Backspace') {
            const editableBlock = currentBlock?.querySelector('.editable-block');
            const isAtStartOfBlock = range.collapsed &&
                isAtBlockStart(range, editableBlock);

            if (isAtStartOfBlock && currentBlock) {
                e.preventDefault();

                // Find previous block
                const prevBlock = getPreviousBlockContainer(currentBlock);
                if (!prevBlock) return; // No previous block, don't delete

                const prevEditable = prevBlock.querySelector('.editable-block');
                if (!prevEditable) return;

                // Get content from current block
                const currentContent = editableBlock.innerHTML;

                // Append current content to previous block
                // Avoid adding empty content or just <br>
                if (currentContent && currentContent !== '<br>') {
                    if (prevEditable.innerHTML === '<br>') {
                        prevEditable.innerHTML = currentContent;
                    } else {
                        prevEditable.innerHTML += currentContent;
                    }
                }

                // Remove current block
                currentBlock.remove();

                // Set focus to previous block
                prevEditable.focus();
                placeCursorAtEnd(prevEditable);
            }
        }
    });

    // Check if the cursor is at the start of a block
    function isAtBlockStart(range, element) {
        if (!element || !range.collapsed) return false;

        // If there's no content, we're at the start
        if (element.textContent.trim() === '') return true;

        // Create a range from the start of the element to the cursor
        const testRange = document.createRange();
        testRange.setStart(element, 0);
        testRange.setEnd(range.startContainer, range.startOffset);

        // If the range content is empty, cursor is at start
        return testRange.toString().trim() === '';
    }

    // Handle block focus
    editor.addEventListener('click', (e) => {
        const block = e.target.closest('.block-container');
        if (block) {
            editor.querySelectorAll('.block-container').forEach(b => {
                b.classList.remove('is-active');
            });
            block.classList.add('is-active');
        }
    });

    // Handle plus button clicks
    editor.addEventListener('click', (e) => {
        const plusButton = e.target.closest('.plus-button');
        if (!plusButton) return;

        e.preventDefault();
        e.stopPropagation();

        // Close all existing popups first
        document.querySelectorAll('.plus-popup').forEach(p => p.remove());

        const container = plusButton.closest('.block-container');
        if (!container) return;

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'plus-popup';
        popup.innerHTML = `
            <button data-type="p">Paragraph</button>
            <button data-type="h1">Heading 1</button>
            <button data-type="h2">Heading 2</button>
            <button data-type="blockquote">Quote</button>
            <button data-type="code">Code</button>
            <button data-type="image">Image</button>
        `;

        // Position the popup next to the plus menu
        const plusMenu = container.querySelector('.plus-menu');
        plusMenu.appendChild(popup);

        // Handle popup button clicks
        popup.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            e.preventDefault();
            e.stopPropagation();

            const type = button.dataset.type;
            const block = container.querySelector('.editable-block');
            if (!block) return;

            const content = block.innerHTML;

            if (type === 'image') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.click();

                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                        // Create image placeholder
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        img.alt = file.name;
                        block.innerHTML = '';
                        block.appendChild(img);
                    } catch (error) {
                        console.error('Error handling image:', error);
                    }
                };
            } else {
                // Replace the current block with new type
                let newElement;
                if (type === 'code') {
                    newElement = document.createElement('pre');
                    const code = document.createElement('code');
                    code.innerHTML = content.trim() || '<br>';
                    newElement.appendChild(code);
                } else {
                    newElement = document.createElement(type);
                    newElement.innerHTML = content.trim() || '<br>';
                }

                newElement.className = 'editable-block';
                newElement.contentEditable = 'true';

                if (block.parentNode) {
                    // Replace only the editable block, not the whole container
                    block.parentNode.replaceChild(newElement, block);

                    // Focus the new element
                    newElement.focus();
                    placeCursorAtEnd(newElement);
                }
            }

            // Hide popup
            popup.remove();
        });
    });

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.plus-menu') && !e.target.closest('.plus-popup')) {
            document.querySelectorAll('.plus-popup').forEach(popup => popup.remove());
        }
    });
}

// Setup project button handlers
function setupProjectButtons() {
    // Edit project buttons
    document.querySelectorAll('.edit-project').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id
            const { data: project, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching project:', error)
                return
            }

            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderProjectForm(project)
            setupProjectForm()
        })
    })

    // Delete project buttons
    document.querySelectorAll('.delete-project').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id
            if (!confirm('Are you sure you want to delete this project?')) return

            try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                await loadProjects()
            } catch (error) {
                console.error('Error deleting project:', error)
                alert('Error deleting project')
            }
        })
    })
}

// Setup blog button handlers
function setupBlogButtons() {
    // Edit blog post buttons
    document.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id
            const { data: post, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching blog post:', error)
                return
            }

            const container = document.querySelector('.admin-dashboard')
            container.innerHTML = renderBlogPostForm(post)
            setupBlogPostForm()
        })
    })

    // Delete blog post buttons
    document.querySelectorAll('.delete-post').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id
            if (!confirm('Are you sure you want to delete this blog post?')) return

            try {
                const { error } = await supabase
                    .from('blog_posts')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                await loadBlogPosts()
            } catch (error) {
                console.error('Error deleting blog post:', error)
                alert('Error deleting blog post')
            }
        })
    })
}

// Move loadCategories function to the top level
async function loadCategories(selectElement, selectedCategory = null) {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (error) throw error

        // Clear existing options except first two
        while (selectElement.options.length > 2) {
            selectElement.remove(2)
        }

        // Add categories to select
        categories.forEach(category => {
            const option = new Option(category.name, category.name)
            selectElement.add(option)
        })

        // Set selected category if provided
        if (selectedCategory) {
            selectElement.value = selectedCategory
        }
    } catch (error) {
        console.error('Error loading categories:', error)
    }
}

// Add updateActiveLine function
function updateActiveLine(activeBlock) {
    if (!activeBlock) return;

    // Make sure we have an actual element
    let element = activeBlock;
    if (element.nodeType !== 1) {
        // If it's a text node, get its parent element
        element = element.parentNode;
    }

    // Remove active class from all blocks
    document.querySelectorAll('#editor .block-container').forEach(block => {
        block.classList.remove('is-active');
    });

    // Find the containing block-container
    while (element && element.nodeType === 1) {
        if (element.classList && element.classList.contains('block-container')) {
            element.classList.add('is-active');
            break;
        }
        element = element.parentNode;
    }
} 