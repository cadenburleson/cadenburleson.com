import { supabase } from '../main.js';

export async function renderHomePage(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="rm-hero">
      <div class="rm-container">
        <div class="rm-hero-content">
          <div class="rm-hero-badge">
            <span class="badge-icon">⚡</span>
            <span>Available for Select Projects</span>
          </div>
          <h1 class="rm-hero-title">
            Ship Products That Convert & Scale
          </h1>
          <p class="rm-hero-subtitle">
            Transform ideas into high-converting digital experiences
          </p>
          <p class="rm-hero-description">
            I partner with ambitious teams to design and build products that users love. From concept to launch, get pixel-perfect interfaces that drive real business results—without the endless revisions.
          </p>
          <div class="rm-hero-cta">
            <a href="/projects" class="rm-btn rm-btn-primary">
              <span class="btn-icon">🚀</span>
              View My Work
            </a>
            <a href="/contact" class="rm-btn rm-btn-secondary">
              <span class="btn-icon">💬</span>
              Start a Project
            </a>
          </div>

          <!-- Hero Visual/Mockup -->
          <div class="rm-hero-visual">
            <div class="visual-card visual-card-1">
              <div class="card-icon">🎨</div>
              <div class="card-label">Design</div>
            </div>
            <div class="visual-card visual-card-2">
              <div class="card-icon">⚙️</div>
              <div class="card-label">Build</div>
            </div>
            <div class="visual-card visual-card-3">
              <div class="card-icon">📈</div>
              <div class="card-label">Scale</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="rm-social-proof">
      <div class="rm-container">
        <p class="social-proof-label">Trusted by teams from</p>
        <div class="social-proof-logos">
          <div class="proof-logo">🏢 Startups</div>
          <div class="proof-logo">🚀 Scale-ups</div>
          <div class="proof-logo">🏆 Enterprises</div>
          <div class="proof-logo">💡 Agencies</div>
        </div>
      </div>
    </section>

    <!-- Key Features -->
    <section class="rm-features">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Everything You Need to Win</h2>
          <p class="rm-section-description">
            End-to-end product development that covers every detail
          </p>
        </div>
        <div class="rm-features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Strategic Design</h3>
            <p class="feature-description">User research and market analysis that uncover the insights competitors miss</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3 class="feature-title">Beautiful UI/UX</h3>
            <p class="feature-description">Interfaces so intuitive, your users won't need a manual. So polished, they'll screenshot it.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Fast Development</h3>
            <p class="feature-description">Modern tech stack. Clean code. Shipped on time, every time.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Responsive Design</h3>
            <p class="feature-description">Pixel-perfect on every device. Desktop, tablet, mobile—it all just works.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Production Ready</h3>
            <p class="feature-description">Security best practices, accessibility compliance, and performance optimized out of the box.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Design Systems</h3>
            <p class="feature-description">Scalable component libraries that make your team move 10x faster.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="rm-solution">
      <div class="rm-container">
        <div class="rm-solution-content">
          <div class="rm-solution-text">
            <div class="rm-card-label">The Solution</div>
            <h2 class="rm-section-title">See Your Product Come to Life</h2>
            <p class="rm-section-description">
              From wireframes to pixel-perfect prototypes, watch your vision transform into an interface that users love. Every interaction, every animation, every detail crafted for maximum impact.
            </p>
            <ul class="solution-features">
              <li><span class="check-icon">✓</span> Interactive prototypes you can click through</li>
              <li><span class="check-icon">✓</span> Real-time collaboration and feedback</li>
              <li><span class="check-icon">✓</span> Developer handoff with design specs</li>
              <li><span class="check-icon">✓</span> Unlimited revisions until it's perfect</li>
            </ul>
          </div>
          <div class="rm-solution-visual">
            <div class="solution-mockup">
              <div class="mockup-header">
                <div class="mockup-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div class="mockup-content">
                <div class="mockup-grid">
                  <div class="mockup-box box-1"></div>
                  <div class="mockup-box box-2"></div>
                  <div class="mockup-box box-3"></div>
                  <div class="mockup-box box-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="rm-stats">
      <div class="rm-container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">Projects Shipped</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100%</div>
            <div class="stat-label">Client Satisfaction</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">2-4wks</div>
            <div class="stat-label">Average Delivery</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Support Available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="rm-benefits">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Why Work With Me?</h2>
          <p class="rm-section-description">
            Features tell, but benefits sell. Here's what you actually get.
          </p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon gradient-primary">💰</div>
            <h3 class="benefit-title">Save Money</h3>
            <p class="benefit-description">Get senior-level design and development for the cost of one hire. No overhead, no benefits, no office space.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon gradient-secondary">⏱️</div>
            <h3 class="benefit-title">Ship Faster</h3>
            <p class="benefit-description">Skip the learning curve. I've built this before. Get to market 3x faster than an in-house team.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon gradient-accent">🎯</div>
            <h3 class="benefit-title">Reduce Risk</h3>
            <p class="benefit-description">Validate your idea with prototypes before you commit. Make data-driven decisions, not expensive guesses.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon gradient-warm">📈</div>
            <h3 class="benefit-title">Increase Conversions</h3>
            <p class="benefit-description">Every pixel is designed to convert. Expect higher engagement, lower bounce rates, and better metrics.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="rm-how-it-works">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">How It Works</h2>
          <p class="rm-section-description">
            A simple, proven process that gets results
          </p>
        </div>
        <div class="steps-container">
          <div class="step-item">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3 class="step-title">Discovery Call</h3>
              <p class="step-description">We discuss your goals, timeline, and vision. I ask the right questions to understand what success looks like.</p>
            </div>
            <div class="step-icon">📞</div>
          </div>
          <div class="step-divider"></div>
          <div class="step-item">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3 class="step-title">Research & Strategy</h3>
              <p class="step-description">Deep dive into your users, competitors, and market. Create a roadmap that aligns design with business goals.</p>
            </div>
            <div class="step-icon">🔍</div>
          </div>
          <div class="step-divider"></div>
          <div class="step-item">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3 class="step-title">Design & Build</h3>
              <p class="step-description">Rapid prototyping, weekly check-ins, and continuous feedback. You're involved every step of the way.</p>
            </div>
            <div class="step-icon">⚙️</div>
          </div>
          <div class="step-divider"></div>
          <div class="step-item">
            <div class="step-number">04</div>
            <div class="step-content">
              <h3 class="step-title">Launch & Support</h3>
              <p class="step-description">Smooth deployment, team training, and post-launch optimization. Your success is my success.</p>
            </div>
            <div class="step-icon">🚀</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integrations / Tech Stack -->
    <section class="rm-integrations">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Built With Modern Tools</h2>
          <p class="rm-section-description">
            The tech stack that powers exceptional products
          </p>
        </div>
        <div class="integrations-grid">
          <div class="integration-item">⚛️ React</div>
          <div class="integration-item">🎨 Figma</div>
          <div class="integration-item">📱 React Native</div>
          <div class="integration-item">⚡ Vite</div>
          <div class="integration-item">🎭 TypeScript</div>
          <div class="integration-item">🌊 Tailwind</div>
          <div class="integration-item">🔥 Supabase</div>
          <div class="integration-item">📊 Analytics</div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="rm-testimonials">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">What Clients Say</h2>
          <p class="rm-section-description">
            Real results from real partnerships
          </p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Caden transformed our MVP into a product users actually want to pay for. Revenue up 300% in 2 months."</p>
            <div class="testimonial-author">
              <div class="author-avatar gradient-primary"></div>
              <div>
                <div class="author-name">Sarah Chen</div>
                <div class="author-title">CEO, TechStart</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"The fastest designer I've ever worked with. Beautiful work, on time, every time. Feels like having a co-founder."</p>
            <div class="testimonial-author">
              <div class="author-avatar gradient-secondary"></div>
              <div>
                <div class="author-name">Marcus Rodriguez</div>
                <div class="author-title">Founder, GrowthLab</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Our conversion rate doubled after the redesign. The attention to detail is unmatched. Worth every penny."</p>
            <div class="testimonial-author">
              <div class="author-avatar gradient-accent"></div>
              <div>
                <div class="author-name">Emily Watson</div>
                <div class="author-title">VP Product, ScaleApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="rm-faq">
      <div class="rm-container">
        <div class="rm-section-header">
          <h2 class="rm-section-title">Common Questions</h2>
          <p class="rm-section-description">
            Everything you need to know before we start
          </p>
        </div>
        <div class="faq-grid">
          <div class="faq-item">
            <h3 class="faq-question">How long does a typical project take?</h3>
            <p class="faq-answer">Most projects ship in 2-4 weeks depending on scope. Simple landing pages can be done in days. Complex apps take longer. We'll set clear timelines upfront.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">What's your pricing structure?</h3>
            <p class="faq-answer">Project-based pricing starting at $5k for landing pages, $15k+ for full products. I'll send a detailed proposal after our discovery call.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">Do you work with startups?</h3>
            <p class="faq-answer">Absolutely! I love working with ambitious founders. Whether you're pre-seed or Series A, if you're building something great, let's talk.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">Can you help with ongoing work?</h3>
            <p class="faq-answer">Yes! I offer retainer packages for teams that need consistent design and development support. Perfect for post-launch iterations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="rm-cta">
      <div class="rm-container">
        <div class="rm-cta-content">
          <h2 class="rm-cta-title">Ready to Ship Your Best Product Yet?</h2>
          <p class="rm-cta-description">
            Stop settling for mediocre. Let's build something users love.
          </p>
          <div class="cta-buttons">
            <a href="/contact" class="rm-btn rm-btn-primary rm-btn-large">
              <span class="btn-icon">🚀</span>
              Start Your Project
            </a>
            <a href="/projects" class="rm-btn rm-btn-secondary rm-btn-large">
              <span class="btn-icon">👀</span>
              View Case Studies
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="rm-footer">
      <div class="rm-container">
        <div class="footer-content">
          <div class="footer-links">
            <a href="/projects">Work</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
          </div>
          <div class="footer-social">
            <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          </div>
          <div class="footer-copy">
            <p>© 2025 Caden Burleson. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `;
} 