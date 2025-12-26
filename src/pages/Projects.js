import { supabase } from '../main.js';

export async function renderProjectsPage(container) {
  // Show loading state
  container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">Work</h1>
          <p class="rm-page-description">A selection of recent projects showcasing product design and development</p>
        </div>
      </div>
    </section>
  `;

  try {
    let projects = [];

    // Check if supabase is initialized before trying to use it
    if (supabase) {
      console.log('Fetching projects from Supabase');
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        // Don't throw - fall through to mock data instead
      } else {
        projects = data || [];
        console.log(`Found ${projects.length} projects in database`);
      }
    } else {
      console.warn('Supabase not initialized, using mock data');
    }

    // If no projects in database, use mock data
    if (!projects || projects.length === 0) {
      console.log('No projects found in database, using mock data');
      projects = [
        {
          id: 1,
          slug: 'dungindragin',
          title: 'DunginDragin',
          category: 'Game',
          description: 'AI-powered Dungeons & Dragons adventure platform with infinite procedurally generated worlds. Create characters, explore diverse biomes, and experience dynamic storytelling that adapts to your every decision.',
          image_url: '/project-placeholder.jpg',
          technologies: ['Google Gemini AI', 'React', 'Node.js'],
          demo_url: 'https://www.dungindragin.com',
          year: '2024'
        },
        {
          id: 2,
          slug: 'fitnitapp',
          title: 'FitNit App',
          category: 'Mobile',
          description: 'Comprehensive fitness and nutrition tracking app that helps users achieve their health goals. Features workout logging, meal tracking, progress analytics, and personalized recommendations.',
          image_url: 'https://fitnitapp.com/assets/feature-image.jpg',
          technologies: ['React Native', 'Node.js', 'PostgreSQL', 'OpenAI'],
          year: '2024'
        },
        {
          id: 3,
          slug: 'hard-ship',
          title: 'Hard-Ship',
          category: 'Web Application',
          description: 'Challenging endurance and adventure platform designed to push users beyond their limits. Track expeditions, compete in challenges, and connect with a community of adventure seekers.',
          image_url: '/images/placeholder.svg',
          technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'Mapbox'],
          year: '2024'
        }
      ];
    }

    renderProjects(container, projects);
  } catch (error) {
    console.error('Error rendering projects page:', error);
    container.innerHTML = `
      <section class="rm-page">
        <div class="rm-container">
          <div class="rm-page-header">
            <h1 class="rm-page-title">Work</h1>
            <p class="rm-page-description">Unable to load projects</p>
          </div>
        </div>
      </section>
    `;
  }
}

function renderProjects(container, projects) {
  if (!projects || !Array.isArray(projects)) {
    console.error('Invalid projects data:', projects);
    projects = [];
  }

  // Process technologies
  projects = projects.map(project => {
    let technologies = [];
    if (project.technologies) {
      if (Array.isArray(project.technologies)) {
        technologies = project.technologies;
      } else if (typeof project.technologies === 'string') {
        try {
          technologies = JSON.parse(project.technologies);
        } catch (e) {
          technologies = project.technologies.split(',').map(t => t.trim());
        }
      }
    }
    return {
      ...project,
      technologies,
      image_url: project.image_url || '/images/placeholder.svg',
      category: project.category || 'Project',
      year: project.year || new Date(project.created_at).getFullYear() || '2024'
    };
  });

  const projectsHTML = projects.map(project => `
    <a href="/projects/${project.slug}" class="rm-project-item">
      <div class="rm-project-image" style="background-image: url('${project.image_url}'); background-size: cover; background-position: center;"></div>
      <div class="rm-project-info">
        <div class="rm-project-meta">
          <span class="rm-project-category">${project.category}</span>
          <span class="rm-project-year">${project.year}</span>
        </div>
        <h3 class="rm-project-title">${project.title}</h3>
        <p class="rm-project-description">${project.description}</p>
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="rm-project-tech">
            ${project.technologies.map(tech => `<span class="rm-tech-tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </a>
  `).join('');

  const emptyMessage = projects.length === 0 ? '<p class="rm-empty-message">No projects available yet.</p>' : '';

  container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">Work</h1>
          <p class="rm-page-description">A selection of recent projects showcasing product design and development</p>
        </div>

        <div class="rm-projects-grid">
          ${emptyMessage}
          ${projectsHTML}
        </div>
      </div>
    </section>
  `;
} 