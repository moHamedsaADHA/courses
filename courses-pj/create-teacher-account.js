import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.js';

// تحميل متغيرات البيئة
dotenv.config();

async function createActivatedTeacher() {
  try {
    // الاتصال بقاعدة البيانات
    console.log('🔌 الاتصال بقاعدة البيانات...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // بيانات المعلم
    const teacherData = {
      name: "د. أحمد محمد السيد",
      email: "teacher@coursesplatform.com",
      password: "Teacher2024@",
      role: "instructor",
      phone: "01123456789",
      location: "القاهرة، مصر", 
      grade: "معلم", // إضافة الصف المطلوب
      isVerified: true, // حساب مفعل مباشرة
      otp: null, // لا يحتاج OTP
      otpExpires: null
    };

    // التحقق من وجود الحساب مسبقاً
    const existingUser = await User.findOne({ email: teacherData.email });
    if (existingUser) {
      console.log('⚠️  يوجد حساب بهذا الإيميل مسبقاً');
      console.log('📧 الإيميل:', teacherData.email);
      console.log('🔑 كلمة المرور:', teacherData.password);
      console.log('👤 النوع:', existingUser.role);
      console.log('✅ مفعل:', existingUser.isVerified ? 'نعم' : 'لا');
      
      if (!existingUser.isVerified) {
        console.log('\n🔄 تفعيل الحساب الموجود...');
        existingUser.isVerified = true;
        existingUser.otp = null;
        existingUser.otpExpires = null;
        await existingUser.save();
        console.log('✅ تم تفعيل الحساب بنجاح!');
      }
      
      await mongoose.connection.close();
      return {
        email: existingUser.email,
        password: teacherData.password,
        name: existingUser.name,
        role: existingUser.role
      };
    }

    // إنشاء الحساب (تشفير كلمة المرور سيتم تلقائياً في pre-save hook)
    console.log('👨‍🏫 إنشاء حساب المعلم...');
    const teacher = new User(teacherData);
    await teacher.save();

    console.log('\n🎉 تم إنشاء حساب المعلم بنجاح!');
    console.log('=' .repeat(50));
    console.log('📋 بيانات الدخول:');
    console.log('📧 الإيميل:', 'teacher@coursesplatform.com');
    console.log('🔑 كلمة المرور:', 'Teacher2024@');
    console.log('👤 الاسم:', teacher.name);
    console.log('🏷️  النوع:', teacher.role);
    console.log('✅ الحالة: مفعل ومجهز للاستخدام');
    console.log('🆔 معرف المعلم:', teacher._id);
    console.log('=' .repeat(50));

    // إغلاق الاتصال
    await mongoose.connection.close();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');

    return {
      email: 'teacher@coursesplatform.com',
      password: 'Teacher2024@',
      name: teacher.name,
      role: teacher.role,
      id: teacher._id
    };

  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المعلم:');
    console.error('📝 تفاصيل الخطأ:', error.message);
    console.error('🔍 Stack:', error.stack);
    
    // إغلاق الاتصال في حالة الخطأ
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    
    process.exit(1);
  }
}

// تشغيل الدالة
createActivatedTeacher()
  .then((teacherInfo) => {
    console.log('\n📱 يمكنك الآن استخدام هذه البيانات لتسجيل الدخول:');
    console.log('📧', teacherInfo.email);
    console.log('🔑', teacherInfo.password);
  })
  .catch(console.error);