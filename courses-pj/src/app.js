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

const app = express();

// إعدادات CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:8080',
    'http://localhost:8000',
    'https://mohamedsaadha.github.io/courses_f',
    'https://mohamedsaadha.github.io',
    'https://courses-delta-fawn.vercel.app',
    environment.CORS_ORIGIN
  ].filter(Boolean), // إزالة القيم الفارغة
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
  
  // تسجيل الطلبات للتشخيص (يمكن إزالته في الإنتاج)
  console.log(`${req.method} ${req.path} - Origin: ${origin}`);
  
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

// Connect to DB on cold start (serverless-safe)
connectDB();

app.use("/api/courses", coursesRouter); 
app.use("/api/categories", categoryRouter); 
app.use("/api/users", usersRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/quizzes', quizRouter);

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
