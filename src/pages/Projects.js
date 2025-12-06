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
          slug: 'ecommerce-platform',
          title: 'Modern E-commerce Platform',
          category: 'Web Application',
          description: 'Led complete redesign of checkout flow for a fashion retail brand, reducing cart abandonment by 45% and increasing conversion rate by 40%. Implemented one-click purchasing, guest checkout, and real-time inventory updates.',
          image_url: '/images/placeholder.svg',
          technologies: ['React', 'Node.js', 'Stripe', 'PostgreSQL', 'Redis'],
          year: '2024'
        },
        {
          id: 2,
          slug: 'mobile-banking',
          title: 'Neo Banking App',
          category: 'Mobile',
          description: 'Designed and built a mobile-first banking experience for millennials and Gen Z. Features include instant transfers, bill splitting, savings goals, and spending insights. Used by 50,000+ active users.',
          image_url: '/images/placeholder.svg',
          technologies: ['React Native', 'TypeScript', 'Firebase', 'Plaid'],
          year: '2024'
        },
        {
          id: 3,
          slug: 'design-system',
          title: 'Horizon Design System',
          category: 'Design System',
          description: 'Created comprehensive design system for SaaS company with 15+ product teams. Includes 200+ components, design tokens, accessibility guidelines, and documentation. Reduced development time by 60%.',
          image_url: '/images/placeholder.svg',
          technologies: ['Figma', 'React', 'Storybook', 'Design Tokens', 'TypeScript'],
          year: '2023'
        },
        {
          id: 4,
          slug: 'saas-dashboard',
          title: 'Analytics Dashboard',
          category: 'Web Application',
          description: 'Built real-time analytics platform processing 10M+ events daily. Features custom data visualization, collaborative workspaces, and automated reporting. Helping 200+ businesses make data-driven decisions.',
          image_url: '/images/placeholder.svg',
          technologies: ['Vue.js', 'D3.js', 'GraphQL', 'AWS', 'Lambda'],
          year: '2023'
        },
        {
          id: 5,
          slug: 'fitness-tracker',
          title: 'AI Fitness Companion',
          category: 'Mobile',
          description: 'Developed AI-powered fitness app that automatically tracks workouts using device sensors and computer vision. Provides personalized training plans, form corrections, and recovery recommendations.',
          image_url: '/images/placeholder.svg',
          technologies: ['Swift', 'HealthKit', 'Core ML', 'SwiftUI', 'TensorFlow'],
          year: '2023'
        },
        {
          id: 6,
          slug: 'restaurant-booking',
          title: 'Dine Reserve Platform',
          category: 'Web Application',
          description: 'Created reservation and table management system for restaurants. Handles 10,000+ monthly bookings across 50+ venues. Features include waitlist management, automated confirmations, and customer preferences.',
          image_url: '/images/placeholder.svg',
          technologies: ['Next.js', 'Prisma', 'Tailwind CSS', 'Twilio'],
          year: '2022'
        },
        {
          id: 7,
          slug: 'healthcare-portal',
          title: 'Patient Portal',
          category: 'Web Application',
          description: 'Designed HIPAA-compliant patient portal for healthcare network serving 100,000+ patients. Features secure messaging, appointment scheduling, medical records access, and prescription refills.',
          image_url: '/images/placeholder.svg',
          technologies: ['React', 'FHIR', 'AWS', 'PostgreSQL', 'OAuth'],
          year: '2022'
        },
        {
          id: 8,
          slug: 'event-platform',
          title: 'Virtual Events Platform',
          category: 'Web Application',
          description: 'Built scalable platform for hosting virtual conferences and webinars. Supports live streaming, breakout rooms, networking, and interactive Q&A. Hosted events with 50,000+ concurrent attendees.',
          image_url: '/images/placeholder.svg',
          technologies: ['WebRTC', 'Socket.io', 'React', 'Node.js', 'MongoDB'],
          year: '2022'
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
      <div class="rm-project-image"></div>
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