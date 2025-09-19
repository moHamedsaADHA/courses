import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// الاتصال بقاعدة البيانات
const DB_URL = 'mongodb+srv://courses_user:HzHJ6BuGfOBMUjPE@cluster0.go5mb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// نموذج المستخدم (مبسط)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// بيانات الحسابات
const accounts = [
  {
    firstName: 'محمد',
    lastName: 'أحمد',
    email: 'admin@courses.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true
  },
  {
    firstName: 'سارة',
    lastName: 'علي',
    email: 'instructor@courses.com',
    password: 'Instructor@123',
    role: 'instructor',
    isVerified: true
  },
  {
    firstName: 'أحمد',
    lastName: 'محمود',
    email: 'student@courses.com',
    password: 'Student@123',
    role: 'student',
    isVerified: true
  }
];

async function createAccounts() {
  try {
    console.log('🔗 اتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بنجاح!');

    console.log('\n📝 إنشاء الحسابات...');
    
    for (const account of accounts) {
      try {
        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(account.password, 12);
        
        // إنشاء المستخدم
        const user = new User({
          ...account,
          password: hashedPassword
        });
        
        await user.save();
        
        console.log(`✅ تم إنشاء حساب ${account.role}:`);
        console.log(`   📧 الإيميل: ${account.email}`);
        console.log(`   🔐 كلمة المرور: ${account.password}`);
        console.log(`   👤 الاسم: ${account.firstName} ${account.lastName}`);
        console.log(`   🎭 الدور: ${account.role}`);
        console.log(`   ✓ مُفعّل: نعم\n`);
        
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  حساب ${account.email} موجود مسبقاً`);
        } else {
          console.error(`❌ خطأ في إنشاء ${account.email}:`, error.message);
        }
      }
    }
    
    console.log('🎉 تم الانتهاء من إنشاء جميع الحسابات!');
    
    // عرض ملخص الحسابات
    console.log('\n📋 ملخص الحسابات المُنشأة:');
    console.log('==================================');
    
    accounts.forEach(account => {
      console.log(`🔹 ${account.role.toUpperCase()}:`);
      console.log(`   الإيميل: ${account.email}`);
      console.log(`   كلمة المرور: ${account.password}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}

createAccounts();