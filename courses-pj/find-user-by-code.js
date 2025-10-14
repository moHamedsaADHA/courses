import mongoose from 'mongoose';
import { User } from './src/models/user.js';
import { environment } from './src/config/server.config.js';

const DB_URL = environment.DB_URL || process.env.DB_URL;

async function findUserByCode() {
  try {
    console.log('🔗 الاتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    const targetCode = 'SFTUNNNWS';
    console.log(`🔍 البحث عن المستخدم صاحب الكود: ${targetCode}\n`);

    // البحث عن المستخدم
    const user = await User.findOne({ code: targetCode });

    if (!user) {
      console.log('❌ لم يتم العثور على مستخدم بهذا الكود');
      return;
    }

    console.log('✅ تم العثور على المستخدم!\n');
    console.log('=' .repeat(50));
    console.log('📋 بيانات المستخدم:');
    console.log('=' .repeat(50));
    console.log(`👤 الاسم: ${user.name}`);
    console.log(`📧 البريد الإلكتروني: ${user.email || 'غير متوفر'}`);
    console.log(`🔑 الكود: ${user.code}`);
    console.log(`🔐 كلمة المرور: ${user.password}`);
    console.log(`👨‍💼 الدور: ${user.role}`);
    console.log(`📚 الصف: ${user.grade}`);
    console.log(`📍 الموقع: ${user.location}`);
    console.log(`📱 الهاتف: ${user.phone || 'غير متوفر'}`);
    console.log(`✅ مفعل: ${user.isVerified ? 'نعم' : 'لا'}`);
    console.log(`📅 تاريخ الإنشاء: ${user.createdAt}`);
    console.log('=' .repeat(50));

    console.log('\n🔐 بيانات تسجيل الدخول:');
    console.log('=' .repeat(30));
    console.log(`الكود: ${user.code}`);
    console.log(`كلمة المرور: ${user.password}`);
    console.log('=' .repeat(30));

    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');

  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

findUserByCode();