// اختبار أن أي instructor يقدر يضيف ويعدل ويحذف أي كورس
const BASE_URL = 'https://courses-nine-eta.vercel.app';

// بيانات تسجيل دخول instructor
const loginData = {
  email: 'instructor@courses.com',
  password: 'Instructor@123'
};

// بيانات كورس جديد للاختبار
const newCourse = {
  title: 'كورس تجريبي من أي instructor',
  description: 'اختبار أن أي instructor يقدر ينشئ كورس',
  categoryId: '507f1f77bcf86cd799439011', // مؤقت
  price: 99.99,
  duration: '4 أسابيع'
};

async function testInstructorPermissions() {
  console.log('🧪 اختبار صلاحيات الـ Instructors...\n');

  try {
    // 1. تسجيل دخول instructor
    console.log('🔐 تسجيل دخول instructor...');
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('📊 Response Status:', loginResponse.status);
    console.log('📋 Login Response:', JSON.stringify(loginResult, null, 2));
    
    if (!loginResponse.ok) {
      console.error('❌ فشل تسجيل الدخول:', loginResult.message || loginResult.error || 'خطأ غير معروف');
      return;
    }

    const token = loginResult.token;
    console.log('✅ تم تسجيل الدخول بنجاح!');
    console.log(`👤 اسم المستخدم: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
    console.log(`🎭 الدور: ${loginResult.user.role}\n`);

    // 2. اختبار إنشاء كورس
    console.log('📝 اختبار إنشاء كورس جديد...');
    const createResponse = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newCourse)
    });

    const createResult = await createResponse.json();
    
    if (!createResponse.ok) {
      console.error('❌ فشل إنشاء الكورس:', createResult.message);
      return;
    }

    const courseId = createResult._id;
    console.log('✅ تم إنشاء الكورس بنجاح!');
    console.log(`📚 اسم الكورس: ${createResult.title}`);
    console.log(`🆔 معرف الكورس: ${courseId}\n`);

    // 3. اختبار تحديث الكورس
    console.log('✏️ اختبار تحديث الكورس...');
    const updateData = {
      title: 'كورس محدّث من أي instructor',
      description: 'تم تحديثه بواسطة أي instructor',
      price: 149.99
    };

    const updateResponse = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    
    if (!updateResponse.ok) {
      console.error('❌ فشل تحديث الكورس:', updateResult.message);
    } else {
      console.log('✅ تم تحديث الكورس بنجاح!');
      console.log(`📚 العنوان الجديد: ${updateResult.title}`);
      console.log(`💰 السعر الجديد: ${updateResult.price}\n`);
    }

    // 4. اختبار عرض جميع الكورسات
    console.log('📋 اختبار عرض جميع الكورسات...');
    const getAllResponse = await fetch(`${BASE_URL}/api/courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const getAllResult = await getAllResponse.json();
    
    if (!getAllResponse.ok) {
      console.error('❌ فشل جلب الكورسات:', getAllResult.message);
    } else {
      console.log(`✅ تم جلب ${getAllResult.length} كورس بنجاح!`);
      console.log('📚 أسماء الكورسات:');
      getAllResult.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title}`);
      });
    }

    // 5. اختبار حذف الكورس (أخيراً)
    console.log('\n🗑️ اختبار حذف الكورس...');
    const deleteResponse = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const deleteResult = await deleteResponse.json();
    
    if (!deleteResponse.ok) {
      console.error('❌ فشل حذف الكورس:', deleteResult.message);
    } else {
      console.log('✅ تم حذف الكورس بنجاح!');
      console.log(`🗑️ الكورس المحذوف: ${deleteResult.deletedCourse?.title}`);
    }

    console.log('\n🎉 اكتمل اختبار صلاحيات الـ Instructors!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testInstructorPermissions();