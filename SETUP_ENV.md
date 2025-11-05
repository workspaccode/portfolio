# إعداد متغيرات البيئة (Environment Variables)

المشكلة: `Supabase not configured` - يعني أن ملف `.env.local` غير موجود أو غير مُكوّن.

## الحل السريع:

1. **أنشئ ملف `.env.local`** في المجلد الرئيسي للمشروع (نفس مستوى `package.json`)

2. **انسخ القيم التالية** من Supabase Dashboard:
   - افتح https://supabase.com/dashboard
   - اختر مشروعك
   - اذهب إلى **Settings** → **API**
   - انسخ:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **أنشئ ملف `.env.local`** بمحتوى:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **أعد تشغيل السيرفر**:
   ```bash
   npm run dev
   ```

## خطوات مفصلة:

### 1. الحصول على Supabase Credentials:

1. سجل دخول إلى https://supabase.com
2. اختر مشروعك (أو أنشئ مشروع جديد)
3. اذهب إلى **Settings** (⚙️) → **API**
4. سترى:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: مفتاح طويل يبدأ بـ `eyJ...`

### 2. إنشاء ملف `.env.local`:

في المجلد الرئيسي للمشروع (`d:\Idea-SAAS\portfolio`)، أنشئ ملف جديد باسم `.env.local` وضعه فيه:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**مثال:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. (اختياري) Service Role Key:

إذا كنت تريد تجاوز RLS في Server-side:
1. في نفس صفحة API Settings
2. انسخ **service_role** key (⚠️ حافظ على سرية هذا المفتاح!)
3. أضف في `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. إعادة التشغيل:

بعد حفظ `.env.local`، أعد تشغيل السيرفر:
```bash
# أوقف السيرفر (Ctrl+C)
npm run dev
```

## ملاحظات:

- ✅ ملف `.env.local` موجود في `.gitignore` - لن يُرفع على Git
- ✅ لا تشارك هذه المفاتيح مع أحد
- ✅ بعد إضافة المتغيرات، أعد تشغيل السيرفر
- ✅ تأكد من أن الملف في المجلد الرئيسي (نفس مستوى `package.json`)

## التحقق:

بعد إعادة التشغيل، يجب أن تختفي رسالة "Supabase not configured" ويعمل Dashboard بشكل طبيعي.

