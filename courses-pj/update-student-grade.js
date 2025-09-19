import mongoose from 'mongoose';

// الاتصال بقاعدة البيانات
const DB_URL = 'mongodb+srv://courses_user:HzHJ6BuGfOBMUjPE@cluster0.go5mb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// نموذج المستخدم
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  grade: { type: String }, // إضافة حقل الصف الدراسي
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateStudentGrade() {
  try {
    console.log('🔗 اتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بنجاح!');

    console.log('\n🔍 البحث عن الطالب...');
    
    // البحث عن الطالب
    const student = await User.findOne({ email: 'student@courses.com' });
    
    if (!student) {
      console.log('❌ لم يتم العثور على الطالب!');
      return;
    }
    
    console.log('✅ تم العثور على الطالب:');
    console.log(`   👤 الاسم: ${student.firstName} ${student.lastName}`);
    console.log(`   📧 الإيميل: ${student.email}`);
    console.log(`   🎭 الدور: ${student.role}`);
    console.log(`   📚 الصف الحالي: ${student.grade || 'غير محدد'}`);
    
    // تحديث الصف الدراسي
    console.log('\n📝 تحديث الصف الدراسي...');
    
    const updatedStudent = await User.findByIdAndUpdate(
      student._id,
      { 
        grade: 'الصف الأول الثانوي',
        updatedAt: new Date()
      },
      { new: true } // إرجاع البيانات المحدثة
    );
    
    console.log('✅ تم تحديث الطالب بنجاح!');
    console.log('==========================');
    console.log(`   👤 الاسم: ${updatedStudent.firstName} ${updatedStudent.lastName}`);
    console.log(`   📧 الإيميل: ${updatedStudent.email}`);
    console.log(`   🎭 الدور: ${updatedStudent.role}`);
    console.log(`   📚 الصف الجديد: ${updatedStudent.grade}`);
    console.log(`   📅 تاريخ التحديث: ${updatedStudent.updatedAt.toLocaleString('ar-EG')}`);
    
    console.log('\n🎉 تم التحديث بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}

updateStudentGrade();