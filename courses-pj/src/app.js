import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { environment } from "./config/server.config.js";

import { coursesRouter } from "./routes/course.js";
import { categoryRouter } from "./routes/category.js";
import { userRouter as usersRouter } from "./routes/auth-routes/user.js";
import { globalErrorHandler } from "./middlewares/globalError.middleware.js";
import { lessonRouter } from './routes/lesson.js';
import { scheduleRouter } from './routes/schedule.js';

import taskRouter from './routes/task.js';
import quizRouter from './routes/quiz.js';
import { analyticsRouter } from './routes/analytics.js';
import { studentRouter } from './routes/student.js';
import educationalMaterialRouter from './routes/educational-material.js';

const app = express();

// إعدادات CORS مفتوحة لجميع المنافذ في التطوير
const corsOptions = {
  origin: true, // السماح لجميع المصادر في التطوير
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // دعم المتصفحات القديمة
};

app.use(cors(corsOptions));
app.use(express.json());

// إضافة headers إضافية لضمان عمل CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // تسجيل الطلبات للتشخيص مع معلومات إضافية
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${origin || 'No Origin'}`);
  if (req.headers.authorization) {
    console.log(`🔑 Auth: ${req.headers.authorization.substring(0, 20)}...`);
  } else {
    console.log(`❌ No Authorization header`);
  }
  
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // cache preflight لمدة يوم
  


  if (req.method === 'OPTIONS') {
    console.log('Preflight request handled');
    return res.sendStatus(200);
  }
  next();
});

// الاتصال بقاعدة البيانات
// في التطوير المحلي: يتصل مباشرة
// في Vercel: يتصل من خلال api/index.js
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  console.log('🔗 Connecting to database (local/development mode)...');
  connectDB();
}

app.use("/api/courses", coursesRouter); 
app.use("/api/categories", categoryRouter); 
app.use("/api/users", usersRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/students', studentRouter);

// Educational Materials
app.use('/api/educational-materials', educationalMaterialRouter);

// Basic root and health endpoints
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Courses API', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use(globalErrorHandler);

export default app;
 
// Express 404 handler (after all routes and error handler registration)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});
