# 🧪 اختبار النظام الجديد - الاسم الرباعي والصف الدراسي

## 📋 خطوات الاختبار

### 1. تسجيل مستخدم جديد

```bash
curl -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محمد أحمد علي السيد",
    "email": "test@example.com",
    "password": "TestPass123",
    "location": "القاهرة",
    "grade": "الصف الثالث الثانوي",
    "role": "student",
    "phone": "01012345678"
  }'
```

**النتيجة المتوقعة:**
- إنشاء حساب جديد
- الاسم الكامل يتكون تلقائياً من الأسماء الأربعة
- إرسال OTP للبريد الإلكتروني

### 2. تفعيل الحساب

```bash
curl -X POST http://localhost:3000/api/users/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### 3. تسجيل الدخول (النظام الجديد)

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "grade": "الصف الثالث الثانوي"
  }'
```

**ملاحظة:** يجب إدخال نفس الصف الدراسي المسجل به

## 🔧 اختبار حالات الخطأ

### 1. تسجيل دخول بصف مختلف
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "grade": "الصف الأول الثانوي"
  }'
```
**النتيجة المتوقعة:** خطأ 401 - بيانات تسجيل الدخول غير صحيحة

### 2. تسجيل بصف غير صحيح
```bash
curl -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد حسن علي",
    "email": "test2@example.com",
    "password": "TestPass123",
    "location": "الإسكندرية",
    "grade": "صف غير موجود"
  }'
```
**النتيجة المتوقعة:** خطأ 400 - صف دراسي غير صحيح

### 3. كلمة مرور ضعيفة
```bash
curl -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "سارة محمود أحمد محمد",
    "email": "test3@example.com",
    "password": "123",
    "location": "الجيزة",
    "grade": "الصف الثاني الإعدادي"
  }'
```

### 4. اسم غير رباعي (أقل من 4 كلمات)
```bash
curl -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد علي",
    "email": "test4@example.com",
    "password": "TestPass123",
    "location": "الأقصر",
    "grade": "الصف الأول الثانوي"
  }'
```
**النتيجة المتوقعة:** خطأ 400 - كلمة مرور لا تلبي المتطلبات

## ✅ قائمة التحقق

- [ ] إنشاء حساب بالأسماء الأربعة
- [ ] تكوين الاسم الكامل تلقائياً
- [ ] إرسال OTP بنجاح
- [ ] تفعيل الحساب
- [ ] تسجيل دخول بالبريد والباسورد والصف
- [ ] منع تسجيل الدخول بصف مختلف
- [ ] validation للاسم الرباعي (حروف فقط، 4 كلمات على الأقل)
- [ ] منع الأسماء أقل من 4 كلمات
- [ ] validation لكلمة المرور القوية
- [ ] validation للصف الدراسي
- [ ] validation لرقم الهاتف المصري
- [ ] رسائل خطأ بالعربية

## 🌐 بيانات تجريبية

```json
{
  "مستخدم ابتدائي": {
    "name": "فاطمة أحمد محمد حسن",
    "email": "fatema@test.com",
    "password": "Student123",
    "location": "المنصورة",
    "grade": "الصف الخامس الابتدائي",
    "role": "student"
  },
  "مستخدم إعدادي": {
    "name": "يوسف خالد عبدالله إبراهيم",
    "email": "youssef@test.com",
    "password": "Student456",
    "location": "أسوان",
    "grade": "الصف الثاني الإعدادي",
    "role": "student"
  },
  "معلم": {
    "name": "أستاذ محمد أحمد علي",
    "email": "teacher@test.com",
    "password": "Teacher789",
    "location": "الأقصر",
    "grade": "معلم",
    "role": "instructor"
  },
  "طالب جامعي": {
    "name": "مريم سامح فؤاد الشريف",
    "email": "mariam@test.com",
    "password": "University123",
    "location": "الإسكندرية",
    "grade": "جامعي",
    "role": "student"
  }
}
```

---

**تاريخ الإنشاء:** سبتمبر 2025
**الحالة:** جاهز للاختبار