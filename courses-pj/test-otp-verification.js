import fetch from 'node-fetch';

const BASE_URL = 'https://courses-nine-eta.vercel.app';

console.log('🧪 اختبار تفعيل OTP...\n');

async function testOTPVerification() {
  try {
    // البيانات المطلوبة للتفعيل
    const verificationData = {
      email: 'test-otp-mock@example.com',
      otp: '584358'  // OTP من الاختبار السابق
    };

    console.log('📝 بيانات التفعيل:');
    console.log(JSON.stringify(verificationData, null, 2));
    
    console.log('\n📡 إرسال طلب التفعيل...');
    
    const response = await fetch(`${BASE_URL}/api/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData)
    });

    console.log(`\n📊 حالة الاستجابة: ${response.status} ${response.statusText}`);

    const result = await response.json();
    
    console.log('📋 نتيجة التفعيل:');
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ تم تفعيل الحساب بنجاح!');
      
      if (result.token) {
        console.log('🔑 تم الحصول على Token للدخول');
      }
      
    } else {
      console.log('\n❌ فشل التفعيل:');
      console.log(`خطأ: ${result.message || result.error || 'غير معروف'}`);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

console.log('🎯 اختبار تفعيل OTP');
console.log('==================\n');

testOTPVerification();