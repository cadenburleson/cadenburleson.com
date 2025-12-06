import { supabase } from '../main.js';

export async function renderAboutPage(container) {
  container.innerHTML = `
    <!-- About Hero Section -->
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">About</h1>
          <p class="rm-page-description">
            Product designer and developer focused on creating exceptional digital experiences
          </p>
        </div>

        <div class="rm-about-content">
          <div class="rm-about-intro">
            <p class="rm-about-lead">
              I'm a product designer and full-stack developer who bridges the gap between design and engineering.
              With over 8 years of experience, I've helped startups and established companies build products that
              users love and businesses depend on.
            </p>
          </div>

          <div class="rm-about-grid">
            <div class="rm-about-section">
              <h2 class="rm-about-section-title">Background</h2>
              <p class="rm-about-text">
                My journey started in design but quickly expanded to include development. I believe the best
                digital products come from understanding both disciplines deeply—knowing what's possible
                technically while maintaining unwavering focus on user needs.
              </p>
              <p class="rm-about-text">
                Over the years, I've worked across industries—from fintech and healthcare to e-commerce and
                SaaS—always with the same goal: create products that solve real problems elegantly.
              </p>
            </div>

            <div class="rm-about-section">
              <h2 class="rm-about-section-title">Approach</h2>
              <p class="rm-about-text">
                I start every project with deep user research and strategic thinking. Understanding the problem
                thoroughly is the foundation for great design. From there, I move quickly through iterative
                prototyping and testing, refining until we have something that truly works.
              </p>
              <p class="rm-about-text">
                On the development side, I prioritize clean, maintainable code and modern best practices.
                Performance, accessibility, and scalability aren't afterthoughts—they're built in from day one.
              </p>
            </div>
          </div>

          <div class="rm-about-skills">
            <h2 class="rm-about-section-title">Skills & Expertise</h2>

            <div class="rm-skills-grid">
              <div class="rm-skill-category">
                <h3 class="rm-skill-category-title">Design</h3>
                <ul class="rm-skill-list">
                  <li>User Research & Testing</li>
                  <li>UI/UX Design</li>
                  <li>Design Systems</li>
                  <li>Prototyping</li>
                  <li>Information Architecture</li>
                  <li>Interaction Design</li>
                </ul>
              </div>

              <div class="rm-skill-category">
                <h3 class="rm-skill-category-title">Development</h3>
                <ul class="rm-skill-list">
                  <li>React & Vue.js</li>
                  <li>Node.js & Express</li>
                  <li>TypeScript</li>
                  <li>REST & GraphQL APIs</li>
                  <li>PostgreSQL & MongoDB</li>
                  <li>AWS & Cloud Services</li>
                </ul>
              </div>

              <div class="rm-skill-category">
                <h3 class="rm-skill-category-title">Tools</h3>
                <ul class="rm-skill-list">
                  <li>Figma & Sketch</li>
                  <li>Git & GitHub</li>
                  <li>Storybook</li>
                  <li>Jest & Testing Library</li>
                  <li>Docker</li>
                  <li>CI/CD Pipelines</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="rm-about-values">
            <h2 class="rm-about-section-title">Values</h2>
            <div class="rm-values-grid">
              <div class="rm-value-card">
                <h3>User-Centered</h3>
                <p>Every decision starts with understanding user needs and validating assumptions through research and testing.</p>
              </div>
              <div class="rm-value-card">
                <h3>Quality Focused</h3>
                <p>Attention to detail matters. From pixel-perfect interfaces to clean, maintainable code—quality is non-negotiable.</p>
              </div>
              <div class="rm-value-card">
                <h3>Collaborative</h3>
                <p>The best work happens when design and development work together, involving stakeholders throughout the process.</p>
              </div>
              <div class="rm-value-card">
                <h3>Pragmatic</h3>
                <p>Beautiful design must meet business goals and technical constraints. I balance idealism with practical reality.</p>
              </div>
            </div>
          </div>

          <div class="rm-about-cta">
            <h2 class="rm-about-section-title">Let's Work Together</h2>
            <p class="rm-about-text">
              I'm always interested in new projects and collaborations. Whether you need a complete product
              design, development support, or strategic guidance—let's talk.
            </p>
            <div class="rm-about-cta-buttons">
              <a href="/contact" class="rm-btn rm-btn-primary rm-btn-large">Get in Touch</a>
              <a href="/projects" class="rm-btn rm-btn-secondary rm-btn-large">View My Work</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
