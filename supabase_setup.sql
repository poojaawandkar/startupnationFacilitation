-- Supabase Database Setup for Facilitator Network
-- Run these commands in Supabase SQL Editor

-- 1. Create incubation_centers table
CREATE TABLE incubation_centers (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_website VARCHAR(500) NOT NULL,
    unique_selling_point TEXT NOT NULL,
    incubation_center_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    services VARCHAR(50) NOT NULL,
    startups_incubated VARCHAR(50) NOT NULL,
    support_remuneration VARCHAR(100) NOT NULL,
    youtube_link VARCHAR(500) NOT NULL,
    incubation_description TEXT NOT NULL,
    logo_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create comments table
CREATE TABLE comments_incubation (
    id BIGSERIAL PRIMARY KEY,
    center_id BIGINT REFERENCES incubation_centers(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    browser_session_id VARCHAR(255) NOT NULL, -- For browser-based user identification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX idx_incubation_centers_approved ON incubation_centers(is_approved);
CREATE INDEX idx_incubation_centers_company_name ON incubation_centers(LOWER(company_name));
CREATE INDEX idx_comments_center_id ON comments_incubation(center_id);
CREATE INDEX idx_comments_browser_session ON comments_incubation(browser_session_id);

-- 4. Create RLS (Row Level Security) policies
ALTER TABLE incubation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments_incubation ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved incubation centers
CREATE POLICY "Allow public read access to approved centers" ON incubation_centers
    FOR SELECT USING (is_approved = true);

-- Allow public insert for new incubation centers
CREATE POLICY "Allow public insert for new centers" ON incubation_centers
    FOR INSERT WITH CHECK (true);

-- Allow public read access to comments
CREATE POLICY "Allow public read access to comments" ON comments_incubation
    FOR SELECT USING (true);

-- Allow public insert for new comments
CREATE POLICY "Allow public insert for new comments" ON comments_incubation
    FOR INSERT WITH CHECK (true);

-- Allow users to delete their own comments (based on browser session)
CREATE POLICY "Allow users to delete their own comments" ON comments_incubation
    FOR DELETE USING (browser_session_id = current_setting('app.browser_session_id', true));

-- Allow admin to manage all records (you'll need to set up admin authentication)
CREATE POLICY "Allow admin full access" ON incubation_centers
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Allow admin full access to comments" ON comments_incubation
    FOR ALL USING (auth.role() = 'admin');

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
CREATE TRIGGER update_incubation_centers_updated_at 
    BEFORE UPDATE ON incubation_centers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments_incubation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert sample data (optional - for testing)
INSERT INTO incubation_centers (
    company_name, 
    company_email, 
    company_website, 
    unique_selling_point, 
    incubation_center_type, 
    location, 
    domain, 
    services, 
    startups_incubated, 
    support_remuneration, 
    youtube_link, 
    incubation_description, 
    logo_url, 
    is_approved
) VALUES (
    'Technology Transfer Office (UBL Cell) University of Sri Jayewardenepura',
    'contact@usjp.ac.lk',
    'https://usjp.ac.lk',
    'Strong university-industry linkage with academic research integration.',
    'Incubation center',
    'Sri Lanka',
    'Agnostic',
    'Hybrid',
    '50+',
    'Equity based',
    'https://youtube.com/watch?v=example1',
    'Our UBL Cell stands out as a unique incubation center by seamlessly integrating academic research with real-world industry applications. Its USP lies in its strong university–industry linkage, enabling early-stage innovators—especially students and researchers—to transform their scientific ideas into market-ready solutions.',
    'https://static.wixstatic.com/media/0556b8_e0fff23992724c7087785a7908a6998b~mv2.png',
    true
), (
    'Skolkovo Innovation Center',
    'contact@skolkovo.ru',
    'https://skolkovo.ru',
    'Largest innovation ecosystem in Russia with government backing.',
    'Accelerator',
    'Russian Federation',
    'Agnostic',
    'Onsite',
    '5000+',
    'Fee based',
    'https://youtube.com/watch?v=example2',
    'Skolkovo Innovation Center is the largest innovation ecosystem in Russia, home to over 5,000 high-tech startups across key sectors such as IT, biomedicine, energy, advanced manufacturing, and space.',
    'https://static.wixstatic.com/media/8d3771_dfaae21a034146c4987059be4b93105d~mv2.png',
    true
), (
    'BUILD UP LABS',
    'contact@builduplabs.com',
    'https://builduplabs.com',
    'Remote-first incubation support, by Serial-Entrepreneurs for New Entrepreneurs',
    'Incubation center',
    'Portugal',
    'Artificial Intelligence / SAAS',
    'Remote',
    '25+',
    'Hybrid (equity + fee)',
    'https://youtube.com/watch?v=example3',
    'BUILD UP LABS provides remote-first incubation support, leveraging the experience of serial entrepreneurs to guide new entrepreneurs through their startup journey.',
    '/imageslogo/builduplabs.png',
    true
); 