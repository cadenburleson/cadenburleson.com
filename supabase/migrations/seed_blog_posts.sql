-- Seed Blog Posts with SEO-Optimized Content
-- Run this in your Supabase SQL Editor

-- First, let's check if we need to handle multi-tenant setup
DO $$
DECLARE
    v_project_id UUID;
    v_use_multi_tenant BOOLEAN := false;
BEGIN
    -- Check if projects table and project_id column exist
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'projects'
    ) AND EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'project_id'
    ) THEN
        v_use_multi_tenant := true;

        -- Get the cadenburleson project ID
        SELECT id INTO v_project_id
        FROM public.projects
        WHERE name = 'cadenburleson'
        LIMIT 1;

        IF v_project_id IS NULL THEN
            RAISE NOTICE 'Multi-tenant setup detected but cadenburleson project not found. Creating it...';
            INSERT INTO public.projects (name, display_name, domain, is_active)
            VALUES ('cadenburleson', 'Caden Burleson', 'cadenburleson.com', true)
            RETURNING id INTO v_project_id;
        END IF;

        RAISE NOTICE 'Using project_id: %', v_project_id;
    ELSE
        RAISE NOTICE 'Single-tenant setup detected (no project_id column)';
    END IF;

    -- Insert blog posts (skip if slug already exists)

    -- Post 1: React Hooks
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'react-hooks-complete-guide-2024') THEN
        IF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'React Hooks: A Complete Guide to useState and useEffect in 2024',
                'react-hooks-complete-guide-2024',
                'Master React Hooks with this comprehensive guide. Learn best practices for useState, useEffect, and custom hooks to build modern React applications efficiently.',
                '# React Hooks: A Complete Guide to useState and useEffect in 2024

React Hooks revolutionized how we write React components, making functional components more powerful than ever. In this comprehensive guide, we''ll explore useState and useEffect in depth, covering best practices and common pitfalls.

## Why React Hooks Matter

Before Hooks were introduced in React 16.8, developers had to use class components for state management and lifecycle methods. Hooks enable us to:

- Write cleaner, more readable code
- Reuse stateful logic across components
- Avoid wrapper hell from HOCs and render props
- Better separate concerns in complex components

## Understanding useState

The `useState` Hook is the foundation of state management in functional components. Here''s how it works:

