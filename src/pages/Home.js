export function renderHomePage(container) {
    container.innerHTML = `
    <section class="intro-section">
      <div class="intro-text">
        From post-it notes to full on SaaS products, I have the skills to bring your ideas to life. 
        I harness the newest technologies that are on the cutting edge of the industry. 
        Soaking in the latest trends and best practices to deliver the best possible results.
      </div>
      <div class="contact-block">
        <a href="/contact">CONTACT</a>
      </div>
    </section>
    
    <section id="projects-preview">
      <h1 class="projects-heading">PROJECTS</h1>
      <div class="project-grid">
        <div class="project-card">
          <img src="/images/placeholder.svg" alt="Fitnit Fitness App" class="project-card-image">
          <div class="card-label">Fitness App</div>
          <div class="project-card-content">
            <div class="project-title">FITNIT</div>
            <div class="project-description">AUTOMATICALLY TRACK YOUR REPS DOING VARIOUS EXERCISES.</div>
            <a href="/projects/fitnit" class="project-link">VIEW PROJECT</a>
          </div>
        </div>
        <div class="project-card">
          <img src="/images/placeholder.svg" alt="Writerly Writing App" class="project-card-image">
          <div class="card-label">Writing App</div>
          <div class="project-card-content">
            <div class="project-title">WRITERLY</div>
            <div class="project-description">A MINIMALIST TOOL FOR WRITERS TO ORGANIZE THEIR THOUGHTS.</div>
            <a href="/projects/writerly" class="project-link">VIEW PROJECT</a>
          </div>
        </div>
        <div class="project-card">
          <img src="/images/placeholder.svg" alt="Retro RPG Game" class="project-card-image">
          <div class="card-label">Game</div>
          <div class="project-card-content">
            <div class="project-title">RETRO RPG</div>
            <div class="project-description">AN OLD-SCHOOL ROLE PLAYING GAME WITH MODERN MECHANICS.</div>
            <a href="/projects/retro-rpg" class="project-link">VIEW PROJECT</a>
          </div>
        </div>
      </div>
      <div class="view-all-projects">
        <a href="/projects">VIEW ALL PROJECTS</a>
      </div>
    </section>
  `;

    // Add minimal interactivity
    const contactLink = container.querySelector('.contact-block a');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/contact');
            document.dispatchEvent(new CustomEvent('route-changed'));
        });
    }
} 