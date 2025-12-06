import { supabase } from '../main.js';
import { marked } from 'marked';

export async function renderBlogPage(container) {
  // Show loading state
  container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">Blog</h1>
          <p class="rm-page-description">Thoughts on design, development, and building products</p>
        </div>
      </div>
    </section>
  `;

  try {
    let posts = null;

    // Check if supabase is initialized before trying to use it
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts from Supabase:', error);
        // Don't throw - fall through to mock data instead
      } else {
        posts = data;
      }
    } else {
      console.log('Supabase not initialized, using mock data');
    }

    // If no posts in database, use mock data
    if (!posts || posts.length === 0) {
      const mockPosts = [
        {
          id: 1,
          title: 'Designing for Accessibility: Beyond Compliance',
          slug: 'designing-for-accessibility',
          excerpt: 'Why accessibility should be at the core of your design process, not an afterthought. Exploring practical strategies for creating inclusive digital experiences.',
          content: `# Designing for Accessibility: Beyond Compliance

Accessibility is often treated as a checkbox—something to address before launch. But truly accessible design goes far beyond WCAG compliance. It's about creating experiences that work for everyone, regardless of how they interact with technology.

## The Real Cost of Inaccessible Design

When we design products that aren't accessible, we're not just failing to meet legal requirements—we're excluding millions of potential users. In the US alone, 1 in 4 adults lives with a disability. That's 61 million people who might struggle to use your product if accessibility isn't prioritized from the start.

But accessibility isn't just about permanent disabilities. Consider temporary impairments (like a broken arm), situational limitations (like bright sunlight making a screen hard to read), or age-related changes in vision and motor control. Good accessibility benefits everyone.

## Starting with Empathy

The best accessible design starts with empathy. Use screen readers yourself. Try navigating with just a keyboard. Test your color contrasts. These exercises reveal pain points that automated tools miss.

I've learned that involving users with disabilities early in the design process is transformative. Their feedback has shaped some of my best work—not just making products accessible, but making them better for everyone.

## Practical Strategies

Here are the principles I follow:

**Semantic HTML First**: Proper heading hierarchy, ARIA labels when needed, and meaningful alt text aren't just for screen readers—they improve SEO and code maintainability.

**Keyboard Navigation**: Every interactive element should be reachable and usable via keyboard. Tab order should be logical and focus states should be clearly visible.

**Color and Contrast**: Never rely on color alone to convey information. Maintain WCAG AA contrast ratios at minimum (4.5:1 for normal text).

**Flexible Layouts**: Support browser zoom up to 200%. Use relative units like rem and em instead of fixed pixels.

## The Business Case

Accessible design isn't charity—it's good business. Companies that prioritize accessibility see higher user engagement, better SEO rankings, reduced legal risk, and expanded market reach. When you design for accessibility from the start, it costs far less than retrofitting later.

The path forward is clear: make accessibility a core design principle, not an afterthought. Your users—all of them—will thank you.`,
          image_url: '/images/placeholder.svg',
          published_at: '2024-01-15',
          category: 'Design',
          author: 'Caden Burleson',
          read_time: '5 min read'
        },
        {
          id: 2,
          title: 'Building Design Systems That Scale',
          slug: 'building-design-systems',
          excerpt: 'Lessons learned from creating component libraries for teams of all sizes. From startups to enterprises, here\'s what actually works.',
          content: `# Building Design Systems That Scale

A design system is more than a component library. It's a shared language between design and engineering, a living documentation of your product's DNA, and a tool for maintaining consistency at scale.

## Why Design Systems Fail

I've seen design systems fail more often than succeed. The pattern is usually the same: a small team builds a beautiful component library, documents everything perfectly, and launches with fanfare. Six months later, nobody's using it.

The problem? They built a system for the product they wished they had, not the product they actually have. Successful design systems grow organically from real needs, not theoretical ideals.

## Start Small, Think Big

The best design systems I've built started with just 5-10 components—the ones teams were already duplicating across projects. Buttons, form inputs, cards, modals. The essentials.

Once adoption proves the value, expand strategically. Let demand drive what you build next. This approach ensures every component solves a real problem and gets used immediately.

## The Foundation: Design Tokens

Before building any components, establish your design tokens: colors, typography scales, spacing units, elevation levels, and animation timings. These are the atomic decisions that cascade through everything else.

I structure tokens in tiers:
- **Global tokens**: Brand colors, base font families
- **Alias tokens**: Semantic meanings like "primary", "error", "background"
- **Component tokens**: Specific to individual components

This hierarchy makes it easy to theme or rebrand later while maintaining consistency.

## Documentation is a Product

Your design system's documentation is as important as the components themselves. I've found that showing real examples with code snippets, do's and don'ts, and clear guidelines for when to use each component dramatically improves adoption.

Use tools like Storybook to create an interactive playground where designers and developers can see components in action, test edge cases, and grab code snippets.

## Governance and Contribution

As your system grows, you need clear ownership. Who decides what gets added? How do teams request new components? Who reviews contributions?

I recommend a federated model: a core team maintains the system, but any team can propose additions. Regular office hours and contribution guidelines lower barriers to participation.

## Measuring Success

Track these metrics to understand your system's impact:
- **Adoption rate**: How many projects use the system?
- **Component coverage**: What percentage of UI comes from the system?
- **Development velocity**: Time saved building features
- **Design consistency**: Variation in similar UI patterns
- **Accessibility compliance**: Audit scores across products

A design system that's actually being used and improving outcomes is worth the investment. One sitting unused is just expensive documentation.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-11-22',
          category: 'Design Systems',
          author: 'Caden Burleson',
          read_time: '8 min read'
        },
        {
          id: 3,
          title: 'The Art of User Research',
          slug: 'art-of-user-research',
          excerpt: 'How to conduct effective research that actually informs design decisions. Moving beyond surveys to uncover insights that drive innovation.',
          content: `# The Art of User Research

User research isn't about validating assumptions—it's about challenging them. The best insights often come from observing what users do, not just what they say.

## The Problem with Asking

"What features do you want?" is one of the worst questions you can ask users. They'll tell you about features they've seen in other products or incremental improvements to current workflows. They rarely articulate breakthrough solutions because they're constrained by what exists today.

As Henry Ford supposedly said, "If I had asked people what they wanted, they would have said faster horses."

## Jobs to Be Done

Instead of asking about features, I focus on understanding the "job" users are trying to accomplish. What are they really trying to achieve? What makes them choose one solution over another? What causes them to switch?

This framework, popularized by Clayton Christensen, reveals the underlying motivations that drive behavior. A classic example: people don't want a drill—they want holes in their walls.

## Observation Over Interrogation

The most valuable research happens when you watch users in their natural environment. Contextual inquiry reveals workarounds, frustrations, and opportunities that users might not mention in interviews.

I once observed office workers using elaborate spreadsheet macros to compensate for limitations in their project management tool. When asked in surveys, they rated the tool highly. Observation revealed the truth: it wasn't meeting their needs.

## The Five-User Myth

Jakob Nielsen famously claimed you only need five users to find 85% of usability issues. This is true for usability testing, but dangerous if applied broadly to all research.

Five users might reveal navigation problems. They won't tell you about edge cases, diverse use contexts, or segment-specific needs. For generative research, talk to 15-20 users across different segments. For evaluative testing, 5-8 is often sufficient.

## Research as a Team Sport

The best insights emerge when the entire team participates in research. Designers see different patterns than engineers. Product managers notice different pain points than customer success.

I run collaborative synthesis sessions where the team reviews recordings together, pulls out quotes, and identifies themes. This shared understanding is more valuable than any research report.

## Continuous Discovery

User research isn't a phase—it's a continuous practice. Weekly customer conversations keep you connected to evolving needs. Usability testing happens throughout design, not just before launch.

The teams that ship the best products are the ones that never stop learning about their users.

## Turning Insights into Action

Research is only valuable if it influences decisions. I create lightweight deliverables: journey maps, personas, and opportunity frameworks that teams reference during planning and design.

The goal isn't comprehensive documentation—it's shared understanding that drives better decisions every day.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-09-08',
          category: 'Research',
          author: 'Caden Burleson',
          read_time: '6 min read'
        },
        {
          id: 4,
          title: 'Prototyping with Purpose',
          slug: 'prototyping-with-purpose',
          excerpt: 'When to use low-fi sketches versus high-fi interactive prototypes. A framework for choosing the right fidelity at each stage of design.',
          content: `# Prototyping with Purpose

Not every idea needs a pixel-perfect prototype. Understanding which fidelity to use and when can save weeks of unnecessary work while still validating your assumptions effectively.

## The Fidelity Spectrum

Prototypes exist on a spectrum from paper sketches to production-ready code. Each level serves a different purpose and answers different questions.

**Paper/Whiteboard (1 hour)**: Great for exploring multiple concepts quickly. Answers: "Which direction feels right?"

**Wireframes (2-4 hours)**: Test information architecture and flow. Answers: "Can users find what they need?"

**Visual Mockups (1-2 days)**: Validate aesthetic direction and hierarchy. Answers: "Does this feel right for our brand?"

**Interactive Prototypes (3-5 days)**: Test complex interactions and animations. Answers: "How does this actually work?"

**Coded Prototypes (1-2 weeks)**: Validate technical feasibility and performance. Answers: "Can we actually build this?"

## Matching Fidelity to Questions

The biggest mistake I see is jumping to high-fidelity too soon. You spend days perfecting pixels for a concept that testing proves is fundamentally flawed.

Start with the lowest fidelity that can answer your current questions. Each level should validate assumptions before investing in the next.

Early in design, I use rough sketches to explore 3-4 different approaches in an hour. We can have real conversations about structure and flow without getting distracted by colors or spacing.

## The Paper Prototype Power

Never underestimate paper. I've run usability tests with hand-drawn screens and learned just as much as with polished prototypes—sometimes more, because users feel comfortable critiquing rough sketches.

Paper forces you to focus on the essentials: layout, hierarchy, and flow. You're not tempted to polish details that might not survive contact with users.

## When to Go High-Fidelity

Interactive prototypes make sense when:
- Testing complex micro-interactions or animations
- Demonstrating concepts to stakeholders who struggle with abstraction
- Validating that your design system components work together
- Getting feedback from users accustomed to polished products

Tools like Figma, Framer, and ProtoPie let you create realistic prototypes without code. But remember: high fidelity creates higher stakes. Users (and stakeholders) treat polished prototypes as more "final" and may hesitate to suggest major changes.

## Code as a Prototyping Tool

For sufficiently complex interactions, sometimes the fastest path is writing code. I've built React prototypes to test data-heavy dashboards or animation-rich experiences where design tools fall short.

The key is using throwaway code. Prototype code optimizes for speed and flexibility, not maintainability or performance. Make it clear this isn't production-ready.

## Prototyping as Thinking

The real value of prototyping isn't the artifact—it's the thinking it enables. Each iteration helps you understand the problem better and identify constraints you missed.

Prototype with purpose. Know what questions you're trying to answer, choose the right fidelity, and don't get attached to any particular solution. The best designers remain curious and keep exploring until they find something that truly works.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-07-14',
          category: 'Design',
          author: 'Caden Burleson',
          read_time: '4 min read'
        },
        {
          id: 5,
          title: 'Modern CSS Layout Techniques',
          slug: 'modern-css-layout',
          excerpt: 'A deep dive into CSS Grid, Flexbox, and container queries. How modern CSS enables responsive designs that were impossible just a few years ago.',
          content: `# Modern CSS Layout Techniques

The landscape of CSS has changed dramatically. Grid and Flexbox have replaced float-based layouts, and container queries are opening new possibilities for truly modular components.

## The Layout Revolution

For years, we hacked layouts with floats, positioning, and clearfixes. Then Flexbox arrived in 2015 and Grid in 2017, fundamentally changing how we think about web layout.

Today, these tools are universally supported. If you're still using float-based layouts or frameworks like Bootstrap's grid system, you're making your life harder than it needs to be.

## Flexbox: The One-Dimensional Master

Flexbox excels at distributing space along a single axis—either horizontal or vertical. I use it for:
- Navigation menus
- Card layouts where items wrap
- Centering content vertically and horizontally
- Creating flexible form layouts
- Spacing elements with gap property

The key insight: Flexbox is about **relationships between siblings**. You tell items how to grow, shrink, and align relative to each other.

\`\`\`css
.container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item {
  flex: 1; /* Grow equally to fill space */
}
\`\`\`

## Grid: The Two-Dimensional Powerhouse

Grid handles both rows and columns simultaneously. Perfect for:
- Page layouts
- Image galleries
- Dashboards
- Any design with alignment in two dimensions
- Complex responsive layouts

Grid is about **explicit placement and alignment**. You define rows and columns, then place items into that structure.

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

This creates a responsive grid where items wrap automatically and each column is at least 300px wide. No media queries needed.

## Container Queries: The Future is Here

Container queries let components respond to their container's size, not the viewport's. This enables truly modular components that adapt to any context.

Imagine a card component that shows a horizontal layout when wide but stacks vertically when narrow—regardless of screen size, based solely on the space available.

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
\`\`\`

Browser support crossed the threshold for production use in 2023. This is the future of responsive design.

## Practical Patterns

**Sticky Footer**: No more absolute positioning hacks.
\`\`\`css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
\`\`\`

**Holy Grail Layout**: Sidebar, main content, sidebar—all responsive.
\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
\`\`\`

**Aspect Ratio Boxes**: Built-in now, no padding hacks.
\`\`\`css
.video-container {
  aspect-ratio: 16 / 9;
}
\`\`\`

## Embrace the Modern Web

Stop fighting CSS with arbitrary abstractions and utility class systems. Learn Grid and Flexbox deeply. Understand when to use each. Experiment with container queries.

Modern CSS is incredibly powerful. The layouts that once required frameworks or preprocessors are now trivial with native CSS. The future of web layout is already here—and it's simpler than you think.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-05-30',
          category: 'Development',
          author: 'Caden Burleson',
          read_time: '10 min read'
        },
        {
          id: 6,
          title: 'Designing for Mobile-First in 2024',
          slug: 'mobile-first-design-2024',
          excerpt: 'Why mobile-first isn\'t just about screen size—it\'s about constraints that force better design decisions for all devices.',
          content: `# Designing for Mobile-First in 2024

Mobile-first design has been a buzzword for over a decade, but many teams still treat it as an afterthought. In 2024, with over 60% of web traffic coming from mobile devices, designing for small screens first isn't just good practice—it's essential.

## Beyond Responsive Design

Mobile-first isn't about making your desktop site "fit" on phones. It's a fundamentally different approach: start with the most constrained experience, then progressively enhance for larger screens.

This constraint-driven approach forces you to prioritize ruthlessly. What's truly essential? What can wait? What doesn't belong at all?

## Performance is a Feature

Mobile users are often on slower connections. They're paying for data. They're multitasking or on the go. Performance isn't a nice-to-have—it's core to the user experience.

I follow these principles:
- Images lazy-load by default
- Critical CSS inlined, rest loaded async
- JavaScript is progressive enhancement
- Web fonts load with fallbacks
- Total bundle size under 200KB

## Touch-First Interactions

Desktop design assumes precision. Mobile requires larger touch targets (minimum 44x44px), clear spacing, and forgiving hit areas.

I also consider:
- Thumb zones for one-handed use
- Swipe gestures feel more natural than small buttons
- Pull-to-refresh for content updates
- Bottom navigation for frequently accessed features

## Context Matters

Mobile users have different goals and contexts than desktop users. They're looking for quick answers, specific information, or completing focused tasks.

Design for these scenarios:
- Fast access to contact info or directions
- Quick checkout without typing
- Scannable content with clear hierarchy
- Offline functionality for poor connectivity

## The Mobile-First Process

Start by designing the 320px mobile view. Force yourself to make hard decisions about hierarchy and content. Then scale up to tablet and desktop, adding complexity only where screen real estate allows.

This process consistently produces better results than designing desktop-first and trying to "simplify" for mobile.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-03-18',
          category: 'Design',
          author: 'Caden Burleson',
          read_time: '7 min read'
        },
        {
          id: 7,
          title: 'Animation in UI: When and Why',
          slug: 'animation-in-ui',
          excerpt: 'The psychology and practical applications of motion design in digital products. Making animation purposeful, not decorative.',
          content: `# Animation in UI: When and Why

Animation in user interfaces is powerful—when used thoughtfully. Bad animation is distracting. Good animation provides context, guides attention, and makes interfaces feel responsive and alive.

## The Purpose of Motion

Every animation should serve a purpose:

**Feedback**: Confirming an action occurred (button press, form submission)
**Context**: Showing where content came from or is going
**Guidance**: Directing attention to important changes
**Relationships**: Showing how elements connect or transform

If an animation doesn't serve one of these purposes, it's probably decoration.

## Timing and Easing

The difference between amateur and professional animation is often just timing and easing curves.

Fast animations (100-200ms) work for small changes like hover states. Larger transitions need more time (300-500ms) so users can follow what's happening.

Easing curves matter too. Linear motion feels robotic. Use ease-out for entering elements, ease-in for exiting, and ease-in-out for movements.

\`\`\`css
.element {
  transition: transform 300ms ease-out;
}
\`\`\`

## Respecting User Preferences

Always respect prefers-reduced-motion. Some users experience motion sensitivity, and we have a responsibility to accommodate them.

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

## Practical Applications

**Loading States**: Skeleton screens with subtle animations feel faster than spinners
**Page Transitions**: Sliding or fading between views maintains context
**Micro-interactions**: Button ripples, input focus rings, hover states
**Scroll-triggered**: Parallax, fade-ins, and sticky headers add depth

The best animation is often subtle. Users shouldn't consciously notice it—they should just feel that the interface is responsive and polished.`,
          image_url: '/images/placeholder.svg',
          published_at: '2022-12-05',
          category: 'Design',
          author: 'Caden Burleson',
          read_time: '5 min read'
        }
      ];
      renderBlogPosts(container, mockPosts);
    } else {
      renderBlogPosts(container, posts);
    }
  } catch (error) {
    container.innerHTML = `
      <section class="rm-page">
        <div class="rm-container">
          <div class="rm-page-header">
            <h1 class="rm-page-title">Blog</h1>
            <p class="rm-page-description">Unable to load posts</p>
          </div>
        </div>
      </section>
    `;
    console.error('Error fetching blog posts:', error);
  }
}