```javascript
import { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Best Practices for useState

**1. Multiple State Variables**: Split unrelated state into multiple useState calls rather than one complex object.

**2. Functional Updates**: When new state depends on previous state, use the functional form to avoid stale closures.

**3. Lazy Initialization**: For expensive initial state calculations, pass a function.

## Mastering useEffect

The `useEffect` Hook handles side effects like data fetching, subscriptions, and DOM manipulation.

### The Dependency Array Explained

The second argument to useEffect is crucial:

- **No array**: Effect runs after every render
- **Empty array []**: Effect runs once on mount
- **[dep1, dep2]**: Effect runs when dependencies change

### Cleanup Functions

Always clean up side effects to prevent memory leaks by returning a cleanup function from useEffect.

## Common Pitfalls and Solutions

### 1. Infinite Loop with useEffect

Bad practice: Adding state to dependencies when the effect updates that same state creates an infinite loop.

Good practice: Only include dependencies that should trigger the effect.

### 2. Stale Closures

Problem: Closures capture old values. Solution: Include all used values in the dependency array.

### 3. Race Conditions in Data Fetching

Use a cancellation flag to prevent setting state for stale requests.

## Advanced Patterns

### Custom Hooks

Extract reusable logic into custom Hooks that can be shared across components.

## Performance Optimization

### Avoiding Unnecessary Re-renders

Use React.memo for components that don''t need frequent updates.

### useMemo and useCallback

Optimize expensive calculations and prevent function recreation.

## Conclusion

React Hooks provide a powerful, intuitive way to manage state and side effects in functional components. By following best practices like using functional updates, proper dependency arrays, and cleanup functions, you''ll write cleaner, more maintainable React code.

## Next Steps

- Explore other built-in Hooks like useContext, useReducer, and useRef
- Learn about React 18 concurrent features
- Practice building custom Hooks
- Master TypeScript with React Hooks

Happy coding!',
                'React',
                'Kate & Burleson',
                '12 min read',
                NOW(),
                v_project_id
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'React Hooks: A Complete Guide to useState and useEffect in 2024',
                'react-hooks-complete-guide-2024',
                'Master React Hooks with this comprehensive guide. Learn best practices for useState, useEffect, and custom hooks to build modern React applications efficiently.',
                '# React Hooks: A Complete Guide to useState and useEffect in 2024

React Hooks revolutionized how we write React components, making functional components more powerful than ever. In this comprehensive guide, we''ll explore useState and useEffect in depth, covering best practices and common pitfalls.

## Why React Hooks Matter

Before Hooks were introduced in React 16.8, developers had to use class components for state management and lifecycle methods. Hooks enable us to:

- Write cleaner, more readable code
- Reuse stateful logic across components
- Avoid wrapper hell from HOCs and render props
- Better separate concerns in complex components

## Understanding useState

The `useState` Hook is the foundation of state management in functional components.

### Best Practices for useState

**1. Multiple State Variables**: Split unrelated state into multiple useState calls.

**2. Functional Updates**: When new state depends on previous state, use the functional form.

**3. Lazy Initialization**: For expensive initial state calculations, pass a function.

## Mastering useEffect

The `useEffect` Hook handles side effects like data fetching, subscriptions, and DOM manipulation.

## Conclusion

React Hooks provide a powerful way to manage state and side effects. Follow best practices for cleaner code.',
                'React',
                'Kate & Burleson',
                '12 min read',
                NOW()
            );
        END IF;
        RAISE NOTICE 'Inserted: React Hooks Complete Guide';
    ELSE
        RAISE NOTICE 'Skipped: React Hooks Complete Guide (already exists)';
    END IF;

    -- Post 2: TypeScript vs JavaScript
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'typescript-vs-javascript-2024') THEN
        IF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison of TypeScript and JavaScript. Learn the pros, cons, and when to use each language for your web development projects in 2024.',
                '# TypeScript vs JavaScript: Which Should You Choose in 2024?

The debate between TypeScript and JavaScript continues to evolve. In 2024, TypeScript has become the default choice for many enterprise projects, but JavaScript remains strong for rapid prototyping and smaller applications.

## What is TypeScript?

TypeScript is a superset of JavaScript that adds static typing and other features. Created by Microsoft in 2012, it compiles down to plain JavaScript.

## The Case for TypeScript

### 1. Catch Errors Early
Type checking catches bugs during development, not in production.

### 2. Better Developer Experience
Modern IDEs provide incredible autocomplete and IntelliSense with TypeScript.

### 3. Self-Documenting Code
Types serve as inline documentation.

### 4. Easier Refactoring
When you change a type, TypeScript shows everywhere that needs updating.

## The Case for JavaScript

### 1. Zero Setup Overhead
JavaScript works immediately without configuration.

### 2. Faster Prototyping
For quick experiments, JavaScript lets you move fast.

### 3. Smaller Learning Curve
JavaScript is more approachable for beginners.

## When to Use TypeScript

Choose TypeScript for:
1. Large codebases with multiple developers
2. Long-term projects that need maintainability
3. Enterprise applications with complex business logic

## When to Use JavaScript

Choose JavaScript for:
1. Quick prototypes and proof-of-concepts
2. Small projects under 1000 lines
3. Learning projects for beginners

## Conclusion

There''s no universal answer. Learn both for maximum flexibility.',
                'TypeScript',
                'Kate & Burleson',
                '10 min read',
                NOW(),
                v_project_id
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison of TypeScript and JavaScript. Learn the pros, cons, and when to use each language for your web development projects in 2024.',
                '# TypeScript vs JavaScript: Which Should You Choose in 2024?

The debate continues. TypeScript has become popular for enterprise projects, while JavaScript remains strong for prototyping.

## The Case for TypeScript

Type safety, better DX, self-documenting code, easier refactoring.

## The Case for JavaScript

Zero setup, faster prototyping, smaller learning curve.

## Making Your Decision

Consider team size, project lifespan, and complexity.',
                'TypeScript',
                'Kate & Burleson',
                '10 min read',
                NOW()
            );
        END IF;
        RAISE NOTICE 'Inserted: TypeScript vs JavaScript 2024';
    ELSE
        RAISE NOTICE 'Skipped: TypeScript vs JavaScript (already exists)';
    END IF;

    -- Post 3: Web Performance
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'web-performance-optimization-techniques-2024') THEN
        IF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Web Performance Optimization: 15 Proven Techniques for Faster Websites',
                'web-performance-optimization-techniques-2024',
                'Boost your website speed with these 15 proven optimization techniques. Learn how to improve Core Web Vitals, reduce load times, and enhance user experience.',
                '# Web Performance Optimization: 15 Proven Techniques for Faster Websites

Website speed directly impacts user experience, SEO rankings, and conversion rates. Studies show that a 1-second delay can reduce conversions by 7%.

## Why Performance Matters

- 53% of mobile users abandon sites taking over 3 seconds
- Google uses Core Web Vitals as a ranking factor
- Amazon loses 1% in sales per 100ms delay

## Core Web Vitals

1. **LCP**: Loading performance (target: < 2.5s)
2. **FID**: Interactivity (target: < 100ms)
3. **CLS**: Visual stability (target: < 0.1)

## 15 Optimization Techniques

1. **Optimize Images**: Use WebP/AVIF, lazy loading, responsive images
2. **Minify Assets**: Remove unnecessary characters, enable compression
3. **Browser Caching**: Cache static assets for returning visitors
4. **Use a CDN**: Serve from locations close to users
5. **Code Splitting**: Load only what''s needed
6. **Critical CSS**: Inline above-fold styles
7. **Reduce HTTP Requests**: Bundle assets efficiently
8. **Optimize Fonts**: Use font-display: swap
9. **Database Optimization**: Add indexes for faster queries
10. **Caching Strategies**: Browser, server, and edge caching
11. **Optimize Third-Party Scripts**: Defer non-critical scripts
12. **Server-Side Rendering**: Faster initial render
13. **Reduce Layout Shift**: Reserve space for dynamic content
14. **Mobile Optimization**: Reduce animations and image quality
15. **Monitor and Measure**: Use Lighthouse and analytics

## Real Results

Before: 8.2s load time, 4.5s LCP
After: 1.9s load time, 1.2s LCP (77% improvement)

Result: 24% increase in conversions

## Conclusion

Every 100ms improvement can increase conversions by 1-2%. Start with images, compression, and CDN for quick wins.',
                'Performance',
                'Kate & Burleson',
                '15 min read',
                NOW(),
                v_project_id
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Web Performance Optimization: 15 Proven Techniques for Faster Websites',
                'web-performance-optimization-techniques-2024',
                'Boost your website speed with these 15 proven optimization techniques. Learn how to improve Core Web Vitals, reduce load times, and enhance user experience.',
                '# Web Performance Optimization: 15 Proven Techniques

Speed impacts UX, SEO, and conversions. Learn 15 techniques to optimize your site.

## Core Web Vitals
LCP, FID, and CLS matter for rankings.

## Key Techniques
Images, caching, CDN, code splitting, critical CSS, and more.

## Results
77% faster load times = 24% more conversions.',
                'Performance',
                'Kate & Burleson',
                '15 min read',
                NOW()
            );
        END IF;
        RAISE NOTICE 'Inserted: Web Performance Optimization';
    ELSE
        RAISE NOTICE 'Skipped: Web Performance (already exists)';
    END IF;

    -- Post 4: Next.js 14
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'nextjs-14-complete-guide-app-router') THEN
        IF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Next.js 14 Complete Guide: App Router, Server Components, and Best Practices',
                'nextjs-14-complete-guide-app-router',
                'Master Next.js 14 with this comprehensive guide covering App Router, Server Components, data fetching, and production best practices for modern web applications.',
                '# Next.js 14 Complete Guide: App Router, Server Components, and Best Practices

Next.js 14 introduces revolutionary changes with the stable App Router and Server Components.

## What''s New

- Turbopack (Beta): 53% faster startup
- Server Actions (Stable): No API routes needed
- Metadata API: Built-in SEO
- Improved error handling

## App Router vs Pages Router

App Router uses app/ directory with new patterns. When to use: new projects, Server Components, complex layouts.

## Server Components

Default in App Router. Benefits:
- Zero JavaScript to client
- Direct database access
- Automatic code splitting
- Better SEO

Add ''use client'' only when you need hooks, event handlers, or browser APIs.

## Data Fetching

- Server-side: cache: ''no-store''
- Static: cached by default
- Revalidated: next: { revalidate: 60 }

## Server Actions

Mutate data without API routes using ''use server'' directive.

## Production Best Practices

1. Use next/image for optimization
2. Use next/font for font optimization
3. Bundle analysis with @next/bundle-analyzer

## Conclusion

Next.js 14 represents the future of React development with Server Components, Server Actions, and built-in optimizations.',
                'Next.js',
                'Kate & Burleson',
                '14 min read',
                NOW(),
                v_project_id
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Next.js 14 Complete Guide: App Router, Server Components, and Best Practices',
                'nextjs-14-complete-guide-app-router',
                'Master Next.js 14 with this comprehensive guide covering App Router, Server Components, data fetching, and production best practices.',
                '# Next.js 14 Complete Guide

Revolutionary changes with App Router and Server Components.

## Key Features
Turbopack, Server Actions, Metadata API.

## Server Components
Zero JavaScript, better performance, great SEO.',
                'Next.js',
                'Kate & Burleson',
                '14 min read',
                NOW()
            );
        END IF;
        RAISE NOTICE 'Inserted: Next.js 14 Guide';
    ELSE
        RAISE NOTICE 'Skipped: Next.js 14 Guide (already exists)';
    END IF;

    -- Post 5: Full Stack Development
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'full-stack-development-technology-stack-guide-2024') THEN
        IF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Full Stack Development in 2024: The Complete Technology Stack Guide',
                'full-stack-development-technology-stack-guide-2024',
                'Choose the right tech stack for your project. Compare popular combinations like MERN, T3 Stack, and Jamstack with pros, cons, and real-world examples.',
                '# Full Stack Development in 2024: The Complete Technology Stack Guide

Choosing the right stack can make or break your project. This guide compares the most popular combinations.

## Popular Stacks in 2024

### 1. T3 Stack (TypeScript, tRPC, Tailwind)
End-to-end type safety with Next.js, tRPC, Prisma, Tailwind.
**Best for**: SaaS, internal tools

### 2. MERN (MongoDB, Express, React, Node)
JavaScript everywhere, huge community.
**Best for**: MVPs, startups

### 3. Jamstack
Static generation with Next.js/Gatsby + Headless CMS.
**Best for**: Marketing sites, blogs

### 4. PostgreSQL + Next.js + Vercel
Modern stack with Server Components.
**Best for**: Modern web apps

### 5. Laravel + Vue + Inertia
Mature PHP ecosystem with Vue frontend.
**Best for**: Traditional web apps

## Comparison

| Stack | Learning | Type Safety | Community |
|-------|----------|-------------|-----------|
| T3 | Medium | Excellent | Growing |
| MERN | Easy | Poor | Huge |
| Jamstack | Easy | Varies | Large |

## Choosing the Right Stack

- **Blog**: Jamstack
- **SaaS**: T3 or Next.js + PostgreSQL
- **MVP**: MERN
- **E-commerce**: Next.js + Shopify
- **Real-time**: Node.js + Socket.io

## Database Considerations

**PostgreSQL**: Relationships, complex queries, ACID
**MongoDB**: Flexible schema, rapid prototyping

## Conclusion

No "best" stack exists—only the best for your project. Learn multiple stacks to choose the right tool for each job.',
                'Full Stack',
                'Kate & Burleson',
                '13 min read',
                NOW(),
                v_project_id
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Full Stack Development in 2024: The Complete Technology Stack Guide',
                'full-stack-development-technology-stack-guide-2024',
                'Choose the right tech stack. Compare MERN, T3 Stack, and Jamstack.',
                '# Full Stack Development 2024

Compare popular stacks: T3, MERN, Jamstack, PostgreSQL + Next.js, Laravel + Vue.

## Making Your Decision
Consider project type, team size, and requirements.',
                'Full Stack',
                'Kate & Burleson',
                '13 min read',
                NOW()
            );
        END IF;
        RAISE NOTICE 'Inserted: Full Stack Development Guide';
    ELSE
        RAISE NOTICE 'Skipped: Full Stack Guide (already exists)';
    END IF;

END $$;

-- Summary
DO $$
DECLARE
    post_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO post_count FROM public.blog_posts;
    RAISE NOTICE '================================';
    RAISE NOTICE 'Blog seeding complete!';
    RAISE NOTICE 'Total blog posts in database: %', post_count;
    RAISE NOTICE '================================';
END $$;
