import mongoose from 'mongoose';
import { User } from './src/models/user.js';
import { Code } from './src/models/code.js';
import { environment } from './src/config/server.config.js';

const DB_URL = environment.DB_URL || process.env.DB_URL;

async function createAdminAccount() {
  try {
    console.log('🔗 الاتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // التحقق من وجود أدمن مسبق
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ يوجد حساب أدمن مسبق:');
      console.log('🔑 الكود:', existingAdmin.code);
      console.log('👤 الاسم:', existingAdmin.name);
      await mongoose.disconnect();
      return;
    }

    // إنشاء كود أدمن
    console.log('📝 إنشاء كود أدمن...');
    const adminCode = await Code.create({
      code: 'ADMIN001',
      role: 'admin',
      used: false
    });
    console.log('✅ تم إنشاء كود الأدمن:', adminCode.code);

    // إنشاء حساب الأدمن
    console.log('👤 إنشاء حساب الأدمن...');
    const admin = await User.create({
      name: 'محمد سعد الأدمن',
      password: 'admin123456',
      email: 'admin@courses.com',
      location: 'القاهرة',
      grade: 'الصف الثالث الثانوي علمي',
      role: 'admin',
      phone: '01000000001',
      code: 'ADMIN001',
      isVerified: true
    });

    // تحديث الكود ليصبح مستخدم
    adminCode.used = true;
    adminCode.usedBy = admin._id;
    await adminCode.save();

    console.log('\n🎉 تم إنشاء حساب الأدمن بنجاح!');
    console.log('═'.repeat(50));
    console.log('📊 بيانات تسجيل الدخول:');
    console.log('═'.repeat(50));
    console.log('🔑 الكود (Code):', admin.code);
    console.log('🔒 كلمة المرور (Password):', 'admin123456');
    console.log('👤 الاسم:', admin.name);
    console.log('📧 البريد الإلكتروني:', admin.email);
    console.log('📱 رقم الهاتف:', admin.phone);
    console.log('🏠 الموقع:', admin.location);
    console.log('📚 الصف:', admin.grade);
    console.log('✅ حالة التفعيل: مفعل');
    console.log('═'.repeat(50));
    
    console.log('\n🔐 لتسجيل الدخول استخدم:');
    console.log('POST /api/users/login');
    console.log('Body: {');
    console.log('  "code": "ADMIN001",');
    console.log('  "password": "admin123456"');
    console.log('}');

    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');

  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب الأدمن:', error.message);
    if (error.code === 11000) {
      console.log('⚠️ الكود موجود مسبقاً، جرب كود آخر');
    }
    process.exit(1);
  }
}

createAdminAccount();