// اختبار اتصال MongoDB مباشرة
import mongoose from 'mongoose';

const DB_URL = 'mongodb+srv://courses_user:HzHJ6BuGfOBMUjPE@cluster0.go5mb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 اختبار اتصال MongoDB...');

async function testMongoDB() {
  try {
    console.log('📡 محاولة الاتصال...');
    
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('✅ تم الاتصال بنجاح!');
    
    // اختبار بسيط
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:', collections.map(c => c.name));
    
    mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال');
    
  } catch (error) {
    console.error('❌ فشل الاتصال:', error.message);
  }
}

testMongoDB();