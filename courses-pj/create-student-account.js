import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.js';

dotenv.config();

async function createActivatedStudent() {
  try {
    console.log('🔌 الاتصال بقاعدة البيانات...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات');

    const studentData = {
      name: 'محمد علي',
      email: 'student@coursesplatform.com',
      password: 'Student2024@',
      role: 'student',
      location: 'الإسكندرية، مصر',
      grade: 'الصف الأول الثانوي',
      phone: '01012345678',
      isVerified: true,
      otp: null,
      otpExpires: null
    };

    let student = await User.findOne({ email: studentData.email });
    if (student) {
      console.log('⚠️  يوجد مستخدم بنفس الإيميل، سيتم تحديث تفعيله');
      student.isVerified = true;
      student.otp = null;
      student.otpExpires = null;
      if (student.password.startsWith('$2')) {
        console.log('🔐 كلمة المرور مشفرة مسبقاً');
      } else {
        console.log('🔁 سيتم إعادة حفظ كلمة المرور (hook سيشفر)');
        student.password = studentData.password;
      }
      await student.save();
    } else {
      console.log('🆕 إنشاء حساب طالب جديد...');
      student = new User(studentData);
      await student.save();
    }

    console.log('\n🎉 تم تجهيز حساب الطالب!');
    console.log('==============================');
    console.log('📧 الإيميل: student@coursesplatform.com');
    console.log('🔑 كلمة المرور: Student2024@');
    console.log('🎓 الصف:', student.grade);
    console.log('👤 الدور:', student.role);
    console.log('✅ مفعل: نعم');
    console.log('🆔 ID:', student._id.toString());
    console.log('==============================');

    await mongoose.connection.close();
    console.log('🔌 تم قطع الاتصال');
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    if (mongoose.connection.readyState === 1) await mongoose.connection.close();
    process.exit(1);
  }
}

createActivatedStudent();