function renderBlogPosts(container, posts) {
  console.log('Rendering posts:', posts);

  const postsHTML = posts.map(post => {
    const slug = post.slug || post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const publishedDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `
      <article class="rm-blog-card">
        <a href="/blog/${slug}" class="rm-blog-link">
          <div class="rm-blog-meta">
            <span class="rm-blog-date">${publishedDate}</span>
            ${post.read_time ? `<span class="rm-blog-readtime">${post.read_time}</span>` : ''}
          </div>
          <h2 class="rm-blog-title">${post.title}</h2>
          <p class="rm-blog-excerpt">${post.excerpt || ''}</p>
          <div class="rm-blog-footer">
            <span class="rm-blog-category">${post.category || 'Uncategorized'}</span>
            <span class="rm-read-more">Read more →</span>
          </div>
        </a>
      </article>
    `;
  }).join('');

  const emptyMessage = posts.length === 0 ? '<p class="rm-empty-message">No posts available yet.</p>' : '';

  container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-page-header">
          <h1 class="rm-page-title">Blog</h1>
          <p class="rm-page-description">Thoughts on design, development, and building products</p>
        </div>

        <div class="rm-blog-grid">
          ${emptyMessage}
          ${postsHTML}
        </div>
      </div>
    </section>
  `;
}

export async function renderBlogPostPage(container, slug) {
  console.log('Attempting to load blog post with slug:', slug);

  // Show loading state
  container.innerHTML = `
    <section class="rm-page">
      <div class="rm-container">
        <div class="rm-loading">Loading blog post...</div>
      </div>
    </section>
  `;

  try {
    let post = null;

    // Check if supabase is initialized before trying to use it
    if (supabase) {
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
        // Don't throw - fall through to mock data instead

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
    } else {
      console.log('Supabase not initialized, using mock data');
    }

    // If no post found in database, try mock data
    if (!post) {
      console.log('No post found in database, checking mock data for slug:', slug);
      const mockPosts = [
        {
          id: 1,
          title: 'Designing for Accessibility: Beyond Compliance',
          slug: 'designing-for-accessibility',
          excerpt: 'Why accessibility should be at the core of your design process, not an afterthought. Exploring practical strategies for creating inclusive digital experiences.',
          content: `# Designing for Accessibility: Beyond Compliance

Accessibility is often treated as a checkbox—something to address before launch. But truly accessible design goes far beyond WCAG compliance. It's about creating experiences that work for everyone, regardless of how they interact with technology.

## The Real Cost of Inaccessible Design

When we design products that aren't accessible, we're not just failing to meet legal requirements—we're excluding millions of potential users. In the US alone, 1 in 4 adults lives with a disability. That's 61 million people who might struggle to use your product if accessibility isn't prioritized from the start.

But accessibility isn't just about permanent disabilities. Consider temporary impairments (like a broken arm), situational limitations (like bright sunlight making a screen hard to read), or age-related changes in vision and motor control. Good accessibility benefits everyone.

## Starting with Empathy

The best accessible design starts with empathy. Use screen readers yourself. Try navigating with just a keyboard. Test your color contrasts. These exercises reveal pain points that automated tools miss.

I've learned that involving users with disabilities early in the design process is transformative. Their feedback has shaped some of my best work—not just making products accessible, but making them better for everyone.

## Practical Strategies

Here are the principles I follow:

**Semantic HTML First**: Proper heading hierarchy, ARIA labels when needed, and meaningful alt text aren't just for screen readers—they improve SEO and code maintainability.

**Keyboard Navigation**: Every interactive element should be reachable and usable via keyboard. Tab order should be logical and focus states should be clearly visible.

**Color and Contrast**: Never rely on color alone to convey information. Maintain WCAG AA contrast ratios at minimum (4.5:1 for normal text).

**Flexible Layouts**: Support browser zoom up to 200%. Use relative units like rem and em instead of fixed pixels.

## The Business Case

Accessible design isn't charity—it's good business. Companies that prioritize accessibility see higher user engagement, better SEO rankings, reduced legal risk, and expanded market reach. When you design for accessibility from the start, it costs far less than retrofitting later.

The path forward is clear: make accessibility a core design principle, not an afterthought. Your users—all of them—will thank you.`,
          image_url: '/images/placeholder.svg',
          published_at: '2024-01-15',
          category: 'Design',
          author: 'Caden Burleson',
          read_time: '5 min read'
        },
        {
          id: 2,
          title: 'Building Design Systems That Scale',
          slug: 'building-design-systems',
          excerpt: 'Lessons learned from creating component libraries for teams of all sizes. From startups to enterprises, here\'s what actually works.',
          content: `# Building Design Systems That Scale

A design system is more than a component library. It's a shared language between design and engineering, a living documentation of your product's DNA, and a tool for maintaining consistency at scale.

## Why Design Systems Fail

I've seen design systems fail more often than succeed. The pattern is usually the same: a small team builds a beautiful component library, documents everything perfectly, and launches with fanfare. Six months later, nobody's using it.

The problem? They built a system for the product they wished they had, not the product they actually have. Successful design systems grow organically from real needs, not theoretical ideals.

## Start Small, Think Big

The best design systems I've built started with just 5-10 components—the ones teams were already duplicating across projects. Buttons, form inputs, cards, modals. The essentials.

Once adoption proves the value, expand strategically. Let demand drive what you build next. This approach ensures every component solves a real problem and gets used immediately.

## The Foundation: Design Tokens

Before building any components, establish your design tokens: colors, typography scales, spacing units, elevation levels, and animation timings. These are the atomic decisions that cascade through everything else.

I structure tokens in tiers:
- **Global tokens**: Brand colors, base font families
- **Alias tokens**: Semantic meanings like "primary", "error", "background"
- **Component tokens**: Specific to individual components

This hierarchy makes it easy to theme or rebrand later while maintaining consistency.

## Documentation is a Product

Your design system's documentation is as important as the components themselves. I've found that showing real examples with code snippets, do's and don'ts, and clear guidelines for when to use each component dramatically improves adoption.

Use tools like Storybook to create an interactive playground where designers and developers can see components in action, test edge cases, and grab code snippets.

## Governance and Contribution

As your system grows, you need clear ownership. Who decides what gets added? How do teams request new components? Who reviews contributions?

I recommend a federated model: a core team maintains the system, but any team can propose additions. Regular office hours and contribution guidelines lower barriers to participation.

## Measuring Success

Track these metrics to understand your system's impact:
- **Adoption rate**: How many projects use the system?
- **Component coverage**: What percentage of UI comes from the system?
- **Development velocity**: Time saved building features
- **Design consistency**: Variation in similar UI patterns
- **Accessibility compliance**: Audit scores across products

A design system that's actually being used and improving outcomes is worth the investment. One sitting unused is just expensive documentation.`,
          image_url: '/images/placeholder.svg',
          published_at: '2023-11-22',
          category: 'Design Systems',
          author: 'Caden Burleson',
          read_time: '8 min read'
        }
      ];

      post = mockPosts.find(p => p.slug === slug);

      if (!post) {
        console.log('Post not found even in mock data:', slug);
        container.innerHTML = `
          <section class="rm-page">
            <div class="rm-container">
              <h1 class="rm-page-title">Post Not Found</h1>
              <p class="rm-page-description">The blog post you're looking for doesn't exist.</p>
              <a href="/blog" class="rm-btn rm-btn-primary">Back to Blog</a>
            </div>
          </section>
        `;
        return;
      }

      console.log('Found post in mock data:', post.title);
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
      <article class="rm-page">
        <div class="rm-container">
          <a href="/blog" class="rm-back-link">← Back to Blog</a>

          <div class="rm-detail-header">
            <div class="rm-detail-meta">
              <span class="rm-detail-category">${post.category || 'Uncategorized'}</span>
              <span class="rm-detail-date">${formattedDate}</span>
              ${post.read_time ? `<span class="rm-detail-readtime">${post.read_time}</span>` : ''}
            </div>
            <h1 class="rm-detail-title">${post.title}</h1>
          </div>

          <div class="rm-detail-content rm-blog-content">
            ${marked.parse(post.content || '')}
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    console.error('Error rendering blog post:', error);
    container.innerHTML = `
      <section class="rm-page">
        <div class="rm-container">
          <h1 class="rm-page-title">Error</h1>
          <p class="rm-page-description">Failed to load the blog post. Please try again later.</p>
          <p class="rm-page-description">${error.message}</p>
          <a href="/blog" class="rm-btn rm-btn-primary">Back to Blog</a>
        </div>
      </section>
    `;
  }
} 