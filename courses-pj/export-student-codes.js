import mongoose from 'mongoose';
import { Code } from './src/models/code.js';
import { environment } from './src/config/server.config.js';
import fs from 'fs';

const DB_URL = environment.DB_URL || process.env.DB_URL;

async function main() {
  await mongoose.connect(DB_URL);
  const codes = await Code.find({ role: 'student' }, { code: 1, used: 1, _id: 0 });
  const lines = codes.map(c => `${c.code}${c.used ? ' (مستخدم)' : ''}`);
  fs.writeFileSync('student-codes.txt', lines.join('\n'), 'utf8');
  console.log('✅ تم تصدير الأكواد إلى student-codes.txt');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ خطأ أثناء تصدير الأكواد:', err);
  process.exit(1);
});
