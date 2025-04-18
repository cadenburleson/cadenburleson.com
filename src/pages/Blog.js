import { supabase } from '../main.js';

export async function renderBlogPage(container) {
    // Show loading state
    container.innerHTML = `
    <section class="blog-section">
      <div class="container">
        <h1 class="page-title">BLOG</h1>
        <div class="loading-indicator">Loading blog posts...</div>
      </div>
    </section>
  `;

    try {
        let posts = null;

        // Check if supabase is initialized before trying to use it
        if (supabase) {
            // Fetch blog posts from Supabase
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) {
                throw error;
            }

            posts = data;
        } else {
            console.log('Supabase not initialized, using mock data');
        }

        // If supabase is not initialized or there are no posts in the database, use mock data
        if (!posts || posts.length === 0) {
            const mockPosts = [
                {
                    id: 1,
                    title: 'The Evolution of Web Development: Past, Present, and Future',
                    slug: 'evolution-of-web-development',
                    excerpt: 'A look at how web development has changed over the years and what might be coming next.',
                    content: `# The Evolution of Web Development

## The Early Days

When the web first began, sites were simple HTML documents with basic styling. Developers had limited tools and browser compatibility was a constant concern.

## The Rise of JavaScript Frameworks

As JavaScript became more powerful, frameworks like React, Vue, and Angular revolutionized the way we build web applications. These tools enabled more interactive and responsive user experiences.

## What's Next?

Looking to the future, WebAssembly, AI integration, and new CSS capabilities are poised to take web development to the next level. The distinction between web and native applications continues to blur.`,
                    image_url: '/images/placeholder.svg',
                    published_at: '2023-06-15',
                    category: 'Web Development',
                    author: 'Caden Burleson'
                },
                {
                    id: 2,
                    title: 'Getting Started with Game Development in 2023',
                    slug: 'game-development-beginners-guide',
                    excerpt: 'A beginner-friendly guide to starting your game development journey in 2023.',
                    content: `# Getting Started with Game Development

## Choosing Your Engine

For beginners, engines like Unity, Godot, or GameMaker Studio provide great entry points with extensive documentation and communities.

## Learning the Fundamentals

Understanding core concepts like game loops, collision detection, and state management will serve you regardless of the platform you choose.

## Building Your First Game

Start small with classics like Pong or Breakout. Complete a simple project before moving on to more ambitious ideas.`,
                    image_url: '/images/placeholder.svg',
                    published_at: '2023-04-22',
                    category: 'Game Development',
                    author: 'Caden Burleson'
                },
                {
                    id: 3,
                    title: "The Writer's Toolkit: Software for Creative Writing",
                    slug: 'writers-toolkit-software',
                    excerpt: 'A roundup of the best software tools for writers in 2023.',
                    content: `# The Writer's Toolkit: Software for Creative Writing

## Writing Environments

From minimalist options like iA Writer to feature-rich platforms like Scrivener, choosing the right writing environment can significantly impact your productivity.

## Organization Tools

Keeping track of characters, plots, and research is essential for longer projects. Tools like Notion, Airtable, or dedicated software like World Anvil can help.

## Editing and Feedback

Grammarly, ProWritingAid, and Hemingway Editor offer different approaches to helping you refine your writing.`,
                    image_url: '/images/placeholder.svg',
                    published_at: '2023-02-07',
                    category: 'Writing',
                    author: 'Caden Burleson'
                }
            ];
            renderBlogPosts(container, mockPosts);
        } else {
            renderBlogPosts(container, posts);
        }
    } catch (error) {
        container.innerHTML = `
      <section class="blog-section">
        <div class="container">
          <h1 class="page-title">BLOG</h1>
          <div class="error-message">
            <p>Failed to load blog posts. Please try again later.</p>
            <p>Error: ${error.message}</p>
          </div>
        </div>
      </section>
    `;
        console.error('Error fetching blog posts:', error);
    }
}

function renderBlogPosts(container, posts) {
    const postsHTML = posts.map(post => `
    <article class="blog-card">
      <div class="blog-card-image">
        <img src="${post.image_url}" alt="${post.title}">
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span class="blog-category">${post.category}</span>
          <span class="blog-date">${new Date(post.published_at).toLocaleDateString()}</span>
        </div>
        <h2 class="blog-title"><a href="/blog/${post.slug}">${post.title}</a></h2>
        <p class="blog-excerpt">${post.excerpt}</p>
        <a href="/blog/${post.slug}" class="read-more">Read More</a>
      </div>
    </article>
  `).join('');

    container.innerHTML = `
    <section class="blog-section">
      <div class="container">
        <h1 class="page-title">BLOG</h1>
        
        <div class="blog-categories">
          <button class="category-btn active" data-category="all">All</button>
          <button class="category-btn" data-category="Web Development">Web Dev</button>
          <button class="category-btn" data-category="Game Development">Game Dev</button>
          <button class="category-btn" data-category="Writing">Writing</button>
        </div>
        
        <div class="blog-grid">
          ${postsHTML}
        </div>
      </div>
    </section>
  `;

    // Add filter functionality
    const categoryButtons = container.querySelectorAll('.category-btn');
    const blogCards = container.querySelectorAll('.blog-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            blogCards.forEach(card => {
                const postCategory = card.querySelector('.blog-category').textContent;

                if (category === 'all') {
                    card.style.display = 'flex';
                } else if (postCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
} 