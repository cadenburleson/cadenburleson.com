export function renderAboutPage(container) {
  container.innerHTML = `
    <section class="about-section">
      <div class="container">
        <h1 class="page-title">ABOUT ME</h1>
        
        <div class="about-content">
          <div class="about-image">
            <img src="/images/about-pic1.png" alt="Caden Burleson" />
          </div>
          
          <div class="about-text">
            <h2>Hello, I'm Caden Burleson</h2>
            <p>
              I'm a multi-disciplinary creator with a passion for building digital experiences that make a difference.
              With expertise spanning web development, writing, editing, and game development, I bring a unique blend of
              technical skills and creative thinking to every project.
            </p>
            
            <h3>My Approach</h3>
            <p>
              I believe in creating solutions that are not only functional but also intuitive and enjoyable to use.
              By staying current with industry trends and technologies, I ensure that my work is always at the cutting edge.
            </p>
            
            <h3>Skills & Expertise</h3>
            <ul class="skills-list">
              <li>Front-end Development (React, Vue, Vanilla JS)</li>
              <li>Back-end Development (Node.js, Express, Supabase)</li>
              <li>Game Development (Unity, Godot)</li>
              <li>Content Creation & Editing</li>
              <li>User Experience Design</li>
              <li>Project Management</li>
            </ul>
            
            <h3>Education</h3>
            <p>
              Bachelor of Arts in Creative Writing & Computer Science<br>
              University of Technology, Class of 2020
            </p>
            
            <div class="cta-section">
              <a href="/contact" class="cta-button">Get in Touch</a>
              <a href="/projects" class="cta-button secondary">View My Work</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
} 