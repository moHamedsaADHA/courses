# 📱 Course Platform - Frontend API Documentation

## 🌐 Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication & User Management

### 1. تسجيل مستخدم جديد
```http
POST /users/
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "محمد أحمد علي السيد",
  "email": "mohamed@example.com", 
  "password": "MyPass123",
  "location": "القاهرة",
  "grade": "الصف الثالث الثانوي",
  "role": "student", // or "instructor" or "admin"
  "phone": "01012345678" // optional
}
```

**الصفوف الدراسية المتاحة:**
- الصف الأول الابتدائي إلى الصف السادس الابتدائي
- الصف الأول الإعدادي إلى الصف الثالث الإعدادي  
- الصف الأول الثانوي إلى الصف الثالث الثانوي
- جامعي
- معلم

**Response (201):**
```json
{
  "message": "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
  "user": {
    "_id": "user_id",
    "name": "محمد أحمد علي السيد",
    "email": "mohamed@example.com",
    "location": "القاهرة",
    "grade": "الصف الثالث الثانوي",
    "role": "student",
    "isVerified": false
  },
  "tempToken": "temporary_jwt_token",
  "requiresVerification": true
}
```

### 2. تفعيل الحساب - التحقق من OTP
```http
POST /users/verify-otp
```

**Body:**
```json
{
  "email": "mohamed@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "تم تفعيل الحساب بنجاح",
  "user": {
    "_id": "user_id",
    "name": "محمد أحمد", 
    "email": "mohamed@example.com",
    "role": "student",
    "isVerified": true
  },
  "token": "permanent_jwt_token",
  "isVerified": true
}
```

### 3. إعادة إرسال OTP
```http
POST /users/resend-otp
```

**Body:**
```json
{
  "email": "mohamed@example.com"
}
```

**Response (200):**
```json
{
  "message": "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني"
}
```

### 4. تسجيل الدخول
```http
POST /users/login
```

**Body:**
```json
{
  "email": "mohamed@example.com",
  "password": "MyPass123",
  "grade": "الصف الثالث الثانوي"
}
```

**Response (200):**
```json
{
  "message": "تم تسجيل الدخول بنجاح",
  "user": {
    "id": "user_id",
    "name": "محمد أحمد علي السيد",
    "email": "mohamed@example.com",
    "location": "القاهرة",
    "grade": "الصف الثالث الثانوي",
    "role": "student",
    "phone": "01012345678",
    "isVerified": true
  },
  "token": "jwt_token_here"
}
```

**ملاحظات مهمة:**
- يجب إدخال البريد الإلكتروني وكلمة المرور والصف الدراسي معاً
- الحساب يجب أن يكون مفعلاً بـ OTP
- الصف الدراسي يجب أن يطابق الصف المسجل به المستخدم

### 5. تغيير كلمة المرور
```http
POST /users/change-password
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

### 6. طلب إعادة تعيين كلمة المرور
```http
POST /users/reset-password/request
```

**Body:**
```json
{
  "email": "mohamed@example.com"
}
```

### 7. تنفيذ إعادة تعيين كلمة المرور
```http
POST /users/reset-password/perform
```

**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password"
}
```

---

## 📚 Course Management

### 1. الحصول على جميع الكورسات
```http
GET /courses/
```

**Response (200):**
```json
[
  {
    "_id": "course_id",
    "title": "اسم الكورس",
    "description": "وصف الكورس",
    "price": 299,
    "category": "category_id",
    "instructorId": "instructor_id",
    "createdAt": "2025-09-15T10:30:00.000Z"
  }
]
```

### 2. إنشاء كورس جديد (مدرس/أدمن فقط)
```http
POST /courses/
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "title": "اسم الكورس",
  "description": "وصف الكورس",
  "price": 299,
  "category": "category_id",
  "duration": "10 ساعات"
}
```

**Response (201):**
```json
{
  "_id": "course_id",
  "title": "اسم الكورس",
  "description": "وصف الكورس", 
  "price": 299,
  "category": "category_id",
  "instructorId": "instructor_id",
  "duration": "10 ساعات"
}
```

### 3. تحديث كورس (مدرس/أدمن فقط)
```http
PUT /courses/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here",
  "Content-Type": "application/json"
}
```

**Body:** (نفس body الإنشاء)

### 4. حذف كورس (مدرس/أدمن فقط)
```http
DELETE /courses/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

### 5. الحصول على قائمة كورسات
```http
GET /courses/list
```

---

## 🏷️ Category Management

### 1. الحصول على جميع الفئات
```http
GET /categories/
```

**Response (200):**
```json
[
  {
    "_id": "category_id",
    "name": "اسم الفئة",
    "description": "وصف الفئة"
  }
]
```

### 2. إنشاء فئة جديدة
```http
POST /categories/
```

**Body:**
```json
{
  "name": "اسم الفئة",
  "description": "وصف الفئة"
}
```

### 3. الحصول على فئة محددة
```http
GET /categories/:id
```

### 4. تحديث فئة
```http
PUT /categories/:id
```

**Body:**
```json
{
  "name": "اسم الفئة المحدث",
  "description": "وصف الفئة المحدث"
}
```

### 5. حذف فئة
```http
DELETE /categories/:id
```

---

## 👨‍🎓 Student Area

### الوصول لمنطقة الطالب
```http
GET /students/
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Response (200):**
```json
{
  "message": "student area"
}
```

---

## 👨‍🏫 Instructor Area

### الوصول لمنطقة المدرس
```http
GET /instructors/
```

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Note:** يتطلب صلاحية instructor أو admin

---

## 🔒 Authentication Rules

### Authorization Header
جميع الطلبات المحمية تحتاج لـ Header التالي:
```
Authorization: Bearer your_jwt_token_here
```

### User Roles
- **student**: طالب عادي
- **instructor**: مدرس (يمكنه إنشاء/تعديل الكورسات)
- **admin**: مدير (جميع الصلاحيات)

### Account Verification
- بعد التسجيل، يجب تفعيل الحساب بـ OTP
- الحسابات غير المفعلة لا يمكنها الوصول للمحتوى المحمي

---

## 📋 Validation Rules

### User Registration
- **name**: مطلوب، الاسم الرباعي كاملاً (10-100 حرف، حروف عربية أو إنجليزية فقط، يجب أن يحتوي على 4 كلمات على الأقل)
- **email**: مطلوب، بريد إلكتروني صالح، فريد
- **password**: مطلوب، 8 أحرف على الأقل، يجب أن يحتوي على حرف كبير وصغير ورقم
- **location**: مطلوب، نص (2-50 حرف)
- **grade**: مطلوب، اختيار من الصفوف الدراسية المحددة
- **role**: مطلوب، قيم مسموحة: student, instructor, admin
- **phone**: اختياري، رقم هاتف مصري صحيح (يبدأ بـ 010, 011, 012, أو 015)

### User Login  
- **email**: مطلوب، بريد إلكتروني صالح
- **password**: مطلوب، 8 أحرف على الأقل
- **grade**: مطلوب، يجب أن يطابق الصف الدراسي المسجل

### OTP Verification
- **email**: مطلوب، بريد إلكتروني صالح
- **otp**: مطلوب، 6 أرقام بالضبط

### Course Creation
- **title**: مطلوب، نص
- **description**: مطلوب، نص
- **price**: مطلوب، رقم
- **category**: مطلوب، معرف فئة صالح

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "بيانات غير صالحة",
  "errors": ["رسائل الخطأ التفصيلية"]
}
```

### 401 Unauthorized
```json
{
  "message": "لا يوجد رمز مصادقة"
}
```

### 403 Forbidden
```json
{
  "message": "يجب تفعيل الحساب أولاً",
  "requiresVerification": true,
  "userEmail": "user@example.com"
}
```

### 404 Not Found
```json
{
  "message": "المستخدم غير موجود"
}
```

### 500 Internal Server Error
```json
{
  "message": "خطأ في الخادم",
  "error": "تفاصيل الخطأ"
}
```

---

## 🚀 Frontend Implementation Examples

### JavaScript/Fetch Example
```javascript
// تسجيل مستخدم جديد
const registerUser = async (formData) => {
  const userData = {
    name: formData.name, // الاسم الرباعي كاملاً
    email: formData.email,
    password: formData.password,
    location: formData.location,
    grade: formData.grade,
    role: 'student', // أو حسب الاختيار
    phone: formData.phone // اختياري
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // نجح التسجيل - اذهب لصفحة OTP
      localStorage.setItem('tempToken', result.tempToken);
      localStorage.setItem('userEmail', result.user.email);
      window.location.href = '/verify-otp';
    } else {
      // عرض رسائل الخطأ
      if (result.errors && Array.isArray(result.errors)) {
        result.errors.forEach(error => {
          console.error('Validation Error:', error.msg);
        });
      } else {
        alert(result.message);
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// تسجيل الدخول
const loginUser = async (email, password, grade) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, grade })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // نجح تسجيل الدخول
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = '/dashboard';
    } else if (response.status === 403 && result.requiresVerification) {
      // الحساب غير مفعل - اذهب لصفحة التفعيل
      localStorage.setItem('userEmail', result.userEmail);
      window.location.href = '/verify-otp';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

// التحقق من OTP
const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // نجح التفعيل - احفظ التوكن واذهب للداشبورد
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = '/dashboard';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
  }
};

// طلب محمي بـ Authorization
const getProtectedData = async () => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/courses/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 403) {
      // الحساب غير مفعل
      const result = await response.json();
      if (result.requiresVerification) {
        window.location.href = '/verify-otp';
        return;
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
  }
};
```

---

## 📝 Notes for Frontend Developers

1. **احفظ التوكن**: استخدم localStorage أو sessionStorage لحفظ JWT token
2. **تحقق من التفعيل**: تعامل مع حالة requiresVerification في الاستجابات
3. **معالجة الأخطاء**: اعرض رسائل الخطأ المناسبة للمستخدم
4. **Loading States**: اعرض مؤشرات التحميل أثناء الطلبات
5. **Token Expiry**: تعامل مع انتهاء صلاحية التوكن وأعد توجيه للدخول
6. **Form Validation**: تحقق من البيانات في الفرونت إند قبل الإرسال
7. **CORS**: تأكد من إعداد CORS بشكل صحيح في الباك إند

---

## 🔄 Typical User Flow

1. **التسجيل**: POST /users/ → احصل على tempToken
2. **OTP**: تحقق من البريد → POST /users/verify-otp → احصل على token دائم
3. **التصفح**: استخدم التوكن للوصول للمحتوى المحمي
4. **إنشاء المحتوى**: (للمدرسين) POST /courses/ مع Authorization header

---

## 📚 الصفوف الدراسية المتاحة

### المرحلة الابتدائية
- الصف الأول الابتدائي
- الصف الثاني الابتدائي  
- الصف الثالث الابتدائي
- الصف الرابع الابتدائي
- الصف الخامس الابتدائي
- الصف السادس الابتدائي

### المرحلة الإعدادية
- الصف الأول الإعدادي
- الصف الثاني الإعدادي
- الصف الثالث الإعدادي

### المرحلة الثانوية
- الصف الأول الثانوي
- الصف الثاني الثانوي
- الصف الثالث الثانوي

### مراحل أخرى
- جامعي
- معلم

---

## 🎯 نصائح للفرونت إند

### 1. نموذج التسجيل
```html
<form id="registerForm">
  <input type="text" name="name" placeholder="الاسم الرباعي كاملاً" required 
         minlength="10" maxlength="100">
  <small>مثال: محمد أحمد علي السيد</small>
  
  <input type="email" name="email" placeholder="البريد الإلكتروني" required>
  <input type="password" name="password" placeholder="كلمة المرور" required 
         pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$">
  <small>يجب أن تحتوي على حرف كبير وصغير ورقم (8 أحرف على الأقل)</small>
  
  <input type="text" name="location" placeholder="المكان" required>
  <select name="grade" required>
    <option value="">اختر الصف الدراسي</option>
    <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
    <!-- باقي الصفوف... -->
  </select>
  <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)" 
         pattern="^01[0-2,5]{1}[0-9]{8}$">
  <button type="submit">تسجيل</button>
</form>
```

### 2. نموذج تسجيل الدخول
```html
<form id="loginForm">
  <input type="email" name="email" placeholder="البريد الإلكتروني" required>
  <input type="password" name="password" placeholder="كلمة المرور" required>
  <select name="grade" required>
    <option value="">اختر الصف الدراسي</option>
    <!-- نفس خيارات التسجيل -->
  </select>
  <button type="submit">دخول</button>
</form>
```

### 3. معالجة رسائل الخطأ
```javascript
const handleValidationErrors = (errors) => {
  const errorContainer = document.getElementById('errors');
  errorContainer.innerHTML = '';
  
  errors.forEach(error => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = error.msg || error.message;
    errorContainer.appendChild(errorElement);
  });
};

// التحقق من الاسم الرباعي قبل الإرسال
const validateFullName = (name) => {
  const words = name.trim().split(/\s+/);
  
  if (words.length < 4) {
    return 'يجب أن يحتوي الاسم على 4 كلمات على الأقل';
  }
  
  if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
    return 'الاسم يجب أن يحتوي على حروف فقط';
  }
  
  if (name.length < 10 || name.length > 100) {
    return 'الاسم يجب أن يكون بين 10 و 100 حرف';
  }
  
  return null; // صالح
};

// استخدام validation في النموذج
document.getElementById('name').addEventListener('blur', function() {
  const error = validateFullName(this.value);
  const errorElement = document.getElementById('name-error');
  
  if (error) {
    errorElement.textContent = error;
    this.style.borderColor = 'red';
  } else {
    errorElement.textContent = '';
    this.style.borderColor = 'green';
  }
});
```

---

*📅 آخر تحديث: سبتمبر 2025*