import './style.css'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Navigation component
function renderNav() {
  return `
    <nav class="nav">
      <div class="nav-content">
        <a href="/" class="nav-logo">CB</a>
        <ul class="nav-links">
          <li><a href="/projects">Projects</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/admin" class="admin-link">Admin</a></li>
        </ul>
      </div>
    </nav>
  `
}

// Fetch projects from Supabase
async function fetchProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects
}

// Fetch single project from Supabase
async function fetchProject(slug) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return project
}

// Fetch blog posts from Supabase
async function fetchBlogPosts() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return posts
}

// Fetch single blog post from Supabase
async function fetchBlogPost(slug) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  return post
}

// Format date helper
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Render projects grid
function renderProjects(projects) {
  if (!projects.length) {
    return '<div class="loading">No projects found</div>'
  }

  return `
    <div class="project-grid">
      ${projects.map(project => `
        <a href="/project/${project.slug}" class="project-card">
          <img src="${project.image_url || 'https://via.placeholder.com/400x200'}" alt="${project.title}">
          <div class="project-title">${project.title}</div>
        </a>
      `).join('')}
    </div>
  `
}

// Render project detail page
function renderProjectDetail(project) {
  if (!project) {
    return '<div class="loading">Project not found</div>'
  }

  const techStack = project.tech_stack ? JSON.parse(project.tech_stack) : []
  const features = project.features ? JSON.parse(project.features) : []
  const images = project.gallery_images ? JSON.parse(project.gallery_images) : []

  return `
    <div class="project-detail">
      <img class="project-detail-image" src="${project.image_url || 'https://via.placeholder.com/800x400'}" alt="${project.title}">
      <div class="project-detail-content">
        <div class="project-meta">
          <span class="project-date">${formatDate(project.created_at)}</span>
          ${project.category ? `<span class="project-category">${project.category}</span>` : ''}
        </div>
        <h2>${project.title}</h2>
        <div class="project-description">${project.description || ''}</div>
        
        ${techStack.length ? `
          <div class="project-section">
            <h3>Technologies Used</h3>
            <ul class="tech-list">
              ${techStack.map(tech => `<li>${tech}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${features.length ? `
          <div class="project-section">
            <h3>Key Features</h3>
            <ul class="features-list">
              ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${images.length ? `
          <div class="project-section">
            <h3>Gallery</h3>
            <div class="project-gallery">
              ${images.map(image => `
                <img src="${image}" alt="Project gallery image" class="gallery-image">
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="project-links">
          ${project.url ? `
            <a href="${project.url}" class="project-link primary" target="_blank" rel="noopener noreferrer">
              View Live Project
            </a>
          ` : ''}
          ${project.github_url ? `
            <a href="${project.github_url}" class="project-link secondary" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// Render blog posts grid
function renderBlogPosts(posts) {
  if (!posts.length) {
    return '<div class="loading">No blog posts found</div>'
  }

  return `
    <div class="blog-grid">
      ${posts.map(post => `
        <a href="/blog/${post.slug}" class="blog-card">
          ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="blog-image">` : ''}
          <div class="blog-content">
            <span class="blog-date">${formatDate(post.created_at)}</span>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt || ''}</p>
          </div>
        </a>
      `).join('')}
    </div>
  `
}

// Render blog post detail
function renderBlogPost(post) {
  if (!post) {
    return '<div class="loading">Blog post not found</div>'
  }

  return `
    <div class="blog-post">
      ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="blog-post-image">` : ''}
      <div class="blog-post-content">
        <span class="blog-post-date">${formatDate(post.created_at)}</span>
        <h2>${post.title}</h2>
        <div class="blog-post-body">${post.content || ''}</div>
      </div>
    </div>
  `
}

// Export supabase client for use in other modules
export { supabase }

// Handle routing
async function handleRoute() {
  const app = document.querySelector('#app')
  const path = window.location.pathname
  const projectSlug = path.match(/^\/project\/([^/]+)/)?.[1]
  const blogPostSlug = path.match(/^\/blog\/([^/]+)/)?.[1]

  // Add navigation to all pages except admin
  if (path !== '/admin') {
    app.innerHTML = renderNav()
  }

  if (path === '/admin') {
    // Admin page
    const { initAdmin } = await import('./pages/Admin.js')
    app.innerHTML = '<div class="admin-container"></div>'
    const adminContainer = app.querySelector('.admin-container')
    await initAdmin(adminContainer)
  } else if (path === '/projects' || path === '/') {
    // Projects listing page
    app.innerHTML += `
      <div class="hero">
        <h1>${path === '/' ? 'CADEN BURLESON' : 'PROJECTS'}</h1>
      </div>
      <section class="projects-section">
        <div class="loading">Loading projects...</div>
      </section>
    `
    try {
      const projects = await fetchProjects()
      const projectsSection = app.querySelector('.projects-section')
      projectsSection.innerHTML = renderProjects(projects)
    } catch (error) {
      console.error('Error:', error)
      const projectsSection = app.querySelector('.projects-section')
      projectsSection.innerHTML = '<div class="loading">Error loading projects</div>'
    }
  } else if (projectSlug) {
    // Project detail page
    app.innerHTML += `
      <section class="projects-section">
        <div class="loading">Loading project...</div>
      </section>
    `
    try {
      const project = await fetchProject(projectSlug)
      const projectsSection = app.querySelector('.projects-section')
      projectsSection.innerHTML = renderProjectDetail(project)
    } catch (error) {
      console.error('Error:', error)
      const projectsSection = app.querySelector('.projects-section')
      projectsSection.innerHTML = '<div class="loading">Error loading project</div>'
    }
  } else if (path === '/blog') {
    // Blog listing page
    app.innerHTML += `
      <div class="hero">
        <h1>BLOG</h1>
      </div>
      <section class="blog-section">
        <div class="loading">Loading blog posts...</div>
      </section>
    `
    try {
      const posts = await fetchBlogPosts()
      const blogSection = app.querySelector('.blog-section')
      blogSection.innerHTML = renderBlogPosts(posts)
    } catch (error) {
      console.error('Error:', error)
      const blogSection = app.querySelector('.blog-section')
      blogSection.innerHTML = '<div class="loading">Error loading blog posts</div>'
    }
  } else if (blogPostSlug) {
    // Blog post detail page
    app.innerHTML += `
      <section class="blog-section">
        <div class="loading">Loading blog post...</div>
      </section>
    `
    try {
      const post = await fetchBlogPost(blogPostSlug)
      const blogSection = app.querySelector('.blog-section')
      blogSection.innerHTML = renderBlogPost(post)
    } catch (error) {
      console.error('Error:', error)
      const blogSection = app.querySelector('.blog-section')
      blogSection.innerHTML = '<div class="loading">Error loading blog post</div>'
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', handleRoute)

// Handle navigation
document.addEventListener('click', (e) => {
  const link = e.target.closest('a')
  if (link && link.href.startsWith(window.location.origin) && !link.target) {
    e.preventDefault()
    window.history.pushState({}, '', link.href)
    handleRoute()
  }
})

// Handle browser back/forward buttons
window.addEventListener('popstate', handleRoute)
