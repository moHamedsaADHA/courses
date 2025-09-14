import express from "express";
import cors from "cors";

const app = express();

// إعدادات CORS البسيطة
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// معالجة OPTIONS - باستخدام middleware بدلاً من options route
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.sendStatus(200);
  }
  next();
});

// Routes بسيطة للاختبار
app.get('/api/test', (req, res) => {
  console.log('GET /api/test - CORS working!');
  res.json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString() 
  });
});

app.post('/api/test', (req, res) => {
  console.log('POST /api/test - Data received:', req.body);
  res.json({ 
    message: 'POST request successful!', 
    data: req.body,
    origin: req.headers.origin
  });
});

// Route تسجيل بسيط
app.post('/api/users/register', (req, res) => {
  console.log('POST /api/users/register - Data:', req.body);
  res.json({
    message: 'Registration endpoint working!',
    received: req.body,
    cors: 'enabled'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 CORS Test Server running on port ${PORT}`);
  console.log(`🌐 Test in browser: http://localhost:${PORT}/api/test`);
  console.log('📡 CORS enabled for all origins');
});