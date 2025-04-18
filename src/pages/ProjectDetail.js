import { supabase } from '../main.js';

export async function renderProjectDetailPage(container, slug) {
    // Show loading state
    container.innerHTML = `
    <section class="project-detail-section">
      <div class="container">
        <div class="loading-indicator">Loading project details...</div>
      </div>
    </section>
  `;

    try {
        let project = null;

        // Check if supabase is initialized before trying to use it
        if (supabase) {
            // Fetch project from Supabase
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
                throw error;
            }

            project = data;
        } else {
            console.log('Supabase not initialized, using mock data');
        }

        // If supabase is not initialized or project doesn't exist in database, use mockup data
        if (!project) {
            const mockProjects = {
                'fitnit': {
                    id: 1,
                    slug: 'fitnit',
                    title: 'FITNIT',
                    category: 'Fitness App',
                    description: 'AUTOMATICALLY TRACK YOUR REPS DOING VARIOUS EXERCISES.',
                    full_description: `FITNIT is a revolutionary fitness application that uses computer vision to automatically track and count your repetitions during workouts. The app eliminates the need for manual tracking, allowing you to focus entirely on your form and performance.

Using the device's camera and advanced machine learning algorithms, FITNIT can recognize and track a variety of exercises including push-ups, squats, lunges, and more. The app provides real-time feedback on your form, helping you to improve your technique and reduce the risk of injury.

In addition to rep counting, FITNIT includes customizable workout plans, progress tracking, and social features that allow you to compete with friends and join community challenges.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['React Native', 'TensorFlow.js', 'Firebase'],
                    features: [
                        'Automatic rep counting using computer vision',
                        'Form analysis and correction',
                        'Customizable workout plans',
                        'Progress tracking and statistics',
                        'Social features and challenges'
                    ],
                    demo_url: 'https://fitnit.app',
                    github_url: 'https://github.com/cadenburleson/fitnit',
                    launch_date: '2023-05-15',
                    featured: true
                },
                'writerly': {
                    id: 2,
                    slug: 'writerly',
                    title: 'WRITERLY',
                    category: 'Writing App',
                    description: 'A MINIMALIST TOOL FOR WRITERS TO ORGANIZE THEIR THOUGHTS.',
                    full_description: `Writerly is a distraction-free writing environment designed for authors, bloggers, and content creators who want to focus purely on their writing process.

The application features a clean, minimalist interface that eliminates distractions while providing powerful organization tools for managing notes, outlines, and drafts. Writerly includes a variety of templates for different writing formats, from novels to blog posts to academic papers.

What sets Writerly apart is its "smart suggestions" feature, which provides gentle prompts and ideas when you're stuck, without being intrusive. The app also includes a built-in research panel that allows you to gather information without leaving your writing environment.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['Vue.js', 'IndexedDB', 'Electron'],
                    features: [
                        'Distraction-free writing environment',
                        'Hierarchical organization of notes and drafts',
                        'Templates for different writing formats',
                        'Smart writing suggestions',
                        'Integrated research panel',
                        'Dark and light modes',
                        'Offline-first with cloud sync'
                    ],
                    demo_url: 'https://writerly.app',
                    github_url: 'https://github.com/cadenburleson/writerly',
                    launch_date: '2022-11-10',
                    featured: true
                },
                'retro-rpg': {
                    id: 3,
                    slug: 'retro-rpg',
                    title: 'RETRO RPG',
                    category: 'Game',
                    description: 'AN OLD-SCHOOL ROLE PLAYING GAME WITH MODERN MECHANICS.',
                    full_description: `Retro RPG is a love letter to the classic role-playing games of the 16-bit era, combined with modern game design principles and quality-of-life improvements.

Set in a rich fantasy world called Eldoria, players embark on an epic journey to restore balance to a land threatened by ancient forces. The game features pixel art aesthetics reminiscent of SNES-era RPGs but incorporates modern lighting effects and fluid animation.

While Retro RPG honors the traditional turn-based combat systems of classic RPGs, it introduces innovative mechanics such as a dynamic positioning system that adds strategic depth to battles. The game also features a branching narrative with meaningful choices that affect the world and story.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['Godot', 'GDScript', 'Aseprite'],
                    features: [
                        'Classic pixel art aesthetics with modern effects',
                        'Innovative turn-based combat system',
                        'Branching narrative with meaningful choices',
                        'Rich world with extensive lore',
                        'Original soundtrack with 20+ unique tracks',
                        'Multiple endings based on player choices',
                        'New Game+ mode with additional challenges'
                    ],
                    demo_url: 'https://retro-rpg.game',
                    github_url: 'https://github.com/cadenburleson/retro-rpg',
                    launch_date: '2023-01-22',
                    featured: true
                }
            };

            const projectData = mockProjects[slug];
            if (projectData) {
                renderProjectDetail(container, projectData);
            } else {
                // If no matching slug in our mockup data either
                container.innerHTML = `
          <section class="project-detail-section">
            <div class="container">
              <h1 class="error-title">Project Not Found</h1>
              <p>The project you're looking for doesn't exist or has been removed.</p>
              <a href="/projects" class="back-button">Back to Projects</a>
            </div>
          </section>
        `;
            }
        } else {
            renderProjectDetail(container, project);
        }
    } catch (error) {
        container.innerHTML = `
      <section class="project-detail-section">
        <div class="container">
          <h1 class="error-title">Error Loading Project</h1>
          <p>Failed to load project details. Please try again later.</p>
          <p>Error: ${error.message}</p>
          <a href="/projects" class="back-button">Back to Projects</a>
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
      <div class="project-tech-section">
        <h3>Technologies Used</h3>
        <div class="tech-tags">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
    `
        : '';

    const featuresHTML = project.features && Array.isArray(project.features)
        ? `
      <div class="project-features-section">
        <h3>Key Features</h3>
        <ul class="features-list">
          ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
    `
        : '';

    // Format gallery if it exists
    const galleryHTML = project.gallery && Array.isArray(project.gallery)
        ? `
      <div class="project-gallery-section">
        <h3>Gallery</h3>
        <div class="image-gallery">
          ${project.gallery.map(image => `
            <div class="gallery-item">
              <img src="${image}" alt="${project.title} screenshot" class="gallery-image">
            </div>
          `).join('')}
        </div>
      </div>
    `
        : '';

    // Format links if they exist
    const linksHTML = (project.demo_url || project.github_url)
        ? `
      <div class="project-links-section">
        <h3>Links</h3>
        <div class="project-links">
          ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="project-link-button">Live Demo</a>` : ''}
          ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link-button github">View Code</a>` : ''}
        </div>
      </div>
    `
        : '';

    container.innerHTML = `
    <section class="project-detail-section">
      <div class="container">
        <a href="/projects" class="back-button">← Back to Projects</a>
        
        <div class="project-header">
          <div class="project-category">${project.category}</div>
          <h1 class="project-title">${project.title}</h1>
          ${project.launch_date ? `<div class="project-date">Launched: ${new Date(project.launch_date).toLocaleDateString()}</div>` : ''}
        </div>
        
        <div class="project-hero">
          <img src="${project.image_url}" alt="${project.title}" class="project-hero-image">
        </div>
        
        <div class="project-content">
          <div class="project-description">
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