# 📅 واجهة برمجة تطبيقات الجدول الدراسي (Schedule API)

توفر هذه الواجهة إدارة كاملة للجدول الدراسي مع إمكانية إنشاء وعرض وتعديل وحذف الجلسات التعليمية.

## ✅ المتطلبات الأساسية
- يجب أن يكون المستخدم مسجلاً الدخول
- لإنشاء/تحديث/حذف جدولة: الدور يجب أن يكون `instructor` أو `admin`
- الحقول الأساسية للجدولة:
  - `day` : اليوم (الأحد، الاثنين، إلخ.)
  - `subject` : المادة الدراسية
  - `date` : التاريخ (ISO 8601 format)
  - `timeFrom` : وقت البداية (HH:MM)
  - `timeTo` : وقت النهاية (HH:MM)
  - `grade` : الصف الدراسي
  - `instructor` : معرف المعلم

## 🧱 هيكل الجدولة (Schedule Object)
```json
{
  "_id": "665f1b...",
  "day": "الأحد",
  "subject": "الرياضيات",
  "date": "2025-09-20T00:00:00.000Z",
  "timeFrom": "08:00",
  "timeTo": "09:30",
  "grade": "الصف الأول الثانوي",
  "instructor": {
    "_id": "665eaf...",
    "name": "أحمد محمد",
    "email": "teacher@example.com"
  },
  "createdBy": {
    "_id": "665eaf...",
    "name": "أحمد محمد",
    "email": "teacher@example.com"
  },
  "createdAt": "2025-09-18T10:15:22.000Z"
}
```

## 🔐 المصادقة (Authentication)
أرسل التوكن في الهيدر:
```
Authorization: Bearer <JWT_TOKEN>
```

---
## 📍 المسارات (Endpoints)

### 1) إنشاء جدولة جديدة
`POST /api/schedule`

#### الطلب (Request Body):
```json
{
  "day": "الأحد",
  "subject": "الرياضيات",
  "date": "2025-09-20",
  "timeFrom": "08:00",
  "timeTo": "09:30",
  "grade": "الصف الأول الثانوي",
  "instructor": "665eaf123456789"
}
```
#### الاستجابة الناجحة:
```json
{
  "message": "تم إنشاء الجدولة بنجاح",
  "schedule": { ... }
}
```

### 2) جلب قائمة الجدولات مع التصفية
`GET /api/schedule?grade=الصف الأول الثانوي&day=الأحد&instructor=665eaf123&date=2025-09-20&page=1&limit=10`

#### الاستجابة:
```json
{
  "page": 1,
  "pages": 3,
  "total": 25,
  "schedules": [ { ... }, { ... } ]
}
```

بارامترات مدعومة:
- `grade` : فلترة حسب الصف
- `day` : فلترة حسب اليوم
- `instructor` : فلترة حسب معرف المعلم
- `date` : فلترة حسب التاريخ (YYYY-MM-DD)
- `page` : رقم الصفحة (افتراضي 1)
- `limit` : عدد العناصر لكل صفحة (افتراضي 20)

### 3) جلب جدولة واحدة
`GET /api/schedule/:id`

#### الاستجابة:
```json
{ "schedule": { ... } }
```

### 4) تحديث جدولة
`PUT /api/schedule/:id`

#### الطلب (أحد الحقول أو أكثر):
```json
{
  "timeFrom": "09:00",
  "timeTo": "10:30",
  "subject": "الفيزياء"
}
```
#### الاستجابة:
```json
{ "message": "تم تحديث الجدولة", "schedule": { ... } }
```

### 5) حذف جدولة
`DELETE /api/schedule/:id`

#### الاستجابة:
```json
{ "message": "تم حذف الجدولة بنجاح" }
```

---
## 📚 مسارات الجدولة حسب الصف (Grade-Specific Schedule Endpoints)

هذه مسارات مخصصة لجلب الجدولات حسب الصفوف الدراسية مع إمكانية فلترة إضافية:

### 1) جدولة الصف الأول الثانوي
`GET /api/schedule/grade/1st-secondary`

### 2) جدولة الصف الثاني الثانوي علمي
`GET /api/schedule/grade/2nd-secondary-science`

### 3) جدولة الصف الثاني الثانوي أدبي
`GET /api/schedule/grade/2nd-secondary-arts`

