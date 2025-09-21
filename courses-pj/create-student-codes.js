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
  const codes = [];
  for (let i = 0; i < 200; i++) {
    codes.push({ code: generateCode(), role: 'student' });
  }
  await Code.insertMany(codes);
  console.log('✅ تم إنشاء 200 كود طالب بنجاح!');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ خطأ أثناء إنشاء الأكواد:', err);
  process.exit(1);
});
