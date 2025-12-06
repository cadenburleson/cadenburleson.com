import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { blogPosts } from './blog-posts-data.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env'), override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const projectName = process.env.VITE_PROJECT_NAME || 'cadenburleson';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedBlogPosts() {
  try {
    // Check if multi-tenant setup exists by checking for projects table
    let projectId = null;
    let useMultiTenant = false;

    const { data: projectsTableCheck, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (!checkError) {
      // Multi-tenant setup exists
      useMultiTenant = true;
      console.log('Multi-tenant setup detected, looking for project...');

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('name', projectName)
        .single();

      if (projectError || !project) {
        console.error('Project not found:', projectError);
        console.log('Available projects:');
        const { data: allProjects } = await supabase.from('projects').select('name, id');
        console.table(allProjects);
        console.log('\nTip: Update VITE_PROJECT_NAME in your .env file to match an existing project');
        process.exit(1);
      }

      projectId = project.id;
      console.log(`Found project ID: ${projectId}`);
    } else {
      console.log('Single-tenant setup detected (no projects table)');
    }

    // Check for existing blog posts
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('slug')
      .in('slug', blogPosts.map(p => p.slug));

    console.log(`${existingPosts?.length || 0} posts already exist in database`);

    // Insert new posts
    let insertedCount = 0;
    for (const post of blogPosts) {
      if (existingPosts?.some(ep => ep.slug === post.slug)) {
        console.log(`Skipping existing post: ${post.title}`);
        continue;
      }

      const postData = {
        ...post,
        published_at: new Date().toISOString(),
      };

      // Only add project_id if multi-tenant
      if (useMultiTenant && projectId) {
        postData.project_id = projectId;
      }

      const { error } = await supabase
        .from('blog_posts')
        .insert(postData);

      if (error) {
        console.error(`Error inserting post "${post.title}":`, error);
        // If it's a column error, give helpful message
        if (error.message?.includes('project_id')) {
          console.error('Hint: The blog_posts table has a project_id column. Run migrations to set up multi-tenant support.');
        }
      } else {
        console.log(`✓ Inserted: ${post.title}`);
        insertedCount++;
      }
    }

    console.log(`\nSuccess! Inserted ${insertedCount} new blog posts.`);
    console.log(`Total posts in database: ${(existingPosts?.length || 0) + insertedCount}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

seedBlogPosts();
