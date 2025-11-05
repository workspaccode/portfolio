# نظام Mood Theme - التوثيق

## نظرة عامة

تم إنشاء نظام إدارة المواضيع (Mood Theme) لنظام Portfolio Management System. يتيح هذا النظام إدارة المواضيع المختلفة وإعداداتها وتفضيلات المستخدمين.

## الملفات المُنشأة

### 1. ملفات قاعدة البيانات

- **`database/new_tables_mood_theme.txt`** - ملف توثيق شامل لجميع الجداول الجديدة
- **`database/create_mood_theme_tables.sql`** - سكريبت SQL لإنشاء جميع الجداول
- **`database/disable_rls_mood_theme.sql`** - سكريبت SQL لتعطيل Row Level Security

### 2. ملفات الكود

- **`src/lib/supabase.ts`** - تم تحديثه بإضافة أنواع TypeScript للجداول الجديدة

## الجداول المُنشأة

### 1. `themes` - المواضيع
تخزين المواضيع المتاحة في النظام.

### 2. `theme_settings` - إعدادات المواضيع
تخزين الإعدادات التفصيلية لكل موضوع (الألوان، الخطوط، الأنماط).

### 3. `user_theme_preferences` - تفضيلات المستخدم
تخزين تفضيلات المستخدمين للمواضيع المفضلة.

### 4. `theme_variants` - متغيرات المواضيع
تخزين المتغيرات المختلفة لنفس الموضوع (Dark Mode، Light Mode).

### 5. `theme_customizations` - التخصيصات المخصصة
تخزين التخصيصات المخصصة التي ينشئها المستخدمون.

## خطوات التثبيت

### 1. إنشاء الجداول في Supabase

1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. انسخ محتوى `database/create_mood_theme_tables.sql`
4. شغّل السكريبت

### 2. تعطيل Row Level Security

1. في Supabase SQL Editor
2. انسخ محتوى `database/disable_rls_mood_theme.sql`
3. شغّل السكريبت

### 3. التحقق من التثبيت

بعد تشغيل السكريبتات، تأكد من إنشاء الجداول عبر:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('themes', 'theme_settings', 'user_theme_preferences', 'theme_variants', 'theme_customizations');
```

## الاستخدام

### الحصول على المواضيع المتاحة

```typescript
import { supabase } from '@/lib/supabase'

const { data: themes } = await supabase
  .from('themes')
  .select('*')
  .eq('is_active', true)
```

### الحصول على إعدادات موضوع معين

```typescript
const { data: settings } = await supabase
  .from('theme_settings')
  .select('*')
  .eq('theme_id', themeId)
```

### حفظ تفضيل المستخدم

```typescript
await supabase
  .from('user_theme_preferences')
  .insert({
    user_identifier: 'user_session_id',
    theme_id: selectedThemeId,
    preference_type: 'selected'
  })
```

## البنية

```
database/
├── new_tables_mood_theme.txt          # توثيق الجداول
├── create_mood_theme_tables.sql        # سكريبت إنشاء الجداول
└── disable_rls_mood_theme.sql         # سكريبت تعطيل RLS

src/lib/
└── supabase.ts                         # أنواع TypeScript محدثة
```

## ملاحظات

- جميع الجداول تستخدم UUID كمعرفات رئيسية
- تم تعطيل Row Level Security كما في الجداول الأخرى
- يمكن تخصيص المواضيع ديناميكياً من قاعدة البيانات
- يدعم النظام تعدد المتغيرات لكل موضوع

## الخطوات التالية

1. إنشاء واجهة إدارة المواضيع في Admin Panel
2. إنشاء مكون Theme Selector للمستخدمين
3. ربط النظام مع CSS Variables للتطبيق الديناميكي
4. إضافة API Routes للتعامل مع المواضيع

