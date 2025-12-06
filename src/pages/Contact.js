import { supabase } from '../main.js';

export async function renderContactPage(container) {
  container.innerHTML = `
    <!-- Contact Page -->
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">Get in Touch</h1>
          <p class="rm-page-description">
            Let's discuss your project and how we can work together
          </p>
        </div>

        <div class="rm-contact-content">
          <div class="rm-contact-grid">
            <div class="rm-contact-info">
              <h2 class="rm-contact-section-title">Contact Information</h2>

              <div class="rm-contact-methods">
                <div class="rm-contact-method">
                  <div class="rm-contact-icon">✉️</div>
                  <div class="rm-contact-details">
                    <h3>Email</h3>
                    <a href="mailto:hello@example.com" class="rm-contact-link">hello@example.com</a>
                  </div>
                </div>

                <div class="rm-contact-method">
                  <div class="rm-contact-icon">💼</div>
                  <div class="rm-contact-details">
                    <h3>LinkedIn</h3>
                    <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" class="rm-contact-link">linkedin.com/in/yourprofile</a>
                  </div>
                </div>

                <div class="rm-contact-method">
                  <div class="rm-contact-icon">🐙</div>
                  <div class="rm-contact-details">
                    <h3>GitHub</h3>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" class="rm-contact-link">github.com/yourusername</a>
                  </div>
                </div>

                <div class="rm-contact-method">
                  <div class="rm-contact-icon">🐦</div>
                  <div class="rm-contact-details">
                    <h3>Twitter</h3>
                    <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" class="rm-contact-link">@yourhandle</a>
                  </div>
                </div>
              </div>

              <div class="rm-contact-availability">
                <h3 class="rm-contact-subsection-title">Availability</h3>
                <p class="rm-contact-text">
                  Currently available for select projects starting Q1 2024. I typically respond to
                  inquiries within 24-48 hours.
                </p>
              </div>

              <div class="rm-contact-types">
                <h3 class="rm-contact-subsection-title">Project Types</h3>
                <ul class="rm-contact-list">
                  <li>Product Design & Strategy</li>
                  <li>Full-Stack Development</li>
                  <li>Design Systems</li>
                  <li>UX Research & Testing</li>
                  <li>Technical Consulting</li>
                  <li>Workshops & Training</li>
                </ul>
              </div>
            </div>

            <div class="rm-contact-form-container">
              <h2 class="rm-contact-section-title">Send a Message</h2>
              <form class="rm-contact-form" id="contact-form">
                <div class="rm-form-group">
                  <label for="name" class="rm-form-label">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    class="rm-form-input"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div class="rm-form-group">
                  <label for="email" class="rm-form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    class="rm-form-input"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div class="rm-form-group">
                  <label for="company" class="rm-form-label">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    class="rm-form-input"
                    placeholder="Your company name"
                  />
                </div>

                <div class="rm-form-group">
                  <label for="project-type" class="rm-form-label">Project Type</label>
                  <select id="project-type" name="project-type" class="rm-form-select">
                    <option value="">Select a type</option>
                    <option value="design">Product Design</option>
                    <option value="development">Development</option>
                    <option value="both">Design & Development</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div class="rm-form-group">
                  <label for="budget" class="rm-form-label">Budget Range</label>
                  <select id="budget" name="budget" class="rm-form-select">
                    <option value="">Select a range</option>
                    <option value="under-10k">Under $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="over-100k">Over $100,000</option>
                  </select>
                </div>

                <div class="rm-form-group">
                  <label for="message" class="rm-form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    class="rm-form-textarea"
                    rows="6"
                    required
                    placeholder="Tell me about your project, timeline, and what you're hoping to achieve..."
                  ></textarea>
                </div>

                <button type="submit" class="rm-btn rm-btn-primary rm-btn-large rm-form-submit">
                  Send Message
                </button>

                <p class="rm-form-note">
                  * Required fields. Your information will never be shared with third parties.
                </p>

                <div id="form-status" class="rm-form-status"></div>
              </form>
            </div>
          </div>

          <div class="rm-contact-faq">
            <h2 class="rm-contact-section-title">Frequently Asked Questions</h2>
            <div class="rm-faq-grid">
              <div class="rm-faq-item">
                <h3 class="rm-faq-question">What's your typical project timeline?</h3>
                <p class="rm-faq-answer">
                  Most projects take 6-12 weeks from kickoff to delivery, depending on scope. I can provide
                  a detailed timeline after our initial consultation.
                </p>
              </div>

              <div class="rm-faq-item">
                <h3 class="rm-faq-question">Do you work with startups?</h3>
                <p class="rm-faq-answer">
                  Absolutely! I love working with early-stage companies to define their product vision and
                  build MVPs. I can adapt my process to fit startup constraints and timelines.
                </p>
              </div>

              <div class="rm-faq-item">
                <h3 class="rm-faq-question">What's your process like?</h3>
                <p class="rm-faq-answer">
                  I start with discovery and research, move into design and prototyping, then development and
                  testing. Throughout, we'll have regular check-ins and I'll keep you involved in key decisions.
                </p>
              </div>

              <div class="rm-faq-item">
                <h3 class="rm-faq-question">Do you offer ongoing support?</h3>
                <p class="rm-faq-answer">
                  Yes! Many clients continue working with me on a retainer basis for ongoing improvements,
                  new features, and support after the initial project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add form submission handler
  setTimeout(() => {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.rm-form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'rm-form-status';

        // Get form data
        const formData = new FormData(form);
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          company: formData.get('company'),
          project_type: formData.get('project-type'),
          budget: formData.get('budget'),
          message: formData.get('message'),
          created_at: new Date().toISOString()
        };

        try {
          // Try to save to Supabase if available
          if (supabase) {
            const { error } = await supabase
              .from('contact_messages')
              .insert([data]);

            if (error) {
              console.error('Error saving to database:', error);
            }
          }

          // Show success message
          formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
          formStatus.classList.add('success');
          form.reset();
        } catch (error) {
          console.error('Error submitting form:', error);
          formStatus.textContent = 'There was an error sending your message. Please try again.';
          formStatus.classList.add('error');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }
  }, 100);
}
