export function renderNavigation(currentPath) {
  const nav = document.createElement('header');
  nav.innerHTML = `
    <div class="logo">
      <a href="/">CADEN<br>BURLESON</a>
    </div>
    <nav>
      <ul>
        <li><a href="/about" class="${currentPath === '/about' ? 'active' : ''}">ABOUT</a></li>
        <li><a href="/projects" class="${currentPath === '/projects' ? 'active' : ''}">PROJECTS</a></li>
        <li><a href="/blog" class="${currentPath === '/blog' ? 'active' : ''}">BLOG</a></li>
      </ul>
    </nav>
  `;
  return nav;
} 