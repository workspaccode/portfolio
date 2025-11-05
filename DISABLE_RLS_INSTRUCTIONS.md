# تعطيل Row Level Security (RLS) في Supabase

إذا كانت عمليات CRUD (Create, Read, Update, Delete) لا تعمل، قد يكون السبب هو Row Level Security (RLS) مفعّل في Supabase.

## الطريقة السريعة: تعطيل RLS

1. افتح Supabase Dashboard
2. اذهب إلى **SQL Editor**
3. انسخ محتوى ملف `disable-rls.sql` والصقه في المحرر
4. اضغط **Run** أو **F5**

سيتم تعطيل RLS على جميع الجداول:
- `projects`
- `skills`
- `about`
- `social_links`
- `timeline`
- `certificates`

## التحقق من النتيجة

بعد تشغيل SQL، ستكون جميع العمليات متاحة بدون قيود.

## بديل: استخدام Service Role Key

بدلاً من تعطيل RLS، يمكنك استخدام Service Role Key:

1. في Supabase Dashboard، اذهب إلى **Settings** → **API**
2. انسخ **service_role key** (⚠️ حافظ على سرية هذا المفتاح!)
3. أضف في `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

هذا سيتجاوز RLS فقط في Server-side (API routes) وهو أكثر أماناً من تعطيل RLS تماماً.

## ملاحظة أمنية

⚠️ **تحذير**: تعطيل RLS يجعلك جميع العمليات متاحة بدون قيود. استخدم هذا فقط في:
- البيئة التطويرية
- إذا كنت تريد التحكم الكامل في الوصول من الكود

للإنتاج، يُفضل استخدام Service Role Key أو إعداد RLS policies صحيحة.

