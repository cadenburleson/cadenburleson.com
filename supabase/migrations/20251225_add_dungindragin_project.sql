-- Add DunginDragin project to portfolio
INSERT INTO public.portfolio_projects (
  title,
  slug,
  category,
  description,
  full_description,
  image_url,
  technologies,
  features,
  demo_url,
  launch_date,
  featured
) VALUES (
  'DunginDragin',
  'dungindragin',
  'Game',
  'AI-powered Dungeons & Dragons adventure platform with infinite procedurally generated worlds. Create characters, explore diverse biomes, and experience dynamic storytelling that adapts to your every decision.',
  'DunginDragin is your personal AI Dungeon Master, powered by Google''s Gemini AI. Embark on infinite procedurally generated adventures where every choice shapes your journey. The platform combines classic D&D gameplay with cutting-edge AI to create unique narratives that respond dynamically to player decisions.

Features include procedurally generated worlds with diverse biomes, dynamic storytelling that adapts to your choices, and an extensive item discovery system with legendary weapons and magical artifacts. The game offers a free-to-play experience with unlimited possibilities for adventure.',
  '/project-placeholder.jpg',
  ARRAY['Google Gemini AI', 'React', 'Node.js'],
  ARRAY[
    'Procedural Worlds - Explore infinite, AI-generated maps with diverse biomes',
    'Dynamic Storytelling - AI Dungeon Master crafts unique narratives that respond to your choices',
    'Item Discovery - Find legendary weapons, magical artifacts, and valuable treasures',
    'Free to Play - Unlimited adventures at no cost',
    'Character Creation - Build unique heroes for your journey'
  ],
  'https://www.dungindragin.com',
  '2024-01-01',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  image_url = EXCLUDED.image_url,
  technologies = EXCLUDED.technologies,
  features = EXCLUDED.features,
  demo_url = EXCLUDED.demo_url,
  launch_date = EXCLUDED.launch_date,
  featured = EXCLUDED.featured;
