import { supabase } from '../main.js';

export async function renderProjectsPage(container) {
  // Show loading state
  container.innerHTML = `
    <section class="projects-section">
      <div class="container">
        <h1 class="page-title">PROJECTS</h1>
        <div class="loading-indicator">Loading projects...</div>
      </div>
    </section>
  `;

  try {
    let projects = [];

    // Check if supabase is initialized before trying to use it
    if (supabase) {
      console.log('Fetching projects from Supabase');
      // Fetch projects from Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        throw error;
      }

      projects = data || [];
      console.log(`Found ${projects.length} projects in database`);
    } else {
      console.warn('Supabase not initialized, using mock data');
    }

    // If supabase is not initialized or there are no projects in the database, use mock data
    if (!projects || projects.length === 0) {
      console.log('No projects found in database, using mock data');
      projects = [
        {
          id: 1,
          slug: 'fitnit',
          title: 'FITNIT',
          category: 'Fitness App',
          description: 'AUTOMATICALLY TRACK YOUR REPS DOING VARIOUS EXERCISES.',
          image_url: '/images/placeholder.svg',
          technologies: ['React Native', 'TensorFlow.js', 'Firebase'],
          featured: true
        },
        {
          id: 2,
          slug: 'writerly',
          title: 'WRITERLY',
          category: 'Writing App',
          description: 'A MINIMALIST TOOL FOR WRITERS TO ORGANIZE THEIR THOUGHTS.',
          image_url: '/images/placeholder.svg',
          technologies: ['Vue.js', 'IndexedDB', 'Electron'],
          featured: true
        },
        {
          id: 3,
          slug: 'retro-rpg',
          title: 'RETRO RPG',
          category: 'Game',
          description: 'AN OLD-SCHOOL ROLE PLAYING GAME WITH MODERN MECHANICS.',
          image_url: '/images/placeholder.svg',
          technologies: ['Godot', 'GDScript', 'Aseprite'],
          featured: true
        }
      ];
    }

    renderProjects(container, projects);
  } catch (error) {
    console.error('Error rendering projects page:', error);
    container.innerHTML = `
      <section class="projects-section">
        <div class="container">
          <h1 class="page-title">PROJECTS</h1>
          <div class="error-message">
            <p>Failed to load projects. Please try again later.</p>
            <p>Error: ${error.message}</p>
          </div>
        </div>
      </section>
    `;
  }
}

function renderProjects(container, projects) {
  // Handle edge case of projects not being valid
  if (!projects || !Array.isArray(projects)) {
    console.error('Invalid projects data:', projects);
    projects = [];
  }

  // Process technologies to ensure they're in the right format
  projects = projects.map(project => {
    // Handle different technology formats (string, array, JSON string)
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
      // Ensure these properties have defaults
      image_url: project.image_url || '/images/placeholder.svg',
      category: project.category || 'Project'
    };
  });

  // Get unique categories from projects, preserving the exact categories
  const categories = [...new Set(projects.map(project =>
    project.category?.trim() || ''
  ).filter(Boolean))];

  // Generate filter buttons HTML
  const filterButtonsHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    ${categories.map(category => `
      <button class="filter-btn" data-filter="${category.toLowerCase()}">${category}</button>
    `).join('')}
  `;

  const projectsHTML = projects.map(project => `
    <div class="project-card" data-project-id="${project.id}" data-category="${project.category?.trim() || ''}">
      <img src="${project.image_url}" alt="${project.title}" class="project-card-image">
      <div class="card-label">${project.category}</div>
      <div class="project-card-content">
        <div class="project-title">${project.title}</div>
        <div class="project-description">${project.description}</div>
        <div class="project-tech">
          ${project.technologies && Array.isArray(project.technologies)
      ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
      : ''}
        </div>
        <a href="/projects/${project.slug}" class="project-link">VIEW PROJECT</a>
      </div>
    </div>
  `).join('');

  // Add 'single-project' class to the project grid if there's only one project
  const singleProjectClass = projects.length === 1 ? 'single-project' : '';
  const emptyMessage = projects.length === 0 ? '<p class="no-projects-message">No projects available yet.</p>' : '';

  container.innerHTML = `
    <section class="projects-section">
      <div class="container">
        <h1 class="page-title">PROJECTS</h1>
        
        ${projects.length > 0 ? `
          <div class="project-filters">
            ${filterButtonsHTML}
          </div>
        ` : ''}
        
        <div class="project-grid ${singleProjectClass}">
          ${emptyMessage}
          ${projectsHTML}
        </div>
      </div>
    </section>
  `;

  // Add filter functionality only if we have projects
  if (projects.length > 0) {
    const filterButtons = container.querySelectorAll('.filter-btn');
    const projectCards = container.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Show/hide projects based on exact category match
        projectCards.forEach(card => {
          const category = card.dataset.category || '';

          if (filter === 'all') {
            card.style.display = 'block';
          } else if (category.toLowerCase() === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
} 