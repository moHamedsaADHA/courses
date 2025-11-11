import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

/**
 * Middleware للتأكد من الاتصال بقاعدة البيانات قبل معالجة الطلبات
 * مفيد جداً في بيئات serverless مثل Vercel
 */
export const ensureDBConnection = async (req, res, next) => {
  try {
    // التحقق من حالة الاتصال
    const connectionState = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connectionState === 1) {
      // متصل بالفعل
      return next();
    }
    
    if (connectionState === 2) {
      // في حالة الاتصال، انتظر قليلاً
      console.log('[ensureDBConnection] Waiting for DB connection...');
      
      // انتظر حتى 3 ثواني للاتصال
      const maxWait = 3000;
      const startTime = Date.now();
      
      while (mongoose.connection.readyState === 2 && Date.now() - startTime < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (mongoose.connection.readyState === 1) {
        console.log('[ensureDBConnection] DB connected after waiting');
        return next();
      }
    }
    
    // غير متصل، حاول الاتصال
    console.log('[ensureDBConnection] DB not connected, attempting to connect...');
    await connectDB();
    
    // انتظر قليلاً بعد محاولة الاتصال
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // تحقق مرة أخرى
    if (mongoose.connection.readyState === 1) {
      console.log('[ensureDBConnection] DB connected successfully');
      return next();
    }
    
    // فشل الاتصال
    console.error('[ensureDBConnection] Failed to connect to database. Connection state:', mongoose.connection.readyState);
    throw new Error('Failed to connect to database after multiple attempts');
    
  } catch (error) {
    console.error('[ensureDBConnection] Error:', error.message);
    return res.status(503).json({
      success: false,
      message: 'قاعدة البيانات غير متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
