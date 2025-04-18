-- Create projects table
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    image_url TEXT,
    gallery TEXT[],
    technologies TEXT[],
    features TEXT[],
    demo_url TEXT,
    github_url TEXT,
    launch_date DATE,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    category TEXT,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    read BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Enable read access for all users" ON public.projects
    FOR SELECT USING (true);
    
CREATE POLICY "Enable insert for authenticated users only" ON public.projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users only" ON public.projects
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable delete for authenticated users only" ON public.projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for blog_posts table
CREATE POLICY "Enable read access for all users" ON public.blog_posts
    FOR SELECT USING (true);
    
CREATE POLICY "Enable insert for authenticated users only" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users only" ON public.blog_posts
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable delete for authenticated users only" ON public.blog_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for contact_messages table
CREATE POLICY "Enable insert access for all users" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Enable read for authenticated users only" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users only" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable delete for authenticated users only" ON public.contact_messages
    FOR DELETE USING (auth.role() = 'authenticated'); 