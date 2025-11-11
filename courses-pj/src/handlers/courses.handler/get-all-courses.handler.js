import { Course } from "../../models/course.js";
import mongoose from "mongoose";

export const getAllCourses = async (req, res) => {
  try {
    // التحقق من الاتصال بقاعدة البيانات
    if (mongoose.connection.readyState !== 1) {
      console.error('[getAllCourses] Database not connected');
      return res.status(503).json({ 
        success: false,
        message: "قاعدة البيانات غير متصلة حالياً" 
      });
    }

    console.log('[getAllCourses] Fetching courses...');
    
    // جلب الدورات مع timeout
    const courses = await Course.find()
      .maxTimeMS(5000) // حد أقصى 5 ثواني
      .lean() // تحسين الأداء
      .exec();
    
    console.log(`[getAllCourses] Found ${courses.length} courses`);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {
    console.error('[getAllCourses] Error:', error);
    
    // معالجة أخطاء محددة
    if (error.name === 'MongooseError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        success: false,
        message: "خطأ في الاتصال بقاعدة البيانات",
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "حدث خطأ أثناء جلب الدورات",
      error: error.message 
    });
  }
};
