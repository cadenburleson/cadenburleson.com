import './style.css';

// Simple demo file with minimal dependencies
document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app');

    // Basic content
    app.innerHTML = `
    <header>
      <div class="logo">
        <a href="/">CADEN<br>BURLESON</a>
      </div>
      <nav>
        <ul>
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#blog">BLOG</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="intro-section">
        <div class="intro-text">
          From post-it notes to full on SaaS products, I have the skills to bring your ideas to life. 
          I harnes the newest technologies that are on the cutting edge of the industry. 
          Soaking in the latest trends and best practices to deliver the best possible results.
        </div>
        <div class="contact-block">
          <a href="#contact">CONTACT</a>
        </div>
      </section>
      
      <section id="projects">
        <h1 class="projects-heading">PROJECTS</h1>
        <div class="project-grid">
          <div class="project-card">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PC9zdmc+" alt="" class="project-card-image">
            <div class="card-label">Fitness App</div>
            <div class="project-card-content">
              <div class="project-title">FITNIT</div>
              <div class="project-description">AUTOMATICALLY TRACK YOUR REPS DOING VARIOUS EXERCISES.</div>
            </div>
          </div>
          <div class="project-card">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PC9zdmc+" alt="" class="project-card-image">
            <div class="card-label">Writing App</div>
            <div class="project-card-content">
              <div class="project-title">WRITERLY</div>
              <div class="project-description">A MINIMALIST TOOL FOR WRITERS TO ORGANIZE THEIR THOUGHTS.</div>
            </div>
          </div>
          <div class="project-card">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PC9zdmc+" alt="" class="project-card-image">
            <div class="card-label">Game</div>
            <div class="project-card-content">
              <div class="project-title">RETRO RPG</div>
              <div class="project-description">AN OLD-SCHOOL ROLE PLAYING GAME WITH MODERN MECHANICS.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

    // Add minimal interactivity
    const contactLink = document.querySelector('.contact-block a');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Contact form will be implemented soon');
        });
    }

    // Simplified navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Navigation to ${link.textContent} will be implemented soon`);
        });
    });
}); 