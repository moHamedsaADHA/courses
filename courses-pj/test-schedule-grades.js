import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
const testUser = {
  email: 'teacher@coursesplatform.com',
  password: 'Teacher2024@'
};

async function testGradeSpecificScheduleEndpoints() {
  try {
    console.log('🚀 اختبار مسارات الجدولة حسب الصف...\n');

    // تسجيل الدخول
    console.log('1) تسجيل الدخول كمعلم...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;
    console.log(`✅ نجح تسجيل الدخول: ${token.substring(0, 20)}...`);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // إنشاء جدولات تجريبية
    console.log('\n2) إنشاء جدولات تجريبية للاختبار...');
    const schedules = [
      {
        day: 'الأحد',
        subject: 'الرياضيات',
        date: '2025-01-15',
        timeFrom: '08:00',
        timeTo: '09:30',
        grade: 'الصف الأول الثانوي',
        instructor: '68cb5ca962cc12d125e33cba'
      },
      {
        day: 'الاثنين',
        subject: 'الفيزياء',
        date: '2025-01-16',
        timeFrom: '10:00',
        timeTo: '11:30',
        grade: 'الصف الثاني الثانوي علمي',
        instructor: '68cb5ca962cc12d125e33cba'
      },
      {
        day: 'الثلاثاء',
        subject: 'الأدب',
        date: '2025-01-17',
        timeFrom: '12:00',
        timeTo: '13:30',
        grade: 'الصف الثاني الثانوي ادبي',
        instructor: '68cb5ca962cc12d125e33cba'
      }
    ];

    for (const schedule of schedules) {
      try {
        const response = await axios.post(`${BASE_URL}/schedule`, schedule, config);
        console.log(`✅ تم إنشاء جدولة ${schedule.grade}: ${response.data.schedule._id}`);
      } catch (error) {
        console.log(`⚠️ جدولة ${schedule.grade} موجودة مسبقاً أو خطأ: ${error.response?.data?.message || error.message}`);
      }
    }

    // اختبار مسارات الصفوف
    console.log('\n3) اختبار مسارات الجدولة حسب الصف...');
    
    const gradeEndpoints = [
      { path: '1st-secondary', name: 'الصف الأول الثانوي' },
      { path: '2nd-secondary-science', name: 'الصف الثاني الثانوي علمي' },
      { path: '2nd-secondary-arts', name: 'الصف الثاني الثانوي ادبي' },
      { path: '3rd-secondary-science', name: 'الصف الثالث الثانوي علمي' },
      { path: '3rd-secondary-arts', name: 'الصف الثالث الثانوي ادبي' }
    ];

    for (const endpoint of gradeEndpoints) {
      try {
        const response = await axios.get(`${BASE_URL}/schedule/grade/${endpoint.path}`);
        console.log(`✅ ${endpoint.name}:`);
        console.log(`   - عدد الجدولات: ${response.data.total}`);
        console.log(`   - الصف: ${response.data.grade}`);
        console.log(`   - الصفحات: ${response.data.pages}`);
        
        if (response.data.schedules.length > 0) {
          const schedule = response.data.schedules[0];
          console.log(`   - مثال: ${schedule.subject} - ${schedule.day} (${schedule.timeFrom}-${schedule.timeTo})`);
        }
      } catch (error) {
        console.log(`❌ خطأ في ${endpoint.name}: ${error.response?.data?.message || error.message}`);
      }
    }

    // اختبار الفلترة بالبارامترات
    console.log('\n4) اختبار الفلترة بالبارامترات...');
    try {
      const response = await axios.get(`${BASE_URL}/schedule/grade/1st-secondary?day=الأحد&limit=5`);
      console.log(`✅ فلترة الصف الأول - الأحد: ${response.data.schedules.length} جدولة`);
    } catch (error) {
      console.log(`❌ خطأ في الفلترة: ${error.response?.data?.message || error.message}`);
    }

    // اختبار pagination
    console.log('\n5) اختبار Pagination...');
    try {
      const response = await axios.get(`${BASE_URL}/schedule/grade/1st-secondary?page=1&limit=2`);
      console.log(`✅ Pagination: صفحة ${response.data.page} من ${response.data.pages}`);
      console.log(`   - المجموع: ${response.data.total} جدولة`);
      console.log(`   - في هذه الصفحة: ${response.data.schedules.length} جدولة`);
    } catch (error) {
      console.log(`❌ خطأ في Pagination: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎉 اكتمل اختبار مسارات الجدولة حسب الصف بنجاح!');

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.response?.data || error.message);
  }
}

// تشغيل الاختبار
testGradeSpecificScheduleEndpoints();