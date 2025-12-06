import './style.css'
import { createClient } from '@supabase/supabase-js'
import { renderHomePage } from './pages/Home.js'
import { renderProjectsPage } from './pages/Projects.js'
import { renderProjectDetailPage } from './pages/ProjectDetail.js'
import { renderBlogPage, renderBlogPostPage } from './pages/Blog.js'
import { renderAboutPage } from './pages/About.js'
import { renderContactPage } from './pages/Contact.js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Navigation component
function renderNav() {
  return `
    <nav class="nav">
      <div class="nav-content">
        <a href="/" class="nav-logo">
          <span class="logo-icon"></span>
          <span class="logo-text">Devanta<br/>Ebison</span>
        </a>
        <button class="nav-hamburger" aria-label="Toggle navigation menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <ul class="nav-links">
          <li><a href="/projects">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  `
}

// Toggle mobile navigation
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger')
  const navLinks = document.querySelector('.nav-links')

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active')
      navLinks.classList.toggle('active')
      document.body.classList.toggle('nav-open')
    })

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a')
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active')
        navLinks.classList.remove('active')
        document.body.classList.remove('nav-open')
      })
    })
  }
}

// Keep old functions for backward compatibility but they won't be used
async function fetchProjects() {
  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects
}

async function fetchProject(slug) {
  const { data: project, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return project
}

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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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
  const projectSlug = path.match(/^\/projects\/([^/]+)/)?.[1]
  const blogSlug = path.match(/^\/blog\/([^/]+)/)?.[1]

  // Create a container for navigation and content
  let pageContent = renderNav()

  if (path === '/' || path === '/home') {
    // Home page
    await renderHomePage(app)
  } else if (path === '/about') {
    // About page
    await renderAboutPage(app)
  } else if (path === '/contact') {
    // Contact page
    await renderContactPage(app)
  } else if (path === '/projects' && !projectSlug) {
    // Projects listing page
    await renderProjectsPage(app)
  } else if (projectSlug) {
    // Project detail page
    await renderProjectDetailPage(app, projectSlug)
  } else if (path === '/blog' && !blogSlug) {
    // Blog listing page
    await renderBlogPage(app)
  } else if (blogSlug) {
    // Blog post detail page
    await renderBlogPostPage(app, blogSlug)
  } else {
    // Default to home
    await renderHomePage(app)
  }

  // Prepend navigation to the page
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = pageContent
  const nav = tempDiv.querySelector('nav')

  // Remove old nav if it exists
  const oldNav = document.querySelector('nav')
  if (oldNav) {
    oldNav.remove()
  }

  // Insert new nav at the beginning of body
  document.body.insertBefore(nav, document.body.firstChild)

  // Initialize mobile navigation after rendering
  initMobileNav()
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
