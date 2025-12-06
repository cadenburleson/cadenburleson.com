import { supabase } from '../main.js';

export async function renderHomePage(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="rm-hero">
      <div class="rm-hero-image">
        <div class="rm-hero-overlay"></div>
      </div>
      <div class="rm-container">
        <div class="rm-hero-content">
          <h1 class="rm-hero-title">
            Design products.<br>
            Build experiences.<br>
            Ship faster.
          </h1>
          <p class="rm-hero-description">
            Creating digital experiences that solve real problems and delight users through thoughtful design and modern technology.
          </p>
          <div class="rm-hero-cta">
            <a href="/projects" class="rm-btn rm-btn-primary">View Work</a>
            <a href="/contact" class="rm-btn rm-btn-secondary">Get in Touch</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Approach Section -->
    <section class="rm-approach">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Approach</h2>
          <p class="rm-section-description">
            Three pillars that drive exceptional design outcomes
          </p>
        </div>
        <div class="rm-cards">
          <div class="rm-card">
            <div class="rm-card-label">Research</div>
            <h3 class="rm-card-title">Understand the problem</h3>
            <p class="rm-card-description">
              Deep user research and market analysis to uncover insights that inform strategic design decisions.
            </p>
            <a href="#" class="rm-btn rm-btn-secondary rm-btn-small">Learn More</a>
          </div>
          <div class="rm-card">
            <div class="rm-card-label">Design</div>
            <h3 class="rm-card-title">Craft the solution</h3>
            <p class="rm-card-description">
              Iterate rapidly through prototypes and user testing to create intuitive, beautiful interfaces.
            </p>
            <a href="#" class="rm-btn rm-btn-secondary rm-btn-small">Learn More</a>
          </div>
          <div class="rm-card">
            <div class="rm-card-label">Deliver</div>
            <h3 class="rm-card-title">Build with precision</h3>
            <p class="rm-card-description">
              Work closely with development teams to ensure pixel-perfect implementation and seamless experiences.
            </p>
            <a href="#" class="rm-btn rm-btn-primary rm-btn-small">Learn More</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="rm-impact">
      <div class="rm-container">
        <div class="rm-impact-content">
          <div class="rm-impact-text">
            <h2 class="rm-impact-title">Designing for impact</h2>
            <p class="rm-impact-description">
              Every project is an opportunity to create meaningful change. From early-stage startups to established companies, I partner with teams to transform complex challenges into simple, elegant solutions.
            </p>
            <p class="rm-impact-description">
              My work spans web applications, mobile experiences, and design systems—always with a focus on usability, accessibility, and business outcomes.
            </p>
          </div>
          <div class="rm-impact-visual">
            <div class="rm-impact-image"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Section -->
    <section class="rm-work">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Selected Work</h2>
          <p class="rm-section-description">
            Recent projects that showcase my approach to design
          </p>
        </div>
        <div class="rm-work-grid">
          <a href="/projects" class="rm-work-item">
            <div class="rm-work-image"></div>
            <div class="rm-work-info">
              <h3 class="rm-work-title">E-commerce Platform</h3>
              <p class="rm-work-description">End-to-end redesign increasing conversion by 40%</p>
            </div>
          </a>
          <a href="/projects" class="rm-work-item">
            <div class="rm-work-image"></div>
            <div class="rm-work-info">
              <h3 class="rm-work-title">Mobile Banking App</h3>
              <p class="rm-work-description">Simplified financial management for modern users</p>
            </div>
          </a>
          <a href="/projects" class="rm-work-item">
            <div class="rm-work-image"></div>
            <div class="rm-work-info">
              <h3 class="rm-work-title">Design System</h3>
              <p class="rm-work-description">Scalable component library for enterprise software</p>
            </div>
          </a>
        </div>
        <div class="rm-work-cta">
          <a href="/projects" class="rm-btn rm-btn-primary">View All Projects</a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="rm-cta">
      <div class="rm-container">
        <div class="rm-cta-content">
          <h2 class="rm-cta-title">Let's build something together</h2>
          <p class="rm-cta-description">
            Currently available for select projects and collaborations
          </p>
          <a href="/contact" class="rm-btn rm-btn-primary rm-btn-large">Start a Conversation</a>
        </div>
      </div>
    </section>
  `;
} 