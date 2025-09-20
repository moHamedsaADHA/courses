import fetch from 'node-fetch';

const BASE_URL = 'https://courses-nine-eta.vercel.app';

console.log('🧪 اختبار تسجيل حساب جديد مع Mock OTP...\n');

async function testRegistrationWithOTP() {
  try {
    // بيانات مستخدم جديد
    const registrationData = {
      name: 'أحمد محمد تست المستخدم',
      email: 'test-real-email-2024@example.com',
      password: 'TestOTP@123456',
      location: 'القاهرة',
      grade: 'الصف الأول الثانوي',
      role: 'student'
    };

    console.log('📝 بيانات التسجيل:');
    console.log(JSON.stringify(registrationData, null, 2));
    
    console.log('\n📡 إرسال طلب التسجيل...');
    
    const response = await fetch(`${BASE_URL}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    console.log(`\n📊 حالة الاستجابة: ${response.status} ${response.statusText}`);

    const result = await response.json();
    
    console.log('📋 نتيجة التسجيل:');
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ نجح التسجيل!');
      
      if (result.message) {
        console.log(`📧 الرسالة: ${result.message}`);
      }
      
      console.log('\n💡 تحقق من logs Vercel لرؤية Mock OTP في console');
      console.log('🔗 اذهب إلى: https://vercel.com/dashboard → Functions → View Function Logs');
      
    } else {
      console.log('\n❌ فشل التسجيل:');
      console.log(`خطأ: ${result.message || result.error || 'غير معروف'}`);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.log('🔧 تحقق من أن الباك إند يعمل على Vercel');
  }
}

console.log('🎯 اختبار Mock OTP Service');
console.log('============================\n');

testRegistrationWithOTP();