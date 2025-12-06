-- Seed Blog Posts with SEO-Optimized Content
-- This script first ensures all necessary columns exist, then inserts data

-- Step 1: Add missing columns if they don't exist
DO $$
BEGIN
    -- Add category column if missing
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN category TEXT;
        RAISE NOTICE 'Added category column';
    END IF;

    -- Add author column if missing
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'author'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN author TEXT;
        RAISE NOTICE 'Added author column';
    END IF;

    -- Add read_time column if missing (custom field for blog UX)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN read_time TEXT;
        RAISE NOTICE 'Added read_time column';
    END IF;
END $$;

-- Step 2: Insert blog posts
DO $$
DECLARE
    v_project_id UUID;
    v_use_multi_tenant BOOLEAN := false;
    v_has_read_time BOOLEAN := false;
BEGIN
    -- Check if multi-tenant setup exists
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

        RAISE NOTICE 'Multi-tenant setup - using project_id: %', v_project_id;
    ELSE
        RAISE NOTICE 'Single-tenant setup detected';
    END IF;

    -- Check if read_time column exists
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        v_has_read_time := true;
    END IF;

    -- Post 1: React Hooks
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'react-hooks-complete-guide-2024') THEN
        IF v_use_multi_tenant THEN
            IF v_has_read_time THEN
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
                INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at, project_id)
                VALUES (
                    'React Hooks: A Complete Guide to useState and useEffect in 2024',
                    'react-hooks-complete-guide-2024',
                    'Master React Hooks with this comprehensive guide. Learn best practices for useState, useEffect, and custom hooks to build modern React applications efficiently.',
                    '# React Hooks: A Complete Guide to useState and useEffect in 2024

React Hooks revolutionized how we write React components. Learn best practices and common pitfalls.

## Why React Hooks Matter

Before React 16.8, developers had to use class components. Hooks enable cleaner code and better logic reuse.

## Understanding useState

The foundation of state management in functional components.

### Best Practices

1. Multiple State Variables
2. Functional Updates
3. Lazy Initialization

## Mastering useEffect

Handles side effects like data fetching and subscriptions.

## Conclusion

React Hooks provide powerful tools for state and side effects. Follow best practices for maintainable code.',
                    'React',
                    'Kate & Burleson',
                    NOW(),
                    v_project_id
                );
            END IF;
        ELSE
            -- Single tenant
            IF v_has_read_time THEN
                INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
                VALUES (
                    'React Hooks: A Complete Guide to useState and useEffect in 2024',
                    'react-hooks-complete-guide-2024',
                    'Master React Hooks with this comprehensive guide. Learn best practices for useState, useEffect, and custom hooks to build modern React applications efficiently.',
                    '# React Hooks: A Complete Guide to useState and useEffect in 2024

React Hooks revolutionized how we write React components. Learn useState, useEffect, and best practices.',
                    'React',
                    'Kate & Burleson',
                    '12 min read',
                    NOW()
                );
            ELSE
                INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at)
                VALUES (
                    'React Hooks: A Complete Guide to useState and useEffect in 2024',
                    'react-hooks-complete-guide-2024',
                    'Master React Hooks with this comprehensive guide.',
                    '# React Hooks Guide

Learn useState and useEffect best practices.',
                    'React',
                    'Kate & Burleson',
                    NOW()
                );
            END IF;
        END IF;
        RAISE NOTICE '✓ Inserted: React Hooks Complete Guide';
    ELSE
        RAISE NOTICE 'Skipped: React Hooks (already exists)';
    END IF;

    -- Post 2: TypeScript vs JavaScript
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'typescript-vs-javascript-2024') THEN
        IF v_use_multi_tenant AND v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison of TypeScript and JavaScript for web development in 2024.',
                '# TypeScript vs JavaScript 2024

The debate continues. TypeScript has become popular for enterprise, while JavaScript remains strong for prototyping.

## The Case for TypeScript

Type safety, better DX, self-documenting code, easier refactoring.

