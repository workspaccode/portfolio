-- ============================================================================
-- SQL Script لتعطيل Row Level Security على جداول Mood Theme
-- ============================================================================
-- يجب تشغيل هذا السكريبت بعد إنشاء الجداول
-- ============================================================================

-- تعطيل RLS على جدول themes
ALTER TABLE themes DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول theme_settings
ALTER TABLE theme_settings DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول user_theme_preferences
ALTER TABLE user_theme_preferences DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول theme_variants
ALTER TABLE theme_variants DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول theme_customizations
ALTER TABLE theme_customizations DISABLE ROW LEVEL SECURITY;

-- التحقق من تعطيل RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('themes', 'theme_settings', 'user_theme_preferences', 'theme_variants', 'theme_customizations')
ORDER BY tablename;

