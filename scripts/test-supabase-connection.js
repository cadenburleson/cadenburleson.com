import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try loading .env from project root
const result = dotenv.config({ path: join(__dirname, '../.env') });

console.log('=== Environment Variable Check ===');
console.log('dotenv config result:', result.error ? result.error.message : 'Loaded successfully');
console.log('Variables parsed:', result.parsed ? Object.keys(result.parsed).length : 0);

console.log('\n=== Checking Supabase Variables ===');
console.log('VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_URL value:', process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 30)}...` : 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY exists:', !!process.env.VITE_SUPABASE_ANON_KEY);
console.log('VITE_SUPABASE_ANON_KEY value:', process.env.VITE_SUPABASE_ANON_KEY ? `${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('\n❌ Supabase credentials missing!');
  process.exit(1);
}

console.log('\n=== Testing Supabase Connection ===');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

try {
  // Try to query the blog_posts table
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title')
    .limit(1);

  if (error) {
    console.error('❌ Supabase query error:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('Blog posts found:', data ? data.length : 0);
    if (data && data.length > 0) {
      console.log('Sample post:', data[0]);
    }
  }
} catch (err) {
  console.error('❌ Connection error:', err.message);
}