## The Case for JavaScript

Zero setup, faster prototyping, smaller learning curve.

## When to Use Each

TypeScript: large codebases, long-term projects, enterprise apps
JavaScript: prototypes, small projects, learning

## Conclusion

Learn both for maximum flexibility.',
                'TypeScript',
                'Kate & Burleson',
                '10 min read',
                NOW(),
                v_project_id
            );
        ELSIF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at, project_id)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison of TypeScript and JavaScript.',
                '# TypeScript vs JavaScript 2024

Compare TypeScript and JavaScript for your next project.',
                'TypeScript',
                'Kate & Burleson',
                NOW(),
                v_project_id
            );
        ELSIF v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison.',
                '# TypeScript vs JavaScript

Choosing between TypeScript and JavaScript.',
                'TypeScript',
                'Kate & Burleson',
                '10 min read',
                NOW()
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at)
            VALUES (
                'TypeScript vs JavaScript: Which Should You Choose in 2024?',
                'typescript-vs-javascript-2024',
                'Comprehensive comparison.',
                '# TypeScript vs JavaScript

Comparison guide.',
                'TypeScript',
                'Kate & Burleson',
                NOW()
            );
        END IF;
        RAISE NOTICE '✓ Inserted: TypeScript vs JavaScript';
    ELSE
        RAISE NOTICE 'Skipped: TypeScript vs JavaScript (already exists)';
    END IF;

    -- Post 3: Web Performance
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'web-performance-optimization-techniques-2024') THEN
        IF v_use_multi_tenant AND v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Web Performance Optimization: 15 Proven Techniques for Faster Websites',
                'web-performance-optimization-techniques-2024',
                'Boost your website speed with these 15 proven optimization techniques. Improve Core Web Vitals and user experience.',
                '# Web Performance Optimization: 15 Proven Techniques

Speed impacts UX, SEO, and conversions. Every 100ms matters.

## Core Web Vitals

LCP, FID, and CLS are ranking factors.

## 15 Techniques

1. Optimize Images (WebP/AVIF, lazy loading)
2. Minify & Compress Assets
3. Browser Caching
4. Use a CDN
5. Code Splitting
6. Critical CSS
7. Reduce HTTP Requests
8. Optimize Fonts
9. Database Optimization
10. Caching Strategies
11. Optimize Third-Party Scripts
12. Server-Side Rendering
13. Reduce Layout Shift
14. Mobile Optimization
15. Monitor & Measure

## Real Results

77% faster load times = 24% more conversions

## Conclusion

Start with images, compression, and CDN for quick wins.',
                'Performance',
                'Kate & Burleson',
                '15 min read',
                NOW(),
                v_project_id
            );
        ELSIF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at, project_id)
            VALUES (
                'Web Performance Optimization: 15 Proven Techniques',
                'web-performance-optimization-techniques-2024',
                'Boost website speed and improve Core Web Vitals.',
                '# Web Performance Optimization

15 techniques to speed up your website.',
                'Performance',
                'Kate & Burleson',
                NOW(),
                v_project_id
            );
        ELSIF v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Web Performance Optimization: 15 Proven Techniques',
                'web-performance-optimization-techniques-2024',
                'Speed optimization techniques.',
                '# Web Performance

Optimize your website speed.',
                'Performance',
                'Kate & Burleson',
                '15 min read',
                NOW()
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at)
            VALUES (
                'Web Performance Optimization',
                'web-performance-optimization-techniques-2024',
                'Speed optimization.',
                '# Performance

Optimize speed.',
                'Performance',
                'Kate & Burleson',
                NOW()
            );
        END IF;
        RAISE NOTICE '✓ Inserted: Web Performance Optimization';
    ELSE
        RAISE NOTICE 'Skipped: Web Performance (already exists)';
    END IF;

    -- Post 4: Next.js 14
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'nextjs-14-complete-guide-app-router') THEN
        IF v_use_multi_tenant AND v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Next.js 14 Complete Guide: App Router and Server Components',
                'nextjs-14-complete-guide-app-router',
                'Master Next.js 14 with App Router, Server Components, and production best practices.',
                '# Next.js 14 Complete Guide

