-- Disable Row Level Security (RLS) on all tables
-- Run this in Supabase SQL Editor to allow all operations without authentication

-- Disable RLS on projects table
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS on skills table
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;

-- Disable RLS on about table
ALTER TABLE about DISABLE ROW LEVEL SECURITY;

-- Disable RLS on social_links table
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Disable RLS on timeline table
ALTER TABLE timeline DISABLE ROW LEVEL SECURITY;

-- Disable RLS on certificates table
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled (optional - check results)
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'skills', 'about', 'social_links', 'timeline', 'certificates')
ORDER BY tablename;

