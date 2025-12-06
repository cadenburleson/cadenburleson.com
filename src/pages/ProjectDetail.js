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
                'ecommerce-platform': {
                    id: 1,
                    slug: 'ecommerce-platform',
                    title: 'Modern E-commerce Platform',
                    category: 'Web Application',
                    description: 'Led complete redesign of checkout flow for a fashion retail brand, reducing cart abandonment by 45% and increasing conversion rate by 40%.',
                    full_description: `This project involved a comprehensive redesign of the entire checkout experience for a major fashion retail brand. Through extensive user research and A/B testing, we identified key friction points in the purchase journey and systematically addressed each one.

The redesign introduced one-click purchasing for returning customers, a streamlined guest checkout option that reduced form fields by 60%, and real-time inventory updates to prevent disappointment at checkout. We also implemented smart address validation and autocomplete features to speed up the process.

The results exceeded expectations: cart abandonment dropped by 45%, conversion rates increased by 40%, and average checkout time was reduced from 4.5 minutes to under 2 minutes. Customer satisfaction scores for the checkout process improved from 3.2 to 4.7 out of 5.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['React', 'Node.js', 'Stripe', 'PostgreSQL', 'Redis'],
                    features: [
                        'One-click purchasing for returning customers',
                        'Streamlined guest checkout with minimal form fields',
                        'Real-time inventory updates and availability checking',
                        'Smart address validation and autocomplete',
                        'Multiple payment method support',
                        'Progressive checkout with save & continue later',
                        'Mobile-optimized responsive design'
                    ],
                    demo_url: null,
                    github_url: null,
                    launch_date: '2024-03-15',
                    year: '2024'
                },
                'mobile-banking': {
                    id: 2,
                    slug: 'mobile-banking',
                    title: 'Neo Banking App',
                    category: 'Mobile',
                    description: 'Designed and built a mobile-first banking experience for millennials and Gen Z. Used by 50,000+ active users.',
                    full_description: `A next-generation mobile banking app built from the ground up for digital natives. The app reimagines traditional banking with features designed for how young people actually manage money today.

Key features include instant peer-to-peer transfers, intelligent bill splitting for group expenses, automated savings goals with visual progress tracking, and spending insights powered by machine learning. The app analyzes spending patterns and provides actionable recommendations for saving money.

The design emphasizes transparency and control, with real-time notifications for every transaction, customizable spending limits by category, and no hidden fees. Security features include biometric authentication, instant card freeze/unfreeze, and virtual card numbers for online shopping.

Since launch, the app has grown to over 50,000 active users with an average app store rating of 4.8/5.0.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['React Native', 'TypeScript', 'Firebase', 'Plaid'],
                    features: [
                        'Instant P2P money transfers',
                        'Smart bill splitting for group expenses',
                        'Automated savings goals with visual tracking',
                        'AI-powered spending insights and budgeting',
                        'Real-time transaction notifications',
                        'Biometric authentication (Face ID / Touch ID)',
                        'Virtual cards for secure online shopping',
                        'Zero hidden fees'
                    ],
                    demo_url: null,
                    github_url: null,
                    launch_date: '2024-01-20',
                    year: '2024'
                },
                'design-system': {
                    id: 3,
                    slug: 'design-system',
                    title: 'Horizon Design System',
                    category: 'Design System',
                    description: 'Created comprehensive design system for SaaS company with 15+ product teams. Reduced development time by 60%.',
                    full_description: `Horizon is a comprehensive design system created to unify the user experience across a family of SaaS products. When I joined, each product team was building components from scratch, leading to inconsistent experiences and duplicated effort.

The system includes over 200 components, from basic buttons and inputs to complex data tables and charts. Each component is built with accessibility in mind (WCAG 2.1 AA compliant), includes dark mode support, and is fully documented with usage guidelines and code examples.

A key innovation was our token-based theming system, which allows each product to maintain brand identity while staying consistent with core interaction patterns. We also built a Figma plugin that keeps design files in sync with the code, ensuring designers always work with production-ready components.

The impact has been dramatic: development time for new features decreased by 60%, design-to-development handoff issues dropped by 80%, and accessibility audit scores improved from an average of 72% to 94%.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['Figma', 'React', 'Storybook', 'Design Tokens', 'TypeScript'],
                    features: [
                        '200+ production-ready components',
                        'WCAG 2.1 AA accessibility compliance',
                        'Dark mode support for all components',
                        'Token-based theming system',
                        'Figma design kit with sync plugin',
                        'Comprehensive documentation and usage guidelines',
                        'Automated visual regression testing',
                        'TypeScript support with full type definitions'
                    ],
                    demo_url: null,
                    github_url: null,
                    launch_date: '2023-09-10',
                    year: '2023'
                },
                'saas-dashboard': {
                    id: 4,
                    slug: 'saas-dashboard',
                    title: 'Analytics Dashboard',
                    category: 'Web Application',
                    description: 'Built real-time analytics platform processing 10M+ events daily. Helping 200+ businesses make data-driven decisions.',
                    full_description: `A powerful real-time analytics platform designed for businesses that need to make fast, data-driven decisions. The platform processes over 10 million events per day and provides insights with sub-second latency.

The dashboard features custom data visualization tools built with D3.js, allowing users to create exactly the charts and reports they need. Collaborative workspaces enable teams to share insights, annotate findings, and build shared understanding of key metrics.

Automated reporting sends scheduled updates to stakeholders, with smart alerts that notify teams when metrics deviate from expected ranges. The platform also includes a powerful query builder that lets non-technical users explore data without writing SQL.

Today, over 200 businesses rely on the platform to track everything from marketing performance to operational efficiency. Users report that data-driven decisions now happen 3x faster than before.`,
                    image_url: '/images/placeholder.svg',
                    gallery: [
                        '/images/placeholder.svg',
                        '/images/placeholder.svg',
                        '/images/placeholder.svg'
                    ],
                    technologies: ['Vue.js', 'D3.js', 'GraphQL', 'AWS', 'Lambda'],
                    features: [
                        'Real-time event processing (10M+ events/day)',
                        'Custom data visualizations with D3.js',
                        'Collaborative workspaces for team insights',
                        'Automated scheduled reporting',
                        'Smart metric alerts and anomaly detection',
                        'Visual query builder for non-technical users',
                        'API for custom integrations',
                        'Role-based access control'
                    ],
                    demo_url: null,
                    github_url: null,
                    launch_date: '2023-06-18',
                    year: '2023'
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