Revolutionary App Router and Server Components.

## What''s New

Turbopack, Server Actions, Metadata API, improved error handling.

## Server Components

Zero JavaScript to client, direct database access, better SEO.

## Data Fetching

Server-side, static, and revalidated options.

## Conclusion

The future of React development.',
                'Next.js',
                'Kate & Burleson',
                '14 min read',
                NOW(),
                v_project_id
            );
        ELSIF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at, project_id)
            VALUES (
                'Next.js 14 Complete Guide',
                'nextjs-14-complete-guide-app-router',
                'Master Next.js 14.',
                '# Next.js 14

App Router and Server Components.',
                'Next.js',
                'Kate & Burleson',
                NOW(),
                v_project_id
            );
        ELSIF v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Next.js 14 Complete Guide',
                'nextjs-14-complete-guide-app-router',
                'Master Next.js 14.',
                '# Next.js 14

Modern React framework.',
                'Next.js',
                'Kate & Burleson',
                '14 min read',
                NOW()
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at)
            VALUES (
                'Next.js 14 Guide',
                'nextjs-14-complete-guide-app-router',
                'Next.js 14.',
                '# Next.js 14

App Router guide.',
                'Next.js',
                'Kate & Burleson',
                NOW()
            );
        END IF;
        RAISE NOTICE '✓ Inserted: Next.js 14 Guide';
    ELSE
        RAISE NOTICE 'Skipped: Next.js 14 (already exists)';
    END IF;

    -- Post 5: Full Stack Development
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'full-stack-development-technology-stack-guide-2024') THEN
        IF v_use_multi_tenant AND v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at, project_id)
            VALUES (
                'Full Stack Development in 2024: The Complete Technology Stack Guide',
                'full-stack-development-technology-stack-guide-2024',
                'Choose the right tech stack. Compare MERN, T3 Stack, Jamstack with pros and cons.',
                '# Full Stack Development 2024

Compare popular technology stacks.

## Popular Stacks

1. T3 Stack (TypeScript, tRPC, Tailwind)
2. MERN (MongoDB, Express, React, Node)
3. Jamstack (Static generation)
4. PostgreSQL + Next.js
5. Laravel + Vue

## Choosing Your Stack

- Blog: Jamstack
- SaaS: T3 or Next.js + PostgreSQL
- MVP: MERN
- E-commerce: Next.js + Shopify

## Conclusion

No "best" stack—only the best for your project.',
                'Full Stack',
                'Kate & Burleson',
                '13 min read',
                NOW(),
                v_project_id
            );
        ELSIF v_use_multi_tenant THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at, project_id)
            VALUES (
                'Full Stack Development Guide 2024',
                'full-stack-development-technology-stack-guide-2024',
                'Technology stack guide.',
                '# Full Stack 2024

Compare tech stacks.',
                'Full Stack',
                'Kate & Burleson',
                NOW(),
                v_project_id
            );
        ELSIF v_has_read_time THEN
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, read_time, published_at)
            VALUES (
                'Full Stack Development Guide',
                'full-stack-development-technology-stack-guide-2024',
                'Tech stack guide.',
                '# Full Stack

Technology stacks.',
                'Full Stack',
                'Kate & Burleson',
                '13 min read',
                NOW()
            );
        ELSE
            INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at)
            VALUES (
                'Full Stack Guide',
                'full-stack-development-technology-stack-guide-2024',
                'Tech stacks.',
                '# Full Stack

Stacks guide.',
                'Full Stack',
                'Kate & Burleson',
                NOW()
            );
        END IF;
        RAISE NOTICE '✓ Inserted: Full Stack Development Guide';
    ELSE
        RAISE NOTICE 'Skipped: Full Stack (already exists)';
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
