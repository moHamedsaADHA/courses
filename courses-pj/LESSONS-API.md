# 📘 واجهة برمجة تطبيقات الحصص (Lessons API)

توفر هذه الواجهة إدارة كاملة للحصص التعليمية (إنشاء، عرض، تحديث، حذف) مع دعم التصفية والبحث.

## ✅ المتطلبات الأساسية
- يجب أن يكون المستخدم مسجلاً الدخول
- لإنشاء/تحديث/حذف حصة: الدور يجب أن يكون `instructor` أو `admin`
- الحقول الأساسية للحصة:
  - `grade` : الصف الدراسي (مثال: الصف الأول الثانوي)
  - `unitTitle` : عنوان الوحدة
  - `lessonTitle` : عنوان الدرس
  - `videoUrl` : رابط فيديو (YouTube, Vimeo, Google Drive, mp4)

## 🧱 هيكل الحصة (Lesson Object)
```json
{
  "_id": "665f1b...",
  "grade": "الصف الأول الثانوي",
  "unitTitle": "الوحدة الأولى: أساسيات",
  "lessonTitle": "مقدمة في الخوارزميات",
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "createdBy": "665eaf...", 
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

### 1) إنشاء حصة جديدة
`POST /api/lessons`

#### الطلب (Request Body):
```json
{
  "grade": "الصف الأول الثانوي",
  "unitTitle": "الوحدة الأولى: البرمجة",
  "lessonTitle": "مقدمة في JavaScript",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```
#### الاستجابة الناجحة:
```json
{
  "message": "تم إنشاء الحصة بنجاح",
  "lesson": { ... }
}
```

---
### 2) جلب قائمة الحصص مع التصفية
`GET /api/lessons?grade=الصف الأول الثانوي&unit=الوحدة الأولى&search=Java&page=1&limit=10`

#### الاستجابة:
```json
{
  "page": 1,
  "pages": 3,
  "total": 25,
  "lessons": [ { ... }, { ... } ]
}
```

بارامترات مدعومة:
- `grade` : فلترة حسب الصف
- `unit` : فلترة حسب عنوان الوحدة
- `search` : بحث في عنوان الدرس أو الوحدة
- `page` : رقم الصفحة (افتراضي 1)
- `limit` : عدد العناصر لكل صفحة (افتراضي 20)

---
### 3) جلب حصة واحدة
`GET /api/lessons/:id`

#### الاستجابة:
```json
{ "lesson": { ... } }
```

---
### 4) تحديث حصة
`PUT /api/lessons/:id`

#### الطلب (أحد الحقول أو أكثر):
```json
{
  "lessonTitle": "مقدمة في البرمجة الكائنية",
  "videoUrl": "https://youtu.be/abcd1234"
}
```
#### الاستجابة:
```json
{ "message": "تم تحديث الحصة", "lesson": { ... } }
```

---
### 5) حذف حصة
`DELETE /api/lessons/:id`

#### الاستجابة:
```json
{ "message": "تم حذف الحصة بنجاح" }
```

---
## 🎯 مسارات جاهزة حسب الصف (Fixed Grade Endpoints)
للوصول مباشرة إلى حصص صف معين دون تمـرير بارامترات:

| الصف | Endpoint |
|------|----------|
| الصف الأول الثانوي | `GET /api/lessons/grade/1st-secondary` |
| الصف الثاني الثانوي (علمي) | `GET /api/lessons/grade/2nd-secondary-science` |
| الصف الثاني الثانوي (أدبي) | `GET /api/lessons/grade/2nd-secondary-literary` |
| الصف الثالث الثانوي (علمي) | `GET /api/lessons/grade/3rd-secondary-science` |
| الصف الثالث الثانوي (أدبي) | `GET /api/lessons/grade/3rd-secondary-literary` |

مثال:
```bash
curl http://localhost:3000/api/lessons/grade/3rd-secondary-science
```

يمكن أيضاً استخدام `GET /api/lessons?grade=الصف الأول الثانوي` لكن هذه المسارات أسهل للواجهة الأمامية.

---
## ⚠️ أخطاء محتملة
| الحالة | السبب |
|--------|-------|
| 400 | فشل الفاليديشن |
| 401 | لم يتم إرسال توكن |
| 403 | الحساب لا يملك صلاحية |
| 404 | الحصة غير موجودة |
| 500 | خطأ داخلي |

---
## 🧪 اختبار سريع عبر cURL
```bash
# تسجيل الدخول (مثال)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@coursesplatform.com","password":"Teacher2024@"}'

# إنشاء حصة
curl -X POST http://localhost:3000/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"grade":"الصف الأول الثانوي","unitTitle":"الوحدة الأولى","lessonTitle":"مقدمة","videoUrl":"https://youtu.be/dQw4w9WgXcQ"}'
```

---
## 👨‍🏫 بيانات حساب معلم جاهزة للاستخدام
- Email: `teacher@coursesplatform.com`
- Password: `Teacher2024@`

---
## 🚀 ملاحظات مستقبلية مقترحة
- إضافة دعم رفع ملفات PDF مرفقة للحصة
- إضافة حقل مدة الفيديو
- نظام تعليقات للطلاب
- ربط الحصة بكورس معين (courseId)

---
تم إعداد هذا الملف لتسهيل التكامل الأمامي (Frontend) والتجربة السريعة. لأي تعديل إضافي أخبرني. ✅