### 4) جدولة الصف الثالث الثانوي علمي
`GET /api/schedule/grade/3rd-secondary-science`

### 5) جدولة الصف الثالث الثانوي أدبي
`GET /api/schedule/grade/3rd-secondary-arts`

#### استخدام الفلترة الإضافية لكل صف:
`GET /api/schedule/grade/1st-secondary?day=الأحد&date=2025-09-20&instructor=665eaf123&page=1&limit=10`

#### الاستجابة الموحدة لجميع الصفوف:
```json
{
  "grade": "الصف الأول الثانوي",
  "page": 1,
  "pages": 2,
  "total": 15,
  "schedules": [
    {
      "_id": "665f1b...",
      "day": "الأحد",
      "subject": "الرياضيات",
      "date": "2025-09-20T00:00:00.000Z",
      "timeFrom": "08:00",
      "timeTo": "09:30",
      "grade": "الصف الأول الثانوي",
      "instructor": {
        "_id": "665eaf...",
        "name": "أحمد محمد",
        "email": "teacher@example.com"
      },
      "createdBy": {
        "_id": "665eaf...",
        "name": "أحمد محمد", 
        "email": "teacher@example.com"
      },
      "createdAt": "2025-09-18T10:15:22.000Z"
    }
  ]
}
```

#### بارامترات الفلترة المدعومة لجميع مسارات الصفوف:
- `day` : فلترة حسب اليوم
- `instructor` : فلترة حسب معرف المعلم
- `date` : فلترة حسب التاريخ (YYYY-MM-DD)
- `page` : رقم الصفحة (افتراضي 1)
- `limit` : عدد العناصر لكل صفحة (افتراضي 20)

---
## 🔒 قواعد الأمان والتحقق
- **منع التعارض**: النظام يتحقق من عدم وجود تعارض في جدولة المعلم
- **التحقق من الوقت**: وقت البداية يجب أن يكون قبل وقت النهاية
- **منع التواريخ الماضية**: لا يمكن إنشاء جدولات في التاريخ الماضي
- **الصلاحيات**: فقط منشئ الجدولة أو الأدمن يمكنهم تعديلها أو حذفها

---
## ⚠️ أخطاء محتملة
| الحالة | السبب |
|--------|-------|
| 400 | فشل الفاليديشن أو تعارض في الجدولة |
| 401 | لم يتم إرسال توكن |
| 403 | الحساب لا يملك صلاحية |
| 404 | الجدولة غير موجودة |
| 500 | خطأ داخلي |

---
## 🧪 اختبار سريع عبر cURL
```bash
# تسجيل الدخول كمعلم
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@coursesplatform.com","password":"Teacher2024@"}'

# إنشاء جدولة
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "day": "الأحد",
    "subject": "الرياضيات", 
    "date": "2025-09-22",
    "timeFrom": "08:00",
    "timeTo": "09:30",
    "grade": "الصف الأول الثانوي",
    "instructor": "68cb5ca962cc12d125e33cba"
  }'

# جلب جدولات الأحد
curl http://localhost:3000/api/schedule?day=الأحد
```

---
## 👨‍🏫 بيانات الحسابات الجاهزة
**معلم:**
- Email: `teacher@coursesplatform.com`
- Password: `Teacher2024@`
- ID: `68cb5ca962cc12d125e33cba`

**طالب:**
- Email: `student@coursesplatform.com`  
- Password: `Student2024@`

---
## 📝 ملاحظات إضافية
- **التوقيت**: يُستخدم تنسيق 24 ساعة (HH:MM)
- **التاريخ**: يُستخدم تنسيق ISO 8601 (YYYY-MM-DD)
- **الترتيب**: الجدولات مرتبة حسب التاريخ ثم وقت البداية
- **المناطق الزمنية**: يُفترض أن جميع الأوقات في المنطقة الزمنية المحلية

---
## 🚀 ميزات مستقبلية مقترحة
- إضافة تكرار أسبوعي للجدولات
- دعم العطل والإجازات
- تنبيهات قبل بداية الحصة
- ربط الجدولة بحصة معينة (lessonId)
- إضافة قاعة الدرس (classroom)

---
تم إعداد هذا الملف لتسهيل التكامل والاختبار. للمزيد من المعلومات أو التعديلات، تواصل معنا. ✅