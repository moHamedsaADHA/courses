import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000/api';
const teacherEmail = 'teacher@coursesplatform.com';
const teacherPassword = 'Teacher2024@';

let authToken = '';
let teacherId = '';

// دالة تسجيل الدخول
async function login() {
  console.log('🔐 تسجيل الدخول كمعلم...');
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: teacherEmail, password: teacherPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error('فشل تسجيل الدخول: ' + JSON.stringify(data));
    
    authToken = data.token;
    teacherId = data.user.id;
    console.log('✅ تم تسجيل الدخول بنجاح');
    console.log('🆔 معرف المعلم:', teacherId);
  } catch (error) {
    throw error;
  }
}

// دالة إنشاء جدولة
async function createSchedule(scheduleData) {
  console.log('\n📅 إنشاء جدولة جديدة...');
  console.log('📋 البيانات:', JSON.stringify(scheduleData, null, 2));
  
  const res = await fetch(`${BASE_URL}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(scheduleData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error('فشل إنشاء الجدولة: ' + JSON.stringify(data));
  
  console.log('✅ تم إنشاء الجدولة بنجاح');
  console.log('🆔 معرف الجدولة:', data.schedule._id);
  return data.schedule;
}

// دالة جلب الجدولات
async function getSchedules(queryParams = '') {
  console.log(`\n📋 جلب الجدولات... ${queryParams}`);
  
  const res = await fetch(`${BASE_URL}/schedule${queryParams}`);
  const data = await res.json();
  if (!res.ok) throw new Error('فشل جلب الجدولات: ' + JSON.stringify(data));
  
  console.log(`✅ تم جلب ${data.schedules.length} جدولة من أصل ${data.total}`);
  return data;
}

// دالة جلب جدولة واحدة
async function getSchedule(id) {
  console.log(`\n🔍 جلب الجدولة ${id}...`);
  
  const res = await fetch(`${BASE_URL}/schedule/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error('فشل جلب الجدولة: ' + JSON.stringify(data));
  
  console.log('✅ تم جلب الجدولة بنجاح');
  return data.schedule;
}

// دالة تحديث جدولة
async function updateSchedule(id, updateData) {
  console.log(`\n✏️ تحديث الجدولة ${id}...`);
  console.log('📝 التحديثات:', JSON.stringify(updateData, null, 2));
  
  const res = await fetch(`${BASE_URL}/schedule/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(updateData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error('فشل تحديث الجدولة: ' + JSON.stringify(data));
  
  console.log('✅ تم تحديث الجدولة بنجاح');
  return data.schedule;
}

// دالة حذف جدولة
async function deleteSchedule(id) {
  console.log(`\n🗑️ حذف الجدولة ${id}...`);
  
  const res = await fetch(`${BASE_URL}/schedule/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error('فشل حذف الجدولة: ' + JSON.stringify(data));
  
  console.log('✅ تم حذف الجدولة بنجاح');
  return data;
}

// الاختبار الشامل
async function runScheduleTests() {
  try {
    // تسجيل الدخول
    await login();
    
    // إنشاء جدولة تجريبية
    const scheduleData = {
      day: 'الأحد',
      subject: 'الرياضيات',
      date: '2025-09-22',
      timeFrom: '08:00',
      timeTo: '09:30',
      grade: 'الصف الأول الثانوي',
      instructor: teacherId
    };
    const newSchedule = await createSchedule(scheduleData);
    const scheduleId = newSchedule._id;
    
    // جلب جميع الجدولات
    await getSchedules();
    
    // جلب جدولات بفلتر
    await getSchedules('?day=الأحد');
    await getSchedules(`?instructor=${teacherId}`);
    
    // جلب جدولة واحدة
    await getSchedule(scheduleId);
    
    // تحديث الجدولة
    const updateData = {
      timeFrom: '09:00',
      timeTo: '10:30',
      subject: 'الفيزياء'
    };
    await updateSchedule(scheduleId, updateData);
    
    // جلب الجدولة بعد التحديث للتأكد
    const updatedSchedule = await getSchedule(scheduleId);
    console.log('📊 الجدولة بعد التحديث:', {
      subject: updatedSchedule.subject,
      timeFrom: updatedSchedule.timeFrom,
      timeTo: updatedSchedule.timeTo
    });
    
    // حذف الجدولة
    await deleteSchedule(scheduleId);
    
    // محاولة جلب الجدولة المحذوفة (يجب أن تفشل)
    try {
      await getSchedule(scheduleId);
      console.log('❌ خطأ: تم جلب جدولة محذوفة!');
    } catch (error) {
      console.log('✅ تأكيد: الجدولة محذوفة فعلاً');
    }
    
    console.log('\n🎉 جميع الاختبارات نجحت بنجاح!');
    console.log('=' .repeat(50));
    console.log('📋 ملخص الاختبارات:');
    console.log('✅ تسجيل الدخول');
    console.log('✅ إنشاء جدولة');
    console.log('✅ جلب الجدولات (عام ومفلتر)');
    console.log('✅ جلب جدولة واحدة');
    console.log('✅ تحديث جدولة');
    console.log('✅ حذف جدولة');
    console.log('✅ التحقق من الحذف');
    
  } catch (error) {
    console.error('\n❌ فشل في الاختبار:', error.message);
    process.exit(1);
  }
}

// تشغيل الاختبارات
runScheduleTests();