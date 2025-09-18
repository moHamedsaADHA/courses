# دليل الحصول على بيانات Brevo الصحيحة

## الخطوة 1: إنشاء حساب أو تسجيل الدخول

1. اذهب إلى [Brevo](https://www.brevo.com)
2. سجل دخول أو أنشئ حساب جديد

## الخطوة 2: الحصول على API Key

### الطريقة الأولى - API Key:
1. في Dashboard، اذهب إلى `Settings` (الإعدادات)
2. اختر `API Keys` من القائمة الجانبية
3. اضغط على `Generate a new API key`
4. اختر الصلاحيات المطلوبة:
   - ✅ Send emails
   - ✅ Manage contacts
5. اختر اسم للمفتاح (مثل: "Course Platform API")
6. اضغط `Generate`
7. **انسخ المفتاح فوراً** - لن تتمكن من رؤيته مرة أخرى!

### الطريقة الثانية - SMTP:
1. اذهب إلى `Settings` → `SMTP & API`
2. في قسم `SMTP`:
   - **Host**: `smtp-relay.brevo.com`
   - **Port**: `587` (recommended) أو `25`
   - **Username**: (ستجد اسم المستخدم المولد تلقائياً)
   - **Password**: (نفس API Key أو مفتاح SMTP منفصل)

## الخطوة 3: إعداد Sender Email

### إضافة الإيميل المرسل:
1. اذهب إلى `Senders & IP`
2. اضغط `Add a sender`
3. أدخل:
   - **Name**: اسم المرسل (مثل: "منصة الكورسات")
   - **Email**: الإيميل المرسل
4. ستحتاج للتحقق من الإيميل إذا كان domain خاص بك

### التحقق من Domain (اختياري لكن مستحسن):
1. في `Senders & IP` → `Domains`
2. أضف الدومين الخاص بك
3. اتبع التعليمات لإضافة DNS records

## الخطوة 4: التحقق من الإعدادات في .env

```env
# Brevo API Key (يبدأ بـ xkeysib أو xsmtpsib)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# إعدادات SMTP
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=xxxxxx@smtp-brevo.com
BREVO_SMTP_PASS=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# إيميل المرسل (يجب أن يكون مضاف في Senders)
EMAIL_FROM=your-email@domain.com
EMAIL_FROM_NAME=منصة الكورسات
```

## الأخطاء الشائعة وحلولها:

### خطأ 535 Authentication failed:
- **المشكلة**: بيانات المصادقة غير صحيحة
- **الحل**: 
  - تأكد من صحة API Key
  - تأكد من صحة SMTP username/password
  - تحقق من انتهاء صلاحية المفتاح

### خطأ Connection timeout:
- **المشكلة**: مشكلة في الاتصال
- **الحل**:
  - تحقق من إعدادات Firewall
  - جرب Port 25 بدلاً من 587
  - تحقق من اتصال الإنترنت

### خطأ Sender not authorized:
- **المشكلة**: الإيميل المرسل غير مصرح
- **الحل**:
  - أضف الإيميل في Senders & IP
  - تحقق من الدومين إذا لزم الأمر

### خطأ Daily sending limit exceeded:
- **المشكلة**: تم تجاوز حد الإرسال اليومي
- **الحل**:
  - انتظر حتى اليوم التالي
  - ترقي خطة Brevo للحصول على حد أعلى

## اختبار الإعدادات:

تشغيل ملف الاختبار:
```bash
node test-brevo-connection.js
```

## معلومات مهمة:

1. **API Key vs SMTP Password**: يمكن استخدام نفس المفتاح للاثنين
2. **Free Plan Limits**: 
   - 300 إيميل/يوم
   - 9000 إيميل/شهر
3. **SMTP vs API**: 
   - SMTP: أسهل في الاستخدام مع nodemailer
   - API: أسرع وأكثر موثوقية

## روابط مفيدة:

- [Brevo Dashboard](https://app.brevo.com)
- [Brevo API Documentation](https://developers.brevo.com)
- [SMTP Settings Guide](https://help.brevo.com/hc/en-us/articles/209467485)

---

إذا استمرت المشاكل، تحقق من:
1. Status page: [status.brevo.com](https://status.brevo.com)
2. Support: في Dashboard → Help & Support