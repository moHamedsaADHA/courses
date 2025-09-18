# 🧠 نظام إدارة الكويزات والاختبارات - API Documentation

## 🌟 نظرة عامة

نظام شامل لإدارة الكويزات والاختبارات التفاعلية للمراحل الثانوية. يدعم النظام نوعين من الأسئلة: أسئلة صح وخطأ وأسئلة الاختيار من متعدد، مع نظام تقييم وإحصائيات متقدمة.

## 🎯 المميزات الرئيسية

- ✅ **أنواع الأسئلة المتعددة**: صح وخطأ واختيار من متعدد
- 📊 **نظام النقاط**: تقييم مرن للأسئلة (1-10 نقاط لكل سؤال)
- ⏰ **إدارة الوقت**: تحديد مدة زمنية للكويز (5-180 دقيقة)
- 🎓 **تصنيف حسب الصف**: 5 مستويات دراسية مختلفة
- 📈 **إحصائيات تفصيلية**: تقارير شاملة وتحليلات
- 🔒 **أمان المحتوى**: إخفاء الإجابات الصحيحة عن الطلاب
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
http://localhost:3000/api/quizzes
```

### المصادقة المطلوبة
جميع الطلبات تتطلب تسجيل الدخول:
```bash
Authorization: Bearer <your-jwt-token>
```

---

## 📝 API Endpoints

### 1. إدارة الكويزات العامة

#### إنشاء كويز جديد
**POST** `/api/quizzes`

**الصلاحيات المطلوبة:** `instructor`, `admin`

**Body:**
```json
{
  "title": "كويز الفيزياء - الوحدة الأولى",
  "description": "اختبار شامل للوحدة الأولى في الفيزياء يغطي قوانين نيوتن والحركة",
  "grade": "الصف الثالث الثانوي علمي",
  "subject": "فيزياء",
  "timeLimit": 45,
  "isActive": true,
  "questions": [
    {
      "questionText": "قانون نيوتن الأول ينص على أن الجسم يبقى في حالة السكون أو الحركة المنتظمة ما لم تؤثر عليه قوة خارجية",
      "type": "صح وخطأ",
      "correctAnswer": true,
      "explanation": "هذا صحيح، وهو ما يُعرف بقانون القصور الذاتي",
      "points": 2
    },
    {
      "questionText": "ما هي وحدة قياس القوة في النظام الدولي؟",
      "type": "اختر من متعدد",
      "options": [
        { "text": "نيوتن", "isCorrect": true },
        { "text": "جول", "isCorrect": false },
        { "text": "واط", "isCorrect": false },
        { "text": "كيلوجرام", "isCorrect": false }
      ],
      "explanation": "النيوتن هو وحدة القوة في النظام الدولي",
      "points": 3
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الكويز بنجاح",
  "data": {
    "_id": "65f8a2b3c4d5e6f7g8h9i0j1",
    "title": "كويز الفيزياء - الوحدة الأولى",
    "description": "اختبار شامل للوحدة الأولى...",
    "grade": "الصف الثالث الثانوي علمي",
    "subject": "فيزياء",
    "timeLimit": 45,
    "isActive": true,
    "totalQuestions": 2,
    "totalPoints": 5,
    "questions": [...],
    "createdBy": {
      "_id": "...",
      "name": "أ. محمد أحمد",
      "email": "teacher@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### جلب جميع الكويزات
**GET** `/api/quizzes`

**Query Parameters:**
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد النتائج في الصفحة (افتراضي: 10)
- `grade`: الصف
- `subject`: المادة
- `isActive`: الحالة (`true`, `false`)
- `search`: بحث نصي في العنوان والوصف
- `sortBy`: ترتيب حسب (`createdAt`, `totalQuestions`, `totalPoints`, `title`)
- `sortOrder`: اتجاه الترتيب (`asc`, `desc`)

**مثال:**
```bash
GET /api/quizzes?grade=الصف الثالث الثانوي علمي&isActive=true&sortBy=totalPoints&sortOrder=desc
```

#### جلب كويز واحد
**GET** `/api/quizzes/:id`

**ملاحظة:** الطلاب لن يروا الإجابات الصحيحة، بينما المدرسون والإداريون سيرونها.

**Response:**
```json
{
  "success": true,
  "message": "تم جلب الكويز بنجاح",
  "data": {
    "_id": "...",
    "title": "كويز الفيزياء - الوحدة الأولى",
    "questions": [
      {
        "questionText": "قانون نيوتن الأول...",
        "type": "صح وخطأ",
        "correctAnswer": true,  // مخفي للطلاب
        "explanation": "هذا صحيح...",
        "points": 2
      }
    ],
    "additionalInfo": {
      "canEdit": true,
      "canViewAnswers": true,
      "questionsCount": 2,
      "estimatedTime": 45,
      "difficulty": "متوسط"
    }
  }
}
```

#### تحديث كويز
**PUT** `/api/quizzes/:id`

**الصلاحيات:** منشئ الكويز أو admin

**Body:** (جميع الحقول اختيارية)
```json
{
  "title": "عنوان محدث",
  "timeLimit": 60,
  "isActive": false,
  "questions": [...]
}
```

#### حذف كويز
**DELETE** `/api/quizzes/:id`

**الصلاحيات:** منشئ الكويز أو admin

---

### 2. الكويزات حسب الصف

#### كويزات الصف الأول الثانوي
**GET** `/api/quizzes/grade/first-secondary`

#### كويزات الصف الثاني الثانوي علمي
**GET** `/api/quizzes/grade/second-secondary-science`

#### كويزات الصف الثاني الثانوي أدبي
**GET** `/api/quizzes/grade/second-secondary-literature`

#### كويزات الصف الثالث الثانوي علمي
**GET** `/api/quizzes/grade/third-secondary-science`

#### كويزات الصف الثالث الثانوي أدبي
**GET** `/api/quizzes/grade/third-secondary-literature`

**Query Parameters لجميع endpoints الصفوف:**
- `page`, `limit`: للصفحات
- `subject`: فلترة حسب المادة
- `isActive`: فلترة حسب الحالة
- `search`: البحث النصي
- `sortBy`, `sortOrder`: الترتيب

**مثال Response للصف الثالث علمي:**
```json
{
  "success": true,
  "message": "تم جلب كويزات الصف الثالث الثانوي علمي بنجاح",
  "grade": "الصف الثالث الثانوي علمي",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalQuizzes": 25,
    "hasNext": true,
    "hasPrev": false
  },
  "statistics": {
    "gradeOverview": {
      "totalQuizzes": 25,
      "activeQuizzes": 20,
      "inactiveQuizzes": 5,
      "avgQuestions": 8.5,
      "totalQuestions": 200,
      "avgTimeLimit": 42
    },
    "subjectBreakdown": [
      {
        "_id": "فيزياء",
        "count": 8,
        "activeQuizzes": 7,
        "avgQuestions": 10,
        "totalPoints": 240
      },
      {
        "_id": "كيمياء",
        "count": 7,
        "activeQuizzes": 6,
        "avgQuestions": 8,
        "totalPoints": 180
      }
    ],
    "recentQuizzes": [...],
    "comprehensiveQuizzes": [...]
  }
}
```

---

## 📊 نموذج البيانات

### Quiz Schema
```javascript
{
  title: String,              // عنوان الكويز (مطلوب)
  description: String,        // وصف الكويز (اختياري)
  grade: String,             // الصف (enum - مطلوب)
  subject: String,           // المادة (مطلوب)
  questions: [{}],           // الأسئلة (array)
  totalQuestions: Number,    // العدد الإجمالي للأسئلة (محسوب تلقائياً)
  totalPoints: Number,       // النقاط الإجمالية (محسوبة تلقائياً)
  timeLimit: Number,         // مدة الكويز بالدقائق (افتراضي: 30)
  isActive: Boolean,         // حالة الكويز (افتراضي: true)
  createdBy: ObjectId,       // منشئ الكويز (مطلوب)
  updatedBy: ObjectId,       // آخر محدث
  createdAt: Date,           // تاريخ الإنشاء
  updatedAt: Date            // تاريخ آخر تحديث
}
```

### Question Schema
```javascript
{
  questionText: String,      // نص السؤال (مطلوب)
  type: String,             // نوع السؤال (enum - مطلوب)
  
  // للأسئلة من نوع اختر من متعدد
  options: [{
    text: String,           // نص الخيار
    isCorrect: Boolean      // هل الخيار صحيح
  }],
  
  // للأسئلة من نوع صح وخطأ
  correctAnswer: Boolean,   // الإجابة الصحيحة
  
  explanation: String,      // شرح الإجابة (اختياري)
  points: Number           // نقاط السؤال (1-10، افتراضي: 1)
}
```

### أنواع الأسئلة المدعومة
- **صح وخطأ**: سؤال يتطلب إجابة بصح أو خطأ
- **اختر من متعدد**: سؤال مع خيارات متعددة وإجابة صحيحة واحدة

---

## 🔍 أمثلة الاستخدام

### 1. إنشاء كويز للثانوية العامة
```bash
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title": "كويز الكيمياء النهائي",
    "description": "اختبار شامل لجميع وحدات الكيمياء",
    "grade": "الصف الثالث الثانوي علمي",
    "subject": "كيمياء",
    "timeLimit": 90,
    "questions": [
      {
        "questionText": "الماء مركب كيميائي",
        "type": "صح وخطأ",
        "correctAnswer": true,
        "points": 2
      }
    ]
  }'
```

### 2. البحث عن كويزات الرياضيات
```bash
GET /api/quizzes/grade/second-secondary-science?subject=رياضيات&isActive=true
```

### 3. جلب أحدث الكويزات
```bash
GET /api/quizzes?sortBy=createdAt&sortOrder=desc&limit=5
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
      "message": "عنوان الكويز مطلوب"
    },
    {
      "message": "السؤال 1: يجب تحديد الإجابة الصحيحة"
    }
  ]
}
```

---

## 🚀 نصائح للتحسين

### 1. تصميم الأسئلة الفعالة
```json
{
  "questionText": "أي من القوانين التالية يُعرف بقانون القصور الذاتي؟",
  "type": "اختر من متعدد",
  "options": [
    { "text": "قانون نيوتن الأول", "isCorrect": true },
    { "text": "قانون نيوتن الثاني", "isCorrect": false },
    { "text": "قانون نيوتن الثالث", "isCorrect": false },
    { "text": "قانون الجاذبية العامة", "isCorrect": false }
  ],
  "explanation": "قانون نيوتن الأول يُعرف بقانون القصور الذاتي",
  "points": 3
}
```

### 2. استخدام الفلاتر
```bash
# كويزات نشطة للفيزياء في الثانوية العامة
GET /api/quizzes/grade/third-secondary-science?subject=فيزياء&isActive=true
```

### 3. البحث النصي
```bash
# البحث عن كويزات تحتوي على "نيوتن"
GET /api/quizzes?search=نيوتن
```

---

## 📈 الإحصائيات المتوفرة

### إحصائيات عامة
- إجمالي الكويزات
- الكويزات النشطة/غير النشطة
- متوسط عدد الأسئلة
- متوسط النقاط
- متوسط الوقت المحدد

### إحصائيات حسب المادة
- عدد الكويزات لكل مادة
- الكويزات النشطة لكل مادة
- متوسط الأسئلة والنقاط لكل مادة

### كويزات مميزة
- أحدث الكويزات
- الكويزات الأكثر شمولية (أكثر أسئلة)
- الكويزات عالية النقاط

---

## 🔒 الأمان والصلاحيات

### مستويات الصلاحيات
1. **student**: 
   - عرض الكويزات (بدون الإجابات الصحيحة)
   - حل الكويزات
2. **instructor**: 
   - إنشاء وتعديل وحذف الكويزات المنشأة من قبله
   - عرض جميع تفاصيل الكويزات بما في ذلك الإجابات
3. **admin**: 
   - صلاحيات كاملة على جميع الكويزات

### حماية المحتوى
- إخفاء الإجابات الصحيحة عن الطلاب
- تشفير البيانات الحساسة
- التحقق من صحة الأسئلة قبل الحفظ
- حماية من هجمات الحقن

---

## 🧮 نظام حساب النتائج

### دالة حساب النتيجة
```javascript
// مثال على استخدام دالة حساب النتيجة
const quiz = await Quiz.findById(quizId);
const userAnswers = [true, "option1_id", false]; // إجابات المستخدم

const result = quiz.calculateScore(userAnswers);
console.log(result);
// Output:
// {
//   score: 8,
//   correctAnswers: 2,
//   totalQuestions: 3,
//   totalPoints: 10,
//   percentage: 66.67
// }
```

---

## 📞 الدعم الفني

لأي استفسارات أو مساعدة تقنية:
- 📧 البريد الإلكتروني: support@example.com
- 📱 واتساب: +20123456789
- 🌐 الموقع الإلكتروني: https://example.com

---

**آخر تحديث:** يناير 2024  
**الإصدار:** 1.0.0