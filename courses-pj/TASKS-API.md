# 📚 نظام إدارة المهام والواجبات - API Documentation

## 🌟 نظرة عامة

نظام شامل لإدارة المهام والواجبات المدرسية مصمم خصيصاً للمراحل الثانوية (الصف الأول إلى الثالث الثانوي). يوفر النظام إدارة كاملة للمهام مع تصنيف حسب الصف والمادة والأولوية.

## 📋 المميزات الرئيسية

- ✅ **إنشاء وإدارة المهام**: إضافة، تعديل، وحذف المهام
- 🎯 **تصنيف حسب الصف**: 5 مستويات دراسية مختلفة
- 📊 **نظام الأولوية**: منخفض، متوسط، عالي، عاجل
- ⏰ **إدارة المواعيد**: تتبع تواريخ التسليم وإنذارات الانتهاء
- 📎 **المرفقات**: إضافة ملفات وروابط للمهام
- 📈 **إحصائيات تفصيلية**: تقارير شاملة حول حالة المهام
- 🔍 **بحث وفلترة**: بحث متقدم حسب عدة معايير

## 🎓 الصفوف المدعومة

1. **الصف الأول الثانوي**
2. **الصف الثاني الثانوي علمي**
3. **الصف الثاني الثانوي أدبي**
4. **الصف الثالث الثانوي علمي**
5. **الصف الثالث الثانوي أدبي**

## 🚀 البدء السريع

### Base URL
```
http://localhost:3000/api/tasks
```

### المصادقة المطلوبة
جميع الطلبات تتطلب تسجيل الدخول:
```bash
Authorization: Bearer <your-jwt-token>
```

---

## 📝 API Endpoints

### 1. إدارة المهام العامة

#### إنشاء مهمة جديدة
**POST** `/api/tasks`

**الصلاحيات المطلوبة:** `instructor`, `admin`

**Body:**
```json
{
  "title": "مراجعة الوحدة الأولى في الفيزياء",
  "description": "حل جميع تمارين الوحدة الأولى في كتاب الفيزياء مع التركيز على قوانين نيوتن",
  "dueDate": "2024-02-15T23:59:59Z",
  "grade": "الصف الثالث الثانوي علمي",
  "subject": "فيزياء",
  "priority": "عالي",
  "status": "نشط",
  "attachments": [
    {
      "filename": "تمارين_الوحدة_الأولى.pdf",
      "url": "https://example.com/files/physics-unit1.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء المهمة بنجاح",
  "data": {
    "_id": "65f8a2b3c4d5e6f7g8h9i0j1",
    "title": "مراجعة الوحدة الأولى في الفيزياء",
    "description": "حل جميع تمارين الوحدة الأولى...",
    "dueDate": "2024-02-15T23:59:59.000Z",
    "grade": "الصف الثالث الثانوي علمي",
    "subject": "فيزياء",
    "priority": "عالي",
    "status": "نشط",
    "attachments": [...],
    "createdBy": {
      "_id": "...",
      "name": "أ. محمد أحمد",
      "email": "teacher@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### جلب جميع المهام
**GET** `/api/tasks`

**Query Parameters:**
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد النتائج في الصفحة (افتراضي: 10)
- `grade`: الصف
- `subject`: المادة
- `status`: الحالة (`نشط`, `منتهي`, `ملغي`)
- `priority`: الأولوية (`منخفض`, `متوسط`, `عالي`, `عاجل`)
- `search`: بحث نصي في العنوان والوصف
- `dueDateFrom`: تاريخ البداية
- `dueDateTo`: تاريخ النهاية
- `sortBy`: ترتيب حسب (`dueDate`, `priority`, `createdAt`)
- `sortOrder`: اتجاه الترتيب (`asc`, `desc`)

**مثال:**
```bash
GET /api/tasks?grade=الصف الثالث الثانوي علمي&status=نشط&sortBy=dueDate&sortOrder=asc
```

#### جلب مهمة واحدة
**GET** `/api/tasks/:id`

**Response:**
```json
{
  "success": true,
  "message": "تم جلب المهمة بنجاح",
  "data": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "additionalInfo": {
      "isExpired": false,
      "daysUntilDue": 7,
      "canEdit": true,
      "attachmentCount": 2
    }
  }
}
```

#### تحديث مهمة
**PUT** `/api/tasks/:id`

**الصلاحيات:** منشئ المهمة أو admin

**Body:** (جميع الحقول اختيارية)
```json
{
  "title": "عنوان محدث",
  "description": "وصف محدث",
  "dueDate": "2024-02-20T23:59:59Z",
  "priority": "عاجل",
  "status": "نشط"
}
```

#### حذف مهمة
**DELETE** `/api/tasks/:id`

**الصلاحيات:** منشئ المهمة أو admin

---

### 2. المهام حسب الصف

#### مهام الصف الأول الثانوي
**GET** `/api/tasks/grade/first-secondary`

#### مهام الصف الثاني الثانوي علمي
**GET** `/api/tasks/grade/second-secondary-science`

#### مهام الصف الثاني الثانوي أدبي
**GET** `/api/tasks/grade/second-secondary-literature`

#### مهام الصف الثالث الثانوي علمي
**GET** `/api/tasks/grade/third-secondary-science`

#### مهام الصف الثالث الثانوي أدبي
**GET** `/api/tasks/grade/third-secondary-literature`

**Query Parameters لجميع endpoints الصفوف:**
- `page`, `limit`: للصفحات
- `subject`: فلترة حسب المادة
- `status`: فلترة حسب الحالة
- `priority`: فلترة حسب الأولوية
- `search`: البحث النصي
- `dueDateFrom`, `dueDateTo`: فترة زمنية
- `sortBy`, `sortOrder`: الترتيب

**مثال Response للصف الثالث علمي:**
```json
{
  "success": true,
  "message": "تم جلب مهام الصف الثالث الثانوي علمي بنجاح",
  "grade": "الصف الثالث الثانوي علمي",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalTasks": 25,
    "hasNext": true,
    "hasPrev": false
  },
  "statistics": {
    "gradeOverview": {
      "totalTasks": 25,
      "activeTasks": 20,
      "expiredTasks": 3,
      "cancelledTasks": 2,
      "urgentTasks": 5,
      "highPriorityTasks": 8
    },
    "subjectBreakdown": [
      { "_id": "فيزياء", "count": 8, "activeTasks": 7, "urgentTasks": 2 },
      { "_id": "كيمياء", "count": 7, "activeTasks": 6, "urgentTasks": 1 },
      { "_id": "أحياء", "count": 6, "activeTasks": 5, "urgentTasks": 1 }
    ],
    "upcomingDeadlines": [
      {
        "_id": "...",
        "title": "امتحان الفيزياء الشهري",
        "dueDate": "2024-01-20T23:59:59.000Z",
        "subject": "فيزياء",
        "priority": "عاجل"
      }
    ]
  }
}
```

---

## 📊 نموذج البيانات

### Task Schema
```javascript
{
  title: String,           // عنوان المهمة (مطلوب)
  description: String,     // وصف المهمة (مطلوب)
  dueDate: Date,          // تاريخ التسليم (مطلوب)
  grade: String,          // الصف (enum - مطلوب)
  subject: String,        // المادة (مطلوب)
  priority: String,       // الأولوية (enum - افتراضي: متوسط)
  status: String,         // الحالة (enum - افتراضي: نشط)
  attachments: [{}],      // المرفقات (اختياري)
  createdBy: ObjectId,    // منشئ المهمة (مطلوب)
  updatedBy: ObjectId,    // آخر محدث
  createdAt: Date,        // تاريخ الإنشاء
  updatedAt: Date         // تاريخ آخر تحديث
}
```

### الحالات المسموحة (Status)
- `نشط`: المهمة جارية
- `منتهي`: انتهت صلاحية المهمة
- `ملغي`: تم إلغاء المهمة

### مستويات الأولوية (Priority)
- `منخفض`: مهمة عادية
- `متوسط`: أولوية متوسطة (افتراضي)
- `عالي`: مهمة مهمة
- `عاجل`: مهمة عاجلة جداً

---

## 🔍 أمثلة الاستخدام

### 1. إنشاء مهمة عاجلة للثانوية العامة
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title": "مراجعة نهائية للفيزياء",
    "description": "مراجعة شاملة لجميع وحدات الفيزياء استعداداً للامتحان النهائي",
    "dueDate": "2024-05-30T23:59:59Z",
    "grade": "الصف الثالث الثانوي علمي",
    "subject": "فيزياء",
    "priority": "عاجل"
  }'
```

### 2. البحث عن مهام الرياضيات للصف الثاني
```bash
GET /api/tasks/grade/second-secondary-science?subject=رياضيات&status=نشط&sortBy=dueDate
```

### 3. جلب المهام العاجلة في الأسبوع القادم
```bash
GET /api/tasks?priority=عاجل&dueDateFrom=2024-01-15&dueDateTo=2024-01-22&sortBy=dueDate
```

---

## ⚠️ معالجة الأخطاء

### رموز الاستجابة
- `200`: نجح الطلب
- `201`: تم إنشاء المورد بنجاح
- `400`: بيانات غير صحيحة
- `401`: غير مخول (يتطلب تسجيل دخول)
- `403`: ممنوع (صلاحيات غير كافية)
- `404`: المورد غير موجود
- `409`: تضارب في البيانات
- `500`: خطأ في الخادم

### نموذج الأخطاء
```json
{
  "success": false,
  "message": "وصف الخطأ",
  "errors": [
    {
      "field": "title",
      "message": "عنوان المهمة مطلوب"
    }
  ]
}
```

---

## 🚀 نصائح للتحسين

### 1. استخدام الفلاتر
```bash
# فلترة حسب عدة معايير
GET /api/tasks?grade=الصف الثالث الثانوي علمي&priority=عالي&status=نشط
```

### 2. البحث النصي
```bash
# البحث في العناوين والأوصاف
GET /api/tasks?search=فيزياء نيوتن
```

### 3. الترتيب المخصص
```bash
# ترتيب حسب الأولوية ثم التاريخ
GET /api/tasks?sortBy=priority&sortOrder=desc
```

---

## 📈 الإحصائيات المتوفرة

### إحصائيات عامة
- إجمالي المهام
- المهام النشطة
- المهام المنتهية
- المهام الملغية
- المهام العاجلة

### إحصائيات حسب المادة
- عدد المهام لكل مادة
- المهام النشطة لكل مادة
- المهام العاجلة لكل مادة

### إشعارات المواعيد
- المهام قريبة الانتهاء (خلال أسبوع)
- المهام المنتهية الصلاحية

---

## 🔒 الأمان والصلاحيات

### مستويات الصلاحيات
1. **student**: قراءة المهام فقط
2. **instructor**: إنشاء وتعديل وحذف المهام المنشأة من قبله
3. **admin**: صلاحيات كاملة على جميع المهام

### حماية البيانات
- جميع الطلبات محمية بـ JWT
- تشفير كلمات المرور
- فلترة وتطهير المدخلات
- حماية من هجمات الحقن

---

## 📞 الدعم الفني

لأي استفسارات أو مساعدة تقنية:
- 📧 البريد الإلكتروني: support@example.com
- 📱 واتساب: +20123456789
- 🌐 الموقع الإلكتروني: https://example.com

---

**آخر تحديث:** يناير 2024  
**الإصدار:** 1.0.0