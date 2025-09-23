import mongoose from 'mongoose';
import { Code } from './src/models/code.js';
import { environment } from './src/config/server.config.js';

const DB_URL = environment.DB_URL || process.env.DB_URL;

function generateCode() {
  // كود عشوائي من 8 أحرف وأرقام
  return 'S' + Math.random().toString(36).substring(2, 10).toUpperCase();
}


async function main() {
  await mongoose.connect(DB_URL);
  // حذف جميع الأكواد القديمة
  await Code.deleteMany({});
  console.log('🗑️ تم حذف جميع الأكواد القديمة.');

  // إنشاء 1500 كود جديد
  const codes = new Set();
  while (codes.size < 1500) {
    codes.add(generateCode());
  }
  const codeDocs = Array.from(codes).map(code => ({ code, role: 'student' }));
  await Code.insertMany(codeDocs);
  console.log('✅ تم إنشاء 1500 كود طالب بنجاح!');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ خطأ أثناء إنشاء الأكواد:', err);
  process.exit(1);
});
