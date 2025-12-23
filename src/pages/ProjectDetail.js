import { supabase } from '../main.js';

export async function renderProjectDetailPage(container, slug) {
    // Show loading state
    container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-loading">Loading project details...</div>
      </div>
    </section>
  `;

    try {
        let project = null;

        // Check if supabase is initialized before trying to use it
        if (supabase) {
            // Fetch project from Supabase
            const { data, error } = await supabase
                .from('portfolio_projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
                console.error('Error fetching project from Supabase:', error);
                // Don't throw - fall through to mock data instead
            } else {
                project = data;
            }
        } else {
            console.log('Supabase not initialized, using mock data');
        }

        // If supabase is not initialized or project doesn't exist in database, use mockup data
        if (!project) {
            const mockProjects = {
                'fitnitapp': {
                    id: 1,
                    slug: 'fitnitapp',
                    title: 'FitNit App',
                    category: 'Mobile',
                    description: 'Comprehensive fitness and nutrition tracking app that helps users achieve their health goals. Features workout logging, meal tracking, progress analytics, and personalized recommendations.',
                    full_description: `FitNit App is a comprehensive fitness and nutrition tracking platform designed to help users take control of their health journey. The app combines intuitive workout logging with detailed nutrition tracking to provide a complete picture of your daily wellness.

The workout tracking system allows users to log exercises with sets, reps, and weights, while also supporting cardio activities with distance and duration tracking. AI-powered form analysis provides real-time feedback to help prevent injuries and optimize results.

On the nutrition side, users can easily log meals using a barcode scanner, food search, or AI-powered photo recognition. The app calculates macros and micronutrients, tracks water intake, and provides personalized meal recommendations based on fitness goals.

Progress analytics visualize your journey over time with detailed charts showing weight trends, strength gains, and nutrition habits. The app learns from your patterns to provide increasingly personalized recommendations.`,
                    image_url: 'https://fitnitapp.com/assets/feature-image.jpg',
                    gallery: [
                        'https://fitnitapp.com/assets/feature-image.jpg'
                    ],
                    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'OpenAI'],
                    features: [
                        'Comprehensive workout logging with exercise library',
                        'AI-powered nutrition tracking with photo recognition',
                        'Barcode scanner for easy food logging',
                        'Macro and micronutrient tracking',
                        'Progress analytics with visual charts',
                        'Personalized workout and meal recommendations',
                        'Water intake tracking',
                        'Goal setting and progress milestones'
                    ],
                    demo_url: 'https://fitnitapp.com',
                    github_url: null,
                    launch_date: '2024-06-01',
                    year: '2024'
                },
                'hard-ship': {
                    id: 2,
                    slug: 'hard-ship',
                    title: 'Hard-Ship',
                    category: 'Web Application',
                    description: 'Challenging endurance and adventure platform designed to push users beyond their limits. Track expeditions, compete in challenges, and connect with a community of adventure seekers.',
                    full_description: `Hard-Ship is a platform built for those who seek to push beyond their comfort zones. Whether you're training for an ultra-marathon, planning a mountain expedition, or simply want to challenge yourself with daily hardship tasks, this platform provides the tools and community to help you succeed.

The expedition tracking feature allows users to plan and document multi-day adventures with GPS mapping, checkpoint logging, and real-time progress sharing. Friends and family can follow along as you conquer new challenges.

The challenge system offers everything from daily cold plunge streaks to month-long fitness challenges. Compete on leaderboards, earn achievement badges, and join teams to tackle group challenges together.

At its core, Hard-Ship is about building mental and physical resilience. The platform includes guided programs for developing discipline, tracking habits, and progressively increasing your capacity for discomfort. Join a community of like-minded individuals who believe that voluntary hardship is the path to growth.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'Mapbox'],
                    features: [
                        'GPS expedition tracking and mapping',
                        'Daily and monthly challenge system',
                        'Leaderboards and achievement badges',
                        'Team challenges and group competitions',
                        'Habit tracking for building discipline',
                        'Progress sharing with friends and family',
                        'Guided resilience programs',
                        'Community forums and adventure groups'
                    ],
                    demo_url: 'https://hard-ship.com',
                    github_url: null,
                    launch_date: '2024-08-15',
                    year: '2024'
                }
            };

            const projectData = mockProjects[slug];
            if (projectData) {
                renderProjectDetail(container, projectData);
            } else {
                // If no matching slug in our mockup data either
                container.innerHTML = `
          <section class="rm-page">
            <div class="rm-container">
              <h1 class="rm-page-title">Project Not Found</h1>
              <p class="rm-page-description">The project you're looking for doesn't exist or has been removed.</p>
              <a href="/projects" class="rm-btn rm-btn-primary">Back to Projects</a>
            </div>
          </section>
        `;
            }
        } else {
            renderProjectDetail(container, project);
        }
    } catch (error) {
        container.innerHTML = `
      <section class="rm-page">
        <div class="rm-container">
          <h1 class="rm-page-title">Error Loading Project</h1>
          <p class="rm-page-description">Failed to load project details. Please try again later.</p>
          <p class="rm-page-description">${error.message}</p>
          <a href="/projects" class="rm-btn rm-btn-primary">Back to Projects</a>
        </div>
      </section>
    `;
        console.error('Error fetching project details:', error);
    }
}

function renderProjectDetail(container, project) {
    // Format technologies and features as lists if they exist
    const technologiesHTML = project.technologies && Array.isArray(project.technologies)
        ? `
      <div class="rm-detail-section">
        <h3 class="rm-detail-heading">Technologies Used</h3>
        <div class="rm-tech-tags">
          ${project.technologies.map(tech => `<span class="rm-tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
    `
        : '';

    const featuresHTML = project.features && Array.isArray(project.features)
        ? `
      <div class="rm-detail-section">
        <h3 class="rm-detail-heading">Key Features</h3>
        <ul class="rm-features-list">
          ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
    `
        : '';

    // Format gallery if it exists
    const galleryHTML = project.gallery && Array.isArray(project.gallery)
        ? `
      <div class="rm-detail-section">
        <h3 class="rm-detail-heading">Gallery</h3>
        <div class="rm-gallery">
          ${project.gallery.map(image => `
            <div class="rm-gallery-item">
              <div class="rm-gallery-placeholder"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `
        : '';

    // Format links if they exist
    const linksHTML = (project.demo_url || project.github_url)
        ? `
      <div class="rm-detail-section">
        <div class="rm-detail-links">
          ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" rel="noopener noreferrer" class="rm-btn rm-btn-primary">View Live Project</a>` : ''}
          ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="rm-btn rm-btn-secondary">View on GitHub</a>` : ''}
        </div>
      </div>
    `
        : '';

    container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <a href="/projects" class="rm-back-link">← Back to Projects</a>

        <div class="rm-detail-header">
          <div class="rm-detail-meta">
            <span class="rm-detail-category">${project.category}</span>
            ${project.launch_date ? `<span class="rm-detail-date">${new Date(project.launch_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>` : ''}
          </div>
          <h1 class="rm-detail-title">${project.title}</h1>
        </div>

        <div class="rm-detail-hero">
          <div class="rm-detail-hero-placeholder"></div>
        </div>

        <div class="rm-detail-content">
          <div class="rm-detail-description">
            ${project.full_description ? project.full_description.split('\n\n').map(para => `<p>${para}</p>`).join('') : `<p>${project.description}</p>`}
          </div>

          ${technologiesHTML}
          ${featuresHTML}
          ${galleryHTML}
          ${linksHTML}
        </div>
      </div>
    </section>
  `;
} 