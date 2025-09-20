# دليل إعداد Gmail SMTP للمنصة التعليمية

## الخطوات المطلوبة:

### 1. تفعيل 2-Step Verification في Google Account:
1. اذهب إلى: https://myaccount.google.com/security
2. في قسم "Signing in to Google" اختر "2-Step Verification"
3. اضغط "Get Started" واتبع الخطوات
4. أدخل رقم هاتفك واستلم رمز التحقق
5. فعّل الـ 2-Step Verification

### 2. إنشاء App Password:
1. ارجع لـ Security page: https://myaccount.google.com/security
2. تحت "Signing in to Google" اضغط "App passwords"
3. اختر "Mail" من القائمة المنسدلة
4. اختر "Other (Custom name)" واكتب "Courses Platform"
5. اضغط "Generate"
6. **انسخ الـ 16-digit password** (مثل: abcd efgh ijkl mnop)

### 3. تحديث إعدادات المشروع:
- هنضيف Gmail config في .env
- هنحدث email.service.js لاستخدام Gmail
- هنختبر الإرسال

## ملاحظات مهمة:
- استخدم إيميل Gmail الأساسي بتاعك
- App Password مختلف عن باسورد Gmail العادي
- Gmail يسمح بإرسال 500 إيميل/يوم مجاناً
- مناسب للتطوير والمشاريع الصغيرة

## البيانات المطلوبة:
- Gmail Email: your-email@gmail.com
- App Password: 16-digit password من Google