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
        let projects = null;

        // Check if supabase is initialized before trying to use it
        if (supabase) {
            // Fetch projects from Supabase
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            projects = data;
        } else {
            console.log('Supabase not initialized, using mock data');
        }

        // If supabase is not initialized or there are no projects in the database, use mock data
        if (!projects || projects.length === 0) {
            const mockProjects = [
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
            renderProjects(container, mockProjects);
        } else {
            renderProjects(container, projects);
        }
    } catch (error) {
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
        console.error('Error fetching projects:', error);
    }
}

function renderProjects(container, projects) {
    const projectsHTML = projects.map(project => `
    <div class="project-card" data-project-id="${project.id}">
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

    container.innerHTML = `
    <section class="projects-section">
      <div class="container">
        <h1 class="page-title">PROJECTS</h1>
        
        <div class="project-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="web">Web</button>
          <button class="filter-btn" data-filter="mobile">Mobile</button>
          <button class="filter-btn" data-filter="game">Games</button>
        </div>
        
        <div class="project-grid">
          ${projectsHTML}
        </div>
      </div>
    </section>
  `;

    // Add filter functionality
    const filterButtons = container.querySelectorAll('.filter-btn');
    const projectCards = container.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Simple filtering just for demonstration
            // In a real implementation, we'd have proper category data
            projectCards.forEach(card => {
                const category = card.querySelector('.card-label').textContent.toLowerCase();

                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter === 'web' && (category.includes('app') || category.includes('website'))) {
                    card.style.display = 'block';
                } else if (filter === 'mobile' && category.includes('app')) {
                    card.style.display = 'block';
                } else if (filter === 'game' && category.includes('game')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
} 