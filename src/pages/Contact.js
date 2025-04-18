import { supabase } from '../main.js';

export function renderContactPage(container) {
    container.innerHTML = `
    <section class="contact-section">
      <div class="container">
        <h1 class="page-title">CONTACT</h1>
        
        <div class="contact-content">
          <div class="contact-info">
            <h2>Let's Work Together</h2>
            <p>
              Have a project in mind or just want to say hello? I'd love to hear from you!
              Fill out the form, and I'll get back to you as soon as possible.
            </p>
            
            <div class="contact-details">
              <div class="contact-item">
                <div class="contact-icon">📧</div>
                <div class="contact-text">
                  <h3>Email</h3>
                  <p>hello@cadenburleson.com</p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <div class="contact-text">
                  <h3>Location</h3>
                  <p>San Francisco, CA</p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">🔗</div>
                <div class="contact-text">
                  <h3>Social</h3>
                  <div class="social-links">
                    <a href="https://github.com/cadenburleson" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://linkedin.com/in/cadenburleson" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://twitter.com/cadenburleson" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-form-container">
            <form id="contact-form" class="contact-form">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              
              <button type="submit" class="submit-btn">Send Message</button>
            </form>
            <div id="form-status" class="form-status"></div>
          </div>
        </div>
      </div>
    </section>
  `;

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !subject || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.classList.add('error');
                return;
            }

            // Disable form while submitting
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.classList.remove('success', 'error');

            try {
                // Check if Supabase is initialized
                if (supabase) {
                    // Submit to Supabase
                    const { error } = await supabase
                        .from('contact_messages')
                        .insert([
                            { name, email, subject, message }
                        ]);

                    if (error) throw error;
                } else {
                    // Mock submission when Supabase is not available
                    console.log('Form would be submitted with:', { name, email, subject, message });
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Success
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formStatus.classList.add('success');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.textContent = 'There was an error sending your message. Please try again later.';
                formStatus.classList.add('error');
            } finally {
                // Re-enable form
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
} 