import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// الاتصال بقاعدة البيانات عند بدء serverless function
let dbConnected = false;

export default async function handler(req, res) {
  try {
    console.log(`[Vercel] Handler invoked: ${req.method} ${req.url}`);
    
    // التأكد من الاتصال بقاعدة البيانات
    if (!dbConnected) {
      console.log('[Vercel] Connecting to database...');
      await connectDB();
      dbConnected = true;
      console.log('[Vercel] Database connected');
    }
    
  } catch (error) {
    console.error('[Vercel] Database connection error:', error);
    // نستمر في معالجة الطلب حتى لو فشل الاتصال
  }

  // تمرير الطلب إلى Express app
  return app(req, res);
}
