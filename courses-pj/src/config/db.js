import mongoose from "mongoose";
import { environment } from "./server.config.js";

const DB_CONNECTION = environment.DB_URL;

// تتبع حالة الاتصال لتجنب إعادة الاتصال المتكررة في serverless
let isConnected = false;

export const connectDB = async () => {
  // إذا كان متصل بالفعل، لا نحتاج لإعادة الاتصال
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    // إعدادات الاتصال المُحسّنة لـ Vercel
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 ثواني للاتصال الأولي
      socketTimeoutMS: 45000, // 45 ثانية للعمليات
      maxPoolSize: 10, // عدد الاتصالات المتزامنة
      minPoolSize: 2,
      maxIdleTimeMS: 30000, // إغلاق الاتصالات الخاملة بعد 30 ثانية
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      connectTimeoutMS: 10000,
      family: 4 // استخدام IPv4
    };

    await mongoose.connect(DB_CONNECTION, options);
    
    isConnected = true;
    console.log("MongoDB connected successfully");

  } catch (err) {
    isConnected = false;
    console.error("MongoDB connection error:", err?.message || err);
    // في serverless، لا نوقف التطبيق، نستمر ونترك المسارات تتعامل مع غياب قاعدة البيانات
  }

  // مراقبة حالة الاتصال
  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("MongoDB connected event");
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    isConnected = false;
    console.error("MongoDB connection error:", err?.message || err);
  });

  // في serverless، نتعامل مع إيقاف التشغيل بشكل صحيح
  if (typeof process !== 'undefined' && process.on) {
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('MongoDB connection closed through app termination');
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
      }
    });
  }
};

