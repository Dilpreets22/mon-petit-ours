-- Create a table for love letters
CREATE TABLE IF NOT EXISTS public.love_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    letter_text TEXT NOT NULL,
    teddy_id INTEGER NOT NULL CHECK (teddy_id BETWEEN 1 AND 4),
    share_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.love_letters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (since users might not be authenticated)
CREATE POLICY "Allow public insert" ON public.love_letters
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow read access by share_token
CREATE POLICY "Allow read by token" ON public.love_letters
    FOR SELECT
    USING (true); -- We will filter by token in the application layer, or you can use: USING (current_setting('request.jwt.claims', true)::json->>'role' = 'anon') if restricted
