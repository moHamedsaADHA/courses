import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000/api';
const instructorEmail = 'teacher@coursesplatform.com';
const instructorPassword = 'Teacher2024@';

async function login() {
  console.log('🔐 تسجيل الدخول...');
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: instructorEmail, password: instructorPassword, grade: 'معلم' })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('فشل تسجيل الدخول: ' + JSON.stringify(data));
  }
  console.log('✅ تم تسجيل الدخول');
  return data.token || data.accessToken || data.jwt || data.tempToken; // حسب ما يوفره السيرفر
}

async function createLesson(token) {
  console.log('\n📘 إنشاء حصة جديدة...');
  const lessonPayload = {
    grade: 'الصف الأول الثانوي',
    unitTitle: 'الوحدة الأولى: أساسيات البرمجة',
    lessonTitle: 'الدرس 1: مقدمة في JavaScript',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  };

  const res = await fetch(`${BASE_URL}/instructor/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(lessonPayload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('فشل إنشاء الحصة: ' + JSON.stringify(data));
  }
  console.log('✅ تم إنشاء الحصة بنجاح');
  console.log('🆔 معرف الحصة:', data.lesson._id);
  console.log('📌 عنوان الدرس:', data.lesson.lessonTitle);
  return data.lesson;
}

(async () => {
  try {
    const token = await login();
    await createLesson(token);
    console.log('\n🎉 اختبار إنشاء الحصة اكتمل بنجاح');
  } catch (err) {
    console.error('\n❌ فشل الاختبار:', err.message);
  }
})();
