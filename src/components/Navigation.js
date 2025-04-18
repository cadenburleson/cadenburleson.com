export function renderNavigation(currentPath) {
    const nav = document.createElement('header');
    nav.innerHTML = `
    <div class="logo">
      <a href="/">CB</a>
    </div>
    <nav>
      <ul>
        <li><a href="/" class="${currentPath === '/' ? 'active' : ''}">Home</a></li>
        <li><a href="#about" class="${currentPath === '/about' ? 'active' : ''}">About</a></li>
        <li><a href="#projects" class="${currentPath === '/projects' ? 'active' : ''}">Projects</a></li>
        <li><a href="#blog" class="${currentPath === '/blog' ? 'active' : ''}">Blog</a></li>
      </ul>
    </nav>
  `;
    return nav;
} 