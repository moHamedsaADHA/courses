# 👥 Get All Users API Documentation

## 📋 نظرة عامة
هذا الـ endpoint يسمح للإداريين بجلب جميع المستخدمين مع إمكانيات البحث والفلترة المتقدمة.

---

## 🔗 Endpoint Details

### **GET** `/api/users/all`

**الصلاحيات المطلوبة:** Admin فقط  
**المصادقة:** Bearer Token مطلوب

---

## 📝 Query Parameters

### **البحث والفلترة:**
- `name` - البحث في الاسم (غير حساس للحالة)
- `code` - البحث في الكود (غير حساس للحالة)
- `role` - فلترة حسب الدور (`student`, `instructor`, `admin`)
- `grade` - فلترة حسب الصف
- `isVerified` - فلترة حسب حالة التفعيل (`true`, `false`)

### **Pagination:**
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد العناصر لكل صفحة (افتراضي: 20)

---

## 📊 أمثلة الاستخدام

### **1. جلب جميع المستخدمين:**
```http
GET /api/users/all
Authorization: Bearer your_access_token
```

### **2. البحث بالاسم:**
```http
GET /api/users/all?name=محمد
Authorization: Bearer your_access_token
```

### **3. البحث بالكود:**
```http
GET /api/users/all?code=S123
Authorization: Bearer your_access_token
```

### **4. فلترة حسب الدور:**
```http
GET /api/users/all?role=student
Authorization: Bearer your_access_token
```

### **5. فلترة حسب الصف:**
```http
GET /api/users/all?grade=الصف الثالث الثانوي علمي
Authorization: Bearer your_access_token
```

### **6. فلترة المستخدمين المفعلين:**
```http
GET /api/users/all?isVerified=true
Authorization: Bearer your_access_token
```

### **7. بحث مركب مع pagination:**
```http
GET /api/users/all?role=student&grade=الصف الثالث الثانوي علمي&page=2&limit=10
Authorization: Bearer your_access_token
```

---

## 📤 Response Format

### **نجح الطلب (200):**
```json
{
  "success": true,
  "message": "تم جلب المستخدمين بنجاح",
  "data": [
    {
      "_id": "64f8a7b2c1234567890abcde",
      "name": "محمد أحمد علي",
      "email": "mohamed@example.com",
      "code": "S12345678",
      "role": "student",
      "grade": "الصف الثالث الثانوي علمي",
      "location": "القاهرة",
      "phone": "01234567890",
      "password": "myPassword123",
      "isVerified": true,
      "createdAt": "2025-10-14T10:30:00.000Z",
      "updatedAt": "2025-10-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "statistics": {
    "total": 150,
    "verified": 120,
    "unverified": 30,
    "byRole": {
      "student": 100,
      "instructor": 40,
      "admin": 10
    },
    "byGrade": {
      "الصف الأول الثانوي": 30,
      "الصف الثاني الثانوي علمي": 25,
      "الصف الثاني الثانوي ادبي": 20,
      "الصف الثالث الثانوي علمي": 15,
      "الصف الثالث الثانوي ادبي": 10
    }
  },
  "filters": {
    "role": "student",
    "grade": "الصف الثالث الثانوي علمي"
  }
}
```

### **خطأ في الصلاحيات (403):**
```json
{
  "success": false,
  "message": "ليس لديك صلاحية للوصول لهذا المورد"
}
```

### **خطأ في المصادقة (401):**
```json
{
  "success": false,
  "message": "يجب تسجيل الدخول أولاً"
}
```

---

## 🔍 ميزات البحث

### **1. البحث بالاسم:**
- غير حساس للحالة (Case Insensitive)
- يبحث في أي جزء من الاسم
- مثال: `name=محمد` سيجد "محمد أحمد" و "أحمد محمد"

### **2. البحث بالكود:**
- غير حساس للحالة
- يبحث في أي جزء من الكود
- مثال: `code=S123` سيجد "S12345678"

### **3. الفلترة المتعددة:**
- يمكن دمج عدة فلاتر معاً
- جميع الفلاتر تعمل بنظام AND

---

## 📊 الإحصائيات المتوفرة

### **إحصائيات عامة:**
- `total` - العدد الإجمالي للمستخدمين
- `verified` - عدد المستخدمين المفعلين
- `unverified` - عدد المستخدمين غير المفعلين

### **إحصائيات حسب الدور:**
- عدد المستخدمين لكل دور (student, instructor, admin)

### **إحصائيات حسب الصف:**
- عدد المستخدمين لكل صف دراسي

---

## ⚠️ ملاحظات أمنية

**⚠️ تحذير:** هذا الـ endpoint يعرض كلمات المرور بدون تشفير بناءً على طلب العميل. هذا **غير آمن** في البيئات الإنتاجية العادية.

**التوصيات:**
1. تأكد من تشفير الاتصال (HTTPS)
2. قصر الوصول على الإداريين فقط
3. تسجيل جميع محاولات الوصول للمراقبة
4. تقييد عدد الطلبات لمنع الإساءة

---

## 🚀 أداء محسن

### **الفهارس المستخدمة:**
- فهرس على `name` للبحث السريع
- فهرس على `code` للبحث السريع
- فهرس على `role` للفلترة
- فهرس على `grade` للفلترة
- فهرس على `isVerified` للفلترة

### **تحسينات:**
- استخدام `.lean()` للأداء الأفضل
- Pagination لتقليل البيانات المنقولة
- Aggregation للإحصائيات السريعة

---

## 🔧 مثال Frontend Integration

```javascript
// دالة لجلب المستخدمين مع البحث
async function getAllUsers(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/users/all?${params}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('فشل في جلب المستخدمين');
  }
}

// أمثلة للاستخدام
const allUsers = await getAllUsers();
const students = await getAllUsers({ role: 'student' });
const searchResults = await getAllUsers({ name: 'محمد', page: 1, limit: 10 });
```

---

**تم إنشاء الـ API بنجاح! 🎉**