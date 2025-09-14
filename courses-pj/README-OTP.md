# Course Platform - OTP Verification System

## 📧 نظام التحقق من OTP 

تم إضافة نظام التحقق من البريد الإلكتروني باستخدام رمز OTP إلى منصة الكورسات باستخدام خدمة Brevo.

## ✨ الميزات الجديدة

- **تسجيل الحساب مع OTP**: عند التسجيل، يتم إرسال رمز تحقق مكون من 6 أرقام
- **التحقق من OTP**: التحقق من الرمز وتفعيل الحساب
- **إعادة إرسال OTP**: إمكانية طلب رمز جديد في حالة انتهاء صلاحية الرمز
- **قالب بريد إلكتروني احترافي**: تصميم عربي جميل ومتجاوب
- **الحماية الأمنية**: انتهاء صلاحية الرمز خلال 15 دقيقة

## 🛠️ الإعداد والتثبيت

### 1. تثبيت Dependencies الجديدة

```bash
npm install node-fetch joi
```

### 2. إعداد متغيرات البيئة

إنشئ ملف `.env` وأضف المتغيرات التالية:

```env
# Brevo Email Service Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Course Platform
```

### 3. الحصول على Brevo API Key

1. اذهب إلى [Brevo](https://www.brevo.com/)
2. إنشئ حساب أو قم بتسجيل الدخول
3. اذهب إلى **SMTP & API** → **API Keys**
4. أنشئ مفتاح API جديد
5. انسخ المفتاح واستخدمه في `BREVO_API_KEY`
6. تأكد من أن البريد المستخدم في `BREVO_SENDER_EMAIL` معتمد في حساب Brevo

## 📡 API Endpoints الجديدة

### 1. تسجيل حساب جديد
```http
POST /auth/users/
```

**Request Body:**
```json
{
  "name": "محمد أحمد",
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "phone": "01234567890"
}
```

**Response:**
```json
{
  "message": "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
  "user": {...},
  "tempToken": "temporary_jwt_token",
  "requiresVerification": true
}
```

### 2. التحقق من OTP
```http
POST /auth/users/verify-otp
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "تم تفعيل الحساب بنجاح",
  "user": {...},
  "token": "permanent_jwt_token",
  "isVerified": true
}
```

### 3. إعادة إرسال OTP
```http
POST /auth/users/resend-otp
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني"
}
```

## 🗃️ التغييرات في قاعدة البيانات

تم إضافة الحقول التالية إلى مودل User:

```javascript
{
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
}
```

## 🔒 الحماية والأمان

- **انتهاء صلاحية OTP**: الرمز صالح لمدة 15 دقيقة فقط
- **التحقق من التفعيل**: middleware يمنع الوصول للحسابات غير المفعلة
- **Validation قوي**: التحقق من صحة البيانات المرسلة
- **معالجة الأخطاء**: رسائل خطأ واضحة ومفيدة

## 🎨 قالب البريد الإلكتروني

- تصميم عربي متجاوب
- ألوان احترافية
- معلومات أمنية مهمة
- تعليمات واضحة للمستخدم

## 🔄 سير العمل

1. **التسجيل**: المستخدم يسجل حساب جديد
2. **إرسال OTP**: يتم إرسال رمز تحقق إلى البريد الإلكتروني
3. **التحقق**: المستخدم يدخل الرمز للتفعيل
4. **التفعيل**: يصبح الحساب نشطاً ويحصل على توكن دائم

## 🚀 الاستخدام

1. تأكد من إعداد متغيرات البيئة بشكل صحيح
2. قم بتشغيل الخادم
3. استخدم endpoints الجديدة لتسجيل المستخدمين
4. تحقق من البريد الإلكتروني للحصول على OTP
5. فعل الحساب باستخدام الرمز

## 📝 ملاحظات مهمة

- تأكد من أن الإيميل المرسل معتمد في Brevo
- الرمز صالح لمدة 15 دقيقة فقط
- يمكن إعادة إرسال رمز جديد إذا انتهت الصلاحية
- التوكن المؤقت يتم استبداله بتوكن دائم بعد التفعيل