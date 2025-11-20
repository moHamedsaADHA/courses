import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { environment } from "./config/server.config.js";

const app = express();

// إعدادات CORS البسيطة
// استخدم "origin: true" ليتم عكس Origin الحقيقي في الهيدر
const corsOptions = {
  origin: true, // عكس origin المرسل من المتصفح (يُسمح لجميع المصادر عملياً)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// اتصال بقاعدة البيانات
connectDB();

// Routes بسيطة للاختبار
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});

app.get('/api/courses', (req, res) => {
  res.json([
    { id: 1, title: 'كورس تجريبي', description: 'وصف الكورس' }
  ]);
});

// استيراد routes المستخدمين فقط (المهم لاختبار CORS)
import { userRouter as usersRouter } from "./routes/auth-routes/user.js";
app.use("/api/users", usersRouter);

// معالج الأخطاء العام
import { globalErrorHandler } from "./middlewares/globalError.middleware.js";
app.use(globalErrorHandler);

app.listen(environment.SERVER_PORT, () => {
  console.log(`🚀 Server is running on port ${environment.SERVER_PORT}`);
  console.log(`📡 CORS enabled for all origins`);
  console.log(`🌐 Test URL: http://localhost:${environment.SERVER_PORT}/api/test`);
});