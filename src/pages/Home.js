import { supabase } from '../main.js';

export async function renderHomePage(container) {
  // Show loading state first
  container.innerHTML = `
    <section class="intro-section">
      <div class="intro-text">
        From post-it notes to full on SaaS products, I have the skills to bring your ideas to life. 
        I harness the newest technologies that are on the cutting edge of the industry. 
        Soaking in the latest trends and best practices to deliver the best possible results.
      </div>
      <div class="contact-block">
        <a href="/contact">CONTACT</a>
      </div>
    </section>
    
    <section id="projects-preview">
      <h1 class="projects-heading">PROJECTS</h1>
      <div id="featured-projects-container">
        <div class="loading-indicator">Loading featured projects...</div>
      </div>
      <div class="view-all-projects">
        <a href="/projects">VIEW ALL PROJECTS</a>
      </div>
    </section>
  `;

  // Add minimal interactivity
  const contactLink = container.querySelector('.contact-block a');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState({}, '', '/contact');
      document.dispatchEvent(new CustomEvent('route-changed'));
    });
  }

  // Load featured projects
  await loadFeaturedProjects(container);
}

async function loadFeaturedProjects(container) {
  const projectsContainer = container.querySelector('#featured-projects-container');

  try {
    let projects = [];

    // Check if supabase is initialized before trying to use it
    if (supabase) {
      console.log('Fetching projects from Supabase for homepage');

      // Use the same query as Projects.js but add the featured filter
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)  // Only get featured projects
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured projects from Supabase:', error);
        throw error;
      }

      projects = data || [];
      console.log(`Found ${projects.length} featured projects in database`);
    } else {
      console.warn('Supabase not initialized');
    }

    // Process projects exactly like in Projects.js
    projects = projects.map(project => {
      // Handle different technology formats
      let technologies = [];
      if (project.technologies) {
        if (Array.isArray(project.technologies)) {
          technologies = project.technologies;
        } else if (typeof project.technologies === 'string') {
          try {
            // Try parsing as JSON first
            technologies = JSON.parse(project.technologies);
          } catch (e) {
            // If not valid JSON, assume comma-separated string
            technologies = project.technologies.split(',').map(t => t.trim());
          }
        }
      }

      return {
        ...project,
        technologies,
        // Ensure these properties have defaults and proper formatting
        image_url: project.image_url || '/images/placeholder.svg',
        category: (project.category || 'Project').toUpperCase(),
        title: (project.title || 'Project').toUpperCase(),
        description: (project.description || '').toUpperCase()
      };
    });

    // If no projects found, show a message
    if (projects.length === 0) {
      projectsContainer.innerHTML = `
        <div class="no-projects-message">
          <p>No featured projects available yet.</p>
        </div>
      `;
      return;
    }

    // Force grid layout
    const style = `
      <style>
        #featured-projects-container .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-md);
        }
        
        @media (max-width: 900px) {
          #featured-projects-container .project-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }
        
        @media (max-width: 600px) {
          #featured-projects-container .project-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;

    // Create project cards for all featured projects
    projectsContainer.innerHTML = style + `
      <div class="project-grid">
        ${projects.map(project => `
          <div class="project-card">
            <img src="${project.image_url}" alt="${project.title}" class="project-card-image">
            <div class="card-label">${project.category}</div>
            <div class="project-card-content">
              <div class="project-title">${project.title}</div>
              <div class="project-description">${project.description}</div>
              <a href="/projects/${project.slug}" class="project-link">VIEW PROJECT</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (error) {
    console.error('Error loading featured projects:', error);
    projectsContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to load featured projects. Please try again later.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `;
  }
} 