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
  // Get unique categories from actual posts
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];

  console.log('Rendering posts:', posts);

  const postsHTML = posts.map(post => {
    // Generate the slug from the title if it doesn't exist
    const slug = post.slug || post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    console.log(`Post "${post.title}" has slug: ${slug}`);

    return `
      <article class="blog-card">
        <div class="blog-card-image">
          <img src="${post.image_url || '/images/placeholder.svg'}" alt="${post.title}">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-category">${post.category || 'Uncategorized'}</span>
            <span class="blog-date">${new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
          </div>
          <h2 class="blog-title"><a href="/blog/${slug}">${post.title}</a></h2>
          <p class="blog-excerpt">${post.excerpt || ''}</p>
          <a href="/blog/${slug}" class="read-more">READ MORE</a>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = `
    <section class="blog-section">
      <div class="container">
        <h1 class="page-title">BLOG</h1>
        
        <div class="blog-categories">
          <button class="category-btn active" data-category="all">ALL</button>
          ${categories.map(category => `
            <button class="category-btn" data-category="${category}">${category}</button>
          `).join('')}
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

export async function renderBlogPostPage(container, slug) {
  console.log('Attempting to load blog post with slug:', slug);

  // Show loading state
  container.innerHTML = `
    <section class="blog-post-section">
      <div class="container">
        <div class="loading-indicator">Loading blog post...</div>
      </div>
    </section>
  `;

  try {
    let post = null;

    // Check if supabase is initialized before trying to use it
    if (!supabase) {
      throw new Error('Supabase is not initialized');
    }

    // First, let's log all posts to see what we have
    const { data: allPosts, error: allPostsError } = await supabase
      .from('blog_posts')
      .select('*');

    if (allPostsError) {
      console.error('Error fetching all posts:', allPostsError);
    } else {
      console.log('All available posts:', allPosts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category
      })));
    }

    // Try to find the post by slug
    console.log('Searching for post with slug:', slug);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching post by slug:', error);

      // If no post found by slug, try to find it by generating slug from title
      console.log('Trying to find post by matching title...');
      const { data: titleMatchPosts, error: titleMatchError } = await supabase
        .from('blog_posts')
        .select('*');

      if (!titleMatchError && titleMatchPosts) {
        post = titleMatchPosts.find(p => {
          const generatedSlug = p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          console.log(`Comparing ${generatedSlug} with ${slug}`);
          return generatedSlug === slug;
        });

        if (post) {
          console.log('Found post by title match:', post.title);
        }
      }
    } else {
      post = data;
      console.log('Found post by slug:', post?.title);
    }

    if (!post) {
      console.log('No post found for slug:', slug);
      container.innerHTML = `
        <section class="blog-post-section">
          <div class="container">
            <h1>Post Not Found</h1>
            <p>The blog post you're looking for doesn't exist.</p>
            <p class="error-details">Looking for slug: ${slug}</p>
            <a href="/blog" class="button">Back to Blog</a>
          </div>
        </section>
      `;
      return;
    }

    // Format date
    const publishedDate = post.published_at || post.created_at;
    const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Render the blog post
    container.innerHTML = `
      <section class="blog-post-section">
        <div class="container">
          <div class="blog-post-header">
            <a href="/blog" class="back-link">← Back to Blog</a>
            <h1 class="blog-post-title">${post.title}</h1>
            <div class="blog-post-meta">
              <span class="blog-post-category">${post.category || 'Uncategorized'}</span>
              <span class="blog-post-date">${formattedDate}</span>
            </div>
          </div>
          ${post.image_url ? `
            <div class="blog-post-image">
              <img src="${post.image_url}" alt="${post.title}">
            </div>
          ` : ''}
          <div class="blog-post-content">
            ${post.content || ''}
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    console.error('Error rendering blog post:', error);
    container.innerHTML = `
      <section class="blog-post-section">
        <div class="container">
          <h1>Error</h1>
          <p>Failed to load the blog post. Please try again later.</p>
          <p class="error-details">Error: ${error.message}</p>
          <a href="/blog" class="button">Back to Blog</a>
        </div>
      </section>
    `;
  }
} 