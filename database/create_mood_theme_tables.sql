-- ============================================================================
-- SQL Script لإنشاء جداول نظام Mood Theme
-- ============================================================================
-- هذا الملف يحتوي على سكريبتات SQL لإنشاء الجداول الجديدة لنظام إدارة المواضيع
-- يجب تشغيل هذا السكريبت في Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. جدول themes (المواضيع)
-- ============================================================================
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    preview_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_themes_is_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_themes_is_default ON themes(is_default);
CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);

-- تعطيل Row Level Security
ALTER TABLE themes DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. جدول theme_settings (إعدادات المواضيع)
-- ============================================================================
CREATE TABLE IF NOT EXISTS theme_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type TEXT NOT NULL CHECK (setting_type IN ('color', 'string', 'number', 'boolean', 'json')),
    display_name TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(theme_id, setting_key)
);

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_theme_settings_theme_id ON theme_settings(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_settings_key ON theme_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_theme_settings_category ON theme_settings(category);

-- تعطيل Row Level Security
ALTER TABLE theme_settings DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. جدول user_theme_preferences (تفضيلات المستخدم للمواضيع)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_theme_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_identifier TEXT NOT NULL,
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL DEFAULT 'selected' CHECK (preference_type IN ('selected', 'favorite', 'recent')),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_user_prefs_user_identifier ON user_theme_preferences(user_identifier);
CREATE INDEX IF NOT EXISTS idx_user_prefs_theme_id ON user_theme_preferences(theme_id);
CREATE INDEX IF NOT EXISTS idx_user_prefs_active ON user_theme_preferences(is_active);
CREATE INDEX IF NOT EXISTS idx_user_prefs_type ON user_theme_preferences(preference_type);

-- تعطيل Row Level Security
ALTER TABLE user_theme_preferences DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. جدول theme_variants (متغيرات المواضيع)
-- ============================================================================
CREATE TABLE IF NOT EXISTS theme_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    settings_override JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(theme_id, variant_name)
);

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_theme_variants_theme_id ON theme_variants(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_variants_default ON theme_variants(is_default);
CREATE INDEX IF NOT EXISTS idx_theme_variants_name ON theme_variants(variant_name);

-- تعطيل Row Level Security
ALTER TABLE theme_variants DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. جدول theme_customizations (التخصيصات المخصصة)
-- ============================================================================
CREATE TABLE IF NOT EXISTS theme_customizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_identifier TEXT NOT NULL,
    base_theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
    customization_name TEXT NOT NULL,
    custom_settings JSONB NOT NULL DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_customizations_user ON theme_customizations(user_identifier);
CREATE INDEX IF NOT EXISTS idx_customizations_theme ON theme_customizations(base_theme_id);
CREATE INDEX IF NOT EXISTS idx_customizations_public ON theme_customizations(is_public, is_active);

-- تعطيل Row Level Security
ALTER TABLE theme_customizations DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- إنشاء دوال لتحديث updated_at تلقائياً
-- ============================================================================

-- دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء Triggers لتحديث updated_at تلقائياً
CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at BEFORE UPDATE ON theme_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_theme_preferences_updated_at BEFORE UPDATE ON user_theme_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_variants_updated_at BEFORE UPDATE ON theme_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_customizations_updated_at BEFORE UPDATE ON theme_customizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- إدخال بيانات تجريبية (اختياري)
-- ============================================================================

-- إدخال مواضيع افتراضية
INSERT INTO themes (name, display_name, description, is_default, is_active) VALUES
    ('dark', 'Dark Theme', 'الموضوع الداكن الافتراضي', true, true),
    ('light', 'Light Theme', 'الموضوع الفاتح', false, true),
    ('ocean', 'Ocean Theme', 'موضوع بألوان المحيط', false, true),
    ('sunset', 'Sunset Theme', 'موضوع بألوان الغروب', false, true)
ON CONFLICT (name) DO NOTHING;

-- إدخال إعدادات للموضوع الداكن
INSERT INTO theme_settings (theme_id, setting_key, setting_value, setting_type, display_name, category)
SELECT 
    t.id,
    setting_data.key,
    setting_data.value,
    setting_data.type,
    setting_data.display_name,
    setting_data.category
FROM themes t,
(VALUES
    ('primary', 'oklch(0.65 0.18 45)', 'color', 'Primary Color', 'colors'),
    ('background', 'oklch(0.15 0 0)', 'color', 'Background Color', 'colors'),
    ('foreground', 'oklch(0.985 0 0)', 'color', 'Foreground Color', 'colors'),
    ('card', 'oklch(0.22 0.02 250)', 'color', 'Card Color', 'colors'),
    ('border', 'oklch(1 0 0 / 15%)', 'color', 'Border Color', 'colors'),
    ('accent', 'oklch(0.65 0.18 45)', 'color', 'Accent Color', 'colors'),
    ('radius', '0.625rem', 'string', 'Border Radius', 'spacing'),
    ('font_family', 'Inter, sans-serif', 'string', 'Font Family', 'typography')
) AS setting_data(key, value, type, display_name, category)
WHERE t.name = 'dark'
ON CONFLICT (theme_id, setting_key) DO NOTHING;

-- إدخال متغيرات للموضوع الداكن
INSERT INTO theme_variants (theme_id, variant_name, display_name, is_default)
SELECT id, 'dark', 'Dark Mode', true
FROM themes
WHERE name = 'dark'
ON CONFLICT (theme_id, variant_name) DO NOTHING;

INSERT INTO theme_variants (theme_id, variant_name, display_name, is_default)
SELECT id, 'light', 'Light Mode', false
FROM themes
WHERE name = 'dark'
ON CONFLICT (theme_id, variant_name) DO NOTHING;

-- ============================================================================
-- التحقق من إنشاء الجداول
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('themes', 'theme_settings', 'user_theme_preferences', 'theme_variants', 'theme_customizations')
ORDER BY tablename;

-- ============================================================================
-- نهاية السكريبت
-- ============================================================================

