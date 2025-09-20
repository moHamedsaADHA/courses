// اختبار route مهام الصف الثالث الثانوي أدبي
import fetch from 'node-fetch';

const BASE_URL = 'https://courses-nine-eta.vercel.app';

console.log('🧪 اختبار route مهام الصف الثالث الثانوي أدبي...\n');

async function testTasksRoute() {
  try {
    // أولاً: تسجيل دخول بحساب مُفعّل
    console.log('1️⃣ تسجيل الدخول...');
    
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@courses.com',
        password: 'Admin@123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ فشل تسجيل الدخول:', loginResult.message);
      return;
    }
    
    const token = loginResult.token;
    console.log('✅ تم تسجيل الدخول بنجاح');
    console.log(`👤 المستخدم: ${loginResult.user.name}`);
    console.log(`🎭 الدور: ${loginResult.user.role}`);
    console.log(`📚 الصف: ${loginResult.user.grade || 'غير محدد'}\n`);

    // ثانياً: اختبار route المهام
    console.log('2️⃣ اختبار route المهام...');
    
    const tasksResponse = await fetch(`${BASE_URL}/api/tasks/grade/third-secondary-literature`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`📊 حالة الاستجابة: ${tasksResponse.status} ${tasksResponse.statusText}`);
    
    const tasksResult = await tasksResponse.json();
    
    if (tasksResponse.ok) {
      console.log('✅ تم جلب المهام بنجاح!');
      console.log(`📝 عدد المهام: ${tasksResult.length || 0}`);
      
      if (tasksResult.length > 0) {
        console.log('📋 أول مهمة:');
        console.log(`   العنوان: ${tasksResult[0].title}`);
        console.log(`   المادة: ${tasksResult[0].subject}`);
        console.log(`   الصف: ${tasksResult[0].grade}`);
      }
    } else {
      console.log('❌ فشل جلب المهام:', tasksResult.message);
      
      // تشخيص المشكلة
      if (tasksResponse.status === 401) {
        console.log('\n🔍 تشخيص مشكلة 401:');
        console.log('- تأكد من صحة التوكن');
        console.log('- تأكد من أن المستخدم مُفعّل');
        console.log('- تأكد من أن التوكن لم ينتهِ');
      } else if (tasksResponse.status === 403) {
        console.log('\n🔍 مشكلة صلاحيات:');
        console.log('- المستخدم قد يحتاج تفعيل الحساب');
      }
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

console.log('🎯 اختبار route مهام الصف الثالث الثانوي أدبي');
console.log('=======================================\n');

testTasksRoute();