import mongoose from 'mongoose';
import { User } from './src/models/user.js';
import { environment } from './src/config/server.config.js';

const DB_URL = environment.DB_URL || process.env.DB_URL;

async function updateAdminPassword() {
  try {
    console.log('🔗 الاتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    const targetCode = 'SFTUNNNWS';
    const newPassword = 'admin123456'; // كلمة مرور جديدة واضحة

    console.log(`🔍 البحث عن المستخدم صاحب الكود: ${targetCode}`);

    // البحث عن المستخدم وتحديث كلمة المرور
    const user = await User.findOne({ code: targetCode });

    if (!user) {
      console.log('❌ لم يتم العثور على مستخدم بهذا الكود');
      return;
    }

    console.log('✅ تم العثور على المستخدم!');
    console.log(`👤 الاسم: ${user.name}`);
    console.log(`🔐 كلمة المرور الحالية (مشفرة): ${user.password}\n`);

    // تحديث كلمة المرور بدون تشفير
    user.password = newPassword;
    await user.save();

    console.log('🔄 تم تحديث كلمة المرور بنجاح!\n');

    console.log('=' .repeat(50));
    console.log('🔐 بيانات تسجيل الدخول الجديدة:');
    console.log('=' .repeat(50));
    console.log(`الكود: ${user.code}`);
    console.log(`كلمة المرور: ${newPassword}`);
    console.log('=' .repeat(50));

    console.log('\n📋 بيانات المستخدم الكاملة:');
    console.log(`👤 الاسم: ${user.name}`);
    console.log(`📧 البريد الإلكتروني: ${user.email}`);
    console.log(`👨‍💼 الدور: ${user.role}`);
    console.log(`📚 الصف: ${user.grade}`);
    console.log(`📍 الموقع: ${user.location}`);
    console.log(`📱 الهاتف: ${user.phone}`);
    console.log(`✅ مفعل: ${user.isVerified ? 'نعم' : 'لا'}`);

    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');

  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

updateAdminPassword();