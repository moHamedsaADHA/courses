# 📚 Educational Management Platform | منصة إدارة التعليم

## 🔍 Short Description | وصف مختصر

**English:**
A comprehensive educational management system designed for secondary school students (grades 1-3) with support for science and literature tracks. The platform provides course management, quizzes, assignments, educational materials, and analytics.

**العربية:**
نظام إدارة تعليمية شامل مصمم لطلاب المرحلة الثانوية (الصفوف 1-3) مع دعم المسارين العلمي والأدبي. توفر المنصة إدارة الدورات، الاختبارات، المهام، المواد التعليمية، والتحليلات.

---

## 📖 Full Description | الوصف الكامل

### English

This is a robust backend API system built for educational institutions, specifically targeting secondary school education. The platform enables comprehensive management of courses, lessons, quizzes, assignments (tasks), and educational materials with role-based access control for students, instructors, and administrators.

**Key Capabilities:**
- Complete authentication system with OTP verification via email
- Code-based registration system for controlled user onboarding
- Multi-grade support (First, Second Science/Literature, Third Science/Literature)
- Quiz and task management with automatic grading
- Student progress tracking and analytics dashboard
- Calendar system for scheduling lessons and events
- Educational materials management with grade-specific filtering
- Comprehensive role-based access control (Student, Instructor, Admin)

The system is designed to handle real-world educational workflows, from student registration to performance analytics, with built-in support for email notifications and detailed logging for debugging and monitoring.

### العربية

هذا نظام API خلفي قوي مبني للمؤسسات التعليمية، يستهدف بشكل خاص التعليم الثانوي. توفر المنصة إدارة شاملة للدورات والدروس والاختبارات والمهام والمواد التعليمية مع التحكم في الوصول على أساس الأدوار للطلاب والمعلمين والإداريين.

**الإمكانيات الرئيسية:**
- نظام مصادقة كامل مع التحقق من OTP عبر البريد الإلكتروني
- نظام تسجيل قائم على الأكواد للتحكم في انضمام المستخدمين
- دعم متعدد الصفوف (الأول، الثاني علمي/أدبي، الثالث علمي/أدبي)
- إدارة الاختبارات والمهام مع التصحيح التلقائي
- تتبع تقدم الطلاب ولوحة التحليلات
- نظام تقويم لجدولة الدروس والفعاليات
- إدارة المواد التعليمية مع التصفية حسب الصف
- التحكم الشامل في الوصول على أساس الأدوار (طالب، معلم، مشرف)

النظام مصمم للتعامل مع سير العمل التعليمي الواقعي، من تسجيل الطلاب إلى تحليلات الأداء، مع دعم مدمج لإشعارات البريد الإلكتروني والتسجيل التفصيلي للتصحيح والمراقبة.

---

## 🛠️ Technologies Used | التقنيات المستخدمة

### Backend Stack
- **Node.js** (v18+) - Runtime Environment
- **Express.js** (v5.1.0) - Web Framework
- **MongoDB** (Mongoose v8.17.1) - Database
- **JWT** (jsonwebtoken v9.0.2) - Authentication
- **Bcrypt.js** (v3.0.2) - Password Hashing
- **Nodemailer** (v7.0.6) - Email Service
- **Express Validator** (v7.2.1) - Input Validation
- **Joi** (v18.0.1) - Schema Validation
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing
- **dotenv** (v17.2.1) - Environment Variables

### Development & Deployment
- **Vercel** - Serverless Deployment Platform
- **Nodemon** - Development Auto-Reload



## ✨ Features | المميزات

### 🔐 Authentication & Authorization | المصادقة والترخيص
- ✅ User registration with email OTP verification
- ✅ Code-based registration for controlled access (Student/Instructor/Admin)
- ✅ Login with JWT tokens (Access Token + Refresh Token)
- ✅ Token expiry: 7 days for access tokens
- ✅ Password reset with OTP verification
- ✅ Role-based access control (RBAC)
- ✅ Middleware for authentication and authorization

### 📚 Course Management | إدارة الدورات
- ✅ Create, Read, Update, Delete (CRUD) courses
- ✅ Course categorization
- ✅ Grade-specific course filtering
- ✅ Instructor assignment to courses

### 📖 Lesson Management | إدارة الدروس
- ✅ Complete CRUD for lessons
- ✅ Lessons organized by grades (5 secondary grades)
- ✅ Grade-specific endpoints for easy filtering
- ✅ Lesson scheduling and ordering

### 🧠 Quiz System | نظام الاختبارات
- ✅ Create quizzes with multiple question types (MCQ, True/False)
- ✅ Automatic grading system
- ✅ Quiz submission and result tracking
- ✅ Grade-specific quiz filtering (5 endpoints for each grade)
- ✅ Student quiz results with detailed analytics
- ✅ Quiz start endpoint with question preview
- ✅ Quiz result details with answer review
- ✅ Support for explanations and points per question

### 📝 Task/Assignment System | نظام المهام
- ✅ Create tasks with quiz-like questions (MCQ, True/False)
- ✅ Automatic task grading
- ✅ Task submission and result storage
- ✅ Grade-specific task filtering (5 endpoints)
- ✅ Task results with statistics
- ✅ Allow admin to resubmit tasks multiple times
- ✅ Overall student progress endpoint (combines quiz + task results)

### 📘 Educational Materials | المواد التعليمية
- ✅ Upload and manage educational resources (title, link, grade)
- ✅ Grade-based material filtering
- ✅ Complete CRUD operations
- ✅ Fixed grade enum validation (5 secondary grades)

### 📅 Calendar & Scheduling | التقويم والجدولة
- ✅ Personal calendar for students
- ✅ Schedule lessons and events
- ✅ Calendar accessible to students and admins
- ✅ Event filtering and date-based queries

### 📊 Analytics & Reports | التحليلات والتقارير
- ✅ Dashboard analytics for admins and instructors
- ✅ User statistics (total, by role, verified count)
- ✅ Quiz and task performance metrics
- ✅ Student overall progress (average percentage, pass/fail count)
- ✅ Course and lesson statistics

### 👥 User Management | إدارة المستخدمين
- ✅ User profiles with grade and role information
- ✅ Student code generation and management (1500+ codes)
- ✅ Export student codes to file
- ✅ User verification status tracking

### 📧 Email System | نظام البريد الإلكتروني
- ✅ OTP email for registration verification
- ✅ Password reset emails
- ✅ Email service diagnostics and logging
- ✅ Support for multiple email providers (Nodemailer)

### 🛡️ Security & Validation | الأمن والتحقق
- ✅ Input validation with Express Validator and Joi
- ✅ Password hashing with Bcrypt
- ✅ JWT-based authentication
- ✅ CORS configuration for cross-origin requests
- ✅ Environment variable management with dotenv
- ✅ MongoDB connection timeout handling (30s)

### 🚀 Deployment & DevOps | النشر والعمليات
- ✅ Serverless deployment on Vercel
- ✅ Environment-based configuration
- ✅ Health check endpoints
- ✅ Detailed logging for debugging
- ✅ Error handling middleware

---

## 📂 Project Structure | هيكل المشروع

```
courses-pj/
├── api/                    # Vercel serverless functions
├── src/
│   ├── config/            # Database and server configuration
│   ├── handlers/          # Request handlers (business logic)
│   │   ├── analytics/
│   │   ├── category.handler/
│   │   ├── courses.handler/
│   │   ├── educational-materials/
│   │   ├── lessons/
│   │   ├── quizzes/
│   │   ├── schedule/
│   │   ├── students/
│   │   ├── tasks/
│   │   └── users/
│   ├── middlewares/       # Authentication, authorization, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── services/          # Email, JWT, and other services
│   ├── templates/         # Email templates
│   └── validations/       # Input validation schemas
├── create-student-codes.js  # Script to generate student codes
├── export-student-codes.js  # Script to export codes to file
├── app.js                 # Main application entry point
├── vercel.json            # Vercel deployment configuration
└── package.json           # Dependencies and scripts
```

---

## 🚀 Getting Started | البدء

### Prerequisites | المتطلبات
- Node.js v18 or higher
- MongoDB database
- Email service credentials (for OTP)

### Installation | التثبيت

```bash
# Clone the repository
git clone https://github.com/moHamedsaADHA/courses.git

# Navigate to project directory
cd courses-pj

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Add your environment variables to .env
# DB_URL, JWT_SECRET, EMAIL credentials, etc.

# Run in development mode
npm start

# Run in production mode
npm run start
```

### Generate Student Codes | إنشاء أكواد الطلاب

```bash
# Generate 1500 student codes
node create-student-codes.js

# Export codes to file
node export-student-codes.js
```

---

## 📌 API Endpoints Overview | نظرة عامة على نقاط النهاية

### Authentication | المصادقة
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/verify-otp` - Verify OTP
- `POST /api/users/reset-password` - Reset password

### Courses | الدورات
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Quizzes | الاختبارات
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz (Admin/Instructor)
- `GET /api/quizzes/grade/:grade` - Get quizzes by grade (5 endpoints)
- `POST /api/quizzes/:quizId/submit` - Submit quiz answers
- `GET /api/quizzes/results/my-results` - Get my quiz results

### Tasks | المهام
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Admin/Instructor)
- `GET /api/tasks/grade/:grade` - Get tasks by grade (5 endpoints)
- `POST /api/tasks/:taskId/submit` - Submit task answers
- `GET /api/tasks/results/my-results` - Get my task results

### Educational Materials | المواد التعليمية
- `GET /api/educational-materials` - Get all materials
- `POST /api/educational-materials` - Create material (Admin/Instructor)
- `GET /api/educational-materials/grade/:grade` - Get materials by grade

### Analytics | التحليلات
- `GET /api/analytics/dashboard` - Get dashboard analytics (Admin/Instructor)

### Students | الطلاب
- `GET /api/students/calendar` - Get student calendar
- `GET /api/students/overall-progress` - Get overall student progress

---

## 📄 License | الترخيص

ISC

---

## 👨‍💻 Author | المطور

**moHamedsaADHA**

- GitHub: [@moHamedsaADHA](https://github.com/moHamedsaADHA)

---

## 🤝 Contributing | المساهمة

Contributions, issues, and feature requests are welcome!

---

## ⭐ Show your support | أظهر دعمك

Give a ⭐️ if this project helped you!

---

**Made with ❤️ for Education | صُنع بـ ❤️ من أجل التعليم**
