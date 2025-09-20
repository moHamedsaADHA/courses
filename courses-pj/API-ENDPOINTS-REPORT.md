# 📋 تقرير شامل لجميع API Endpoints - منصة الكورسات

## 📊 ملخص عام:
- **Base URL:** `https://courses-nine-eta.vercel.app`
- **Authentication:** JWT Bearer Token
- **Content-Type:** `application/json`

---

## 🔐 1. Authentication & Users (`/api/users`)

### تسجيل مستخدم جديد
- **Route:** `POST /api/users/`
- **Access:** Public
- **Description:** إنشاء حساب جديد
- **Request Body:**
```json
{
  "name": "الاسم الرباعي كامل",
  "email": "user@example.com", 
  "password": "Password123",
  "location": "المدينة",
  "grade": "الصف الأول الثانوي",
  "role": "student",
  "phone": "01012345678" // optional
}
```
- **Response:** User object + tempToken + OTP
- **Frontend:** استخدام `fetch()` مع POST method

### تسجيل الدخول
- **Route:** `POST /api/users/login`
- **Access:** Public
- **Description:** تسجيل دخول المستخدم
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```
- **Response:** JWT token + user data
- **Frontend:** حفظ token في localStorage

### تفعيل OTP
- **Route:** `POST /api/users/verify-otp`
- **Access:** Public
- **Description:** تفعيل الحساب برمز OTP
- **Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
- **Response:** JWT token + user data

### إعادة إرسال OTP
- **Route:** `POST /api/users/resend-otp`
- **Access:** Public
- **Description:** طلب OTP جديد
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```

### تغيير كلمة المرور
- **Route:** `POST /api/users/change-password`
- **Access:** Private (يحتاج Token)
- **Headers:** `Authorization: Bearer <token>`

### إعادة تعيين كلمة المرور
- **Route:** `POST /api/users/reset-password/request`
- **Access:** Public
- **Route:** `POST /api/users/reset-password/perform`
- **Access:** Public

---

## 📚 2. Courses (`/api/courses`)

### جلب جميع الكورسات
- **Route:** `GET /api/courses/`
- **Access:** Public
- **Description:** جلب قائمة بجميع الكورسات
- **Response:** Array of courses
- **Frontend:** 
```javascript
fetch('/api/courses/')
  .then(res => res.json())
  .then(courses => console.log(courses));
```

### إنشاء كورس جديد
- **Route:** `POST /api/courses/`
- **Access:** Private (Instructor/Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "title": "عنوان الكورس",
  "description": "وصف الكورس",
  "category": "categoryId",
  "price": 100,
  "duration": "3 أشهر",
  "level": "مبتدئ"
}
```

### جلب كورس محدد
- **Route:** `GET /api/courses/:id`
- **Access:** Public
- **Description:** جلب تفاصيل كورس واحد

### تحديث كورس
- **Route:** `PUT /api/courses/:id`
- **Access:** Private (Instructor/Admin only)
- **Headers:** `Authorization: Bearer <token>`

### حذف كورس
- **Route:** `DELETE /api/courses/:id`
- **Access:** Private (Instructor/Admin only)
- **Headers:** `Authorization: Bearer <token>`

### جلب كورسات المدرس
- **Route:** `GET /api/courses/instructor`
- **Access:** Private (Instructor only)
- **Headers:** `Authorization: Bearer <token>`

---

## 📖 3. Lessons (`/api/lessons`)

### جلب جميع الدروس
- **Route:** `GET /api/lessons/`
- **Access:** Public

### إنشاء درس جديد
- **Route:** `POST /api/lessons/`
- **Access:** Private (Instructor/Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "title": "عنوان الدرس",
  "description": "محتوى الدرس",
  "courseId": "courseId",
  "order": 1,
  "duration": "45 دقيقة"
}
```

### جلب درس محدد
- **Route:** `GET /api/lessons/:id`
- **Access:** Public

### تحديث درس
- **Route:** `PUT /api/lessons/:id`
- **Access:** Private (Instructor/Admin only)

### حذف درس
- **Route:** `DELETE /api/lessons/:id`
- **Access:** Private (Instructor/Admin only)

### جلب دروس حسب الصف
- **Route:** `GET /api/lessons/grade/:grade`
- **Access:** Public
- **Example:** `/api/lessons/grade/first-secondary`

---

## 📅 4. Schedule (`/api/schedule`)

### جلب جميع المواعيد
- **Route:** `GET /api/schedule/`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### إنشاء موعد جديد
- **Route:** `POST /api/schedule/`
- **Access:** Private (Instructor/Admin only)
- **Request Body:**
```json
{
  "day": "الأحد",
  "subject": "الرياضيات", 
  "date": "2025-09-20",
  "timeFrom": "10:00",
  "timeTo": "11:30",
  "grade": "الصف الأول الثانوي",
  "instructor": "instructorId"
}
```

### تحديث موعد
- **Route:** `PUT /api/schedule/:id`
- **Access:** Private (Instructor/Admin only)

### حذف موعد
- **Route:** `DELETE /api/schedule/:id`
- **Access:** Private (Instructor/Admin only)

---

## 📝 5. Tasks (`/api/tasks`)

### جلب جميع المهام
- **Route:** `GET /api/tasks/`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### إنشاء مهمة جديدة
- **Route:** `POST /api/tasks/`
- **Access:** Private (Instructor/Admin only)
- **Request Body:**
```json
{
  "title": "عنوان المهمة",
  "description": "تفاصيل المهمة",
  "dueDate": "2025-09-25",
  "grade": "الصف الثالث الثانوي علمي",
  "subject": "الفيزياء"
}
```

### جلب مهام حسب الصف
- **Route:** `GET /api/tasks/grade/:grade`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Available Grades:**
  - `/api/tasks/grade/first-secondary` - الصف الأول الثانوي
  - `/api/tasks/grade/second-secondary-science` - الصف الثاني علمي  
  - `/api/tasks/grade/second-secondary-literature` - الصف الثاني أدبي
  - `/api/tasks/grade/third-secondary-science` - الصف الثالث علمي
  - `/api/tasks/grade/third-secondary-literature` - الصف الثالث أدبي

### تحديث مهمة
- **Route:** `PUT /api/tasks/:id`
- **Access:** Private (Instructor/Admin only)

### حذف مهمة
- **Route:** `DELETE /api/tasks/:id`
- **Access:** Private (Instructor/Admin only)

---

## 🎯 6. Quizzes (`/api/quizzes`)

### جلب جميع الاختبارات
- **Route:** `GET /api/quizzes/`
- **Access:** Private

### إنشاء اختبار جديد
- **Route:** `POST /api/quizzes/`
- **Access:** Private (Instructor/Admin only)
- **Request Body:**
```json
{
  "title": "اختبار الفيزياء",
  "description": "اختبار الوحدة الأولى",
  "questions": [
    {
      "question": "ما هو قانون نيوتن الأول؟",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
      "correctAnswer": 0
    }
  ],
  "grade": "الصف الثالث الثانوي علمي",
  "subject": "الفيزياء",
  "timeLimit": 60
}
```

### جلب اختبارات حسب الصف
- **Route:** `GET /api/quizzes/grade/:grade`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Available Grades:**
  - `/api/quizzes/grade/first-secondary` - الصف الأول الثانوي
  - `/api/quizzes/grade/second-secondary-science` - الصف الثاني علمي
  - `/api/quizzes/grade/second-secondary-literature` - الصف الثاني أدبي
  - `/api/quizzes/grade/third-secondary-science` - الصف الثالث علمي
  - `/api/quizzes/grade/third-secondary-literature` - الصف الثالث أدبي

---

## 🏷️ 7. Categories (`/api/categories`)

### جلب جميع الفئات
- **Route:** `GET /api/categories/`
- **Access:** Public

### إنشاء فئة جديدة
- **Route:** `POST /api/categories/`
- **Access:** Private (Admin only)
- **Request Body:**
```json
{
  "name": "اسم الفئة",
  "description": "وصف الفئة"
}
```

### تحديث فئة
- **Route:** `PUT /api/categories/:id`
- **Access:** Private (Admin only)

### حذف فئة
- **Route:** `DELETE /api/categories/:id`
- **Access:** Private (Admin only)

---

## 🔧 8. System Endpoints

### حالة النظام
- **Route:** `GET /`
- **Access:** Public
- **Response:** System status

### اختبار الصحة
- **Route:** `GET /api/health`
- **Access:** Public
- **Response:** Health check

### اختبار Ping
- **Route:** `GET /ping`
- **Access:** Public
- **Response:** "pong"

---

## 📱 Frontend Integration Examples

### تسجيل دخول وحفظ Token:
```javascript
async function login(email, password) {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### استخدام Token في الطلبات:
```javascript
async function fetchProtectedData(endpoint) {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### جلب المهام حسب الصف:
```javascript
async function getTasksByGrade(grade) {
  const gradeMapping = {
    'الصف الأول الثانوي': 'first-secondary',
    'الصف الثاني الثانوي علمي': 'second-secondary-science',
    'الصف الثاني الثانوي أدبي': 'second-secondary-literature',
    'الصف الثالث الثانوي علمي': 'third-secondary-science',
    'الصف الثالث الثانوي أدبي': 'third-secondary-literature'
  };
  
  const gradeParam = gradeMapping[grade];
  return await fetchProtectedData(`/api/tasks/grade/${gradeParam}`);
}
```

### ⚠️ مهم - Grade Parameters:
يجب استخدام الـ English parameters في الـ URLs:
- `first-secondary` ← الصف الأول الثانوي
- `second-secondary-science` ← الصف الثاني الثانوي علمي  
- `second-secondary-literature` ← الصف الثاني الثانوي أدبي
- `third-secondary-science` ← الصف الثالث الثانوي علمي
- `third-secondary-literature` ← الصف الثالث الثانوي أدبي

---

## 🚨 Error Codes & Troubleshooting

### Authentication Errors:
- `401 Unauthorized` - Token مفقود أو غير صالح
- `403 Forbidden` - المستخدم لا يملك صلاحية

### Common 401 Causes:
1. **Missing Authorization Header:**
   ```javascript
   // ❌ خطأ - بدون Authorization header
   fetch('/api/tasks/grade/third-secondary-literature')
   
   // ✅ صحيح - مع Authorization header
   fetch('/api/tasks/grade/third-secondary-literature', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     }
   })
   ```

2. **Token منتهي الصلاحية** - اعمل login جديد
3. **Token غير صحيح** - تأكد من حفظ Token صح

### Validation Errors:
- `400 Bad Request` - بيانات غير صحيحة
- `422 Unprocessable Entity` - فشل validation

### Server Errors:
- `500 Internal Server Error` - خطأ في الخادم
- `503 Service Unavailable` - قاعدة البيانات غير متاحة

---

## 📋 الحسابات التجريبية الجاهزة:

### Admin:
- **Email:** `admin@courses.com`
- **Password:** `Admin@123`

### Instructor:
- **Email:** `instructor@courses.com`
- **Password:** `Instructor@123`

### Student:
- **Email:** `student@courses.com`
- **Password:** `Student@123`

---

*تم إنشاء التقرير في: سبتمبر 2025*