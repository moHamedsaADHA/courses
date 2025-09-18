import fetch from 'node-fetch';

async function testLogin() {
  const loginData = {
    email: "teacher@coursesplatform.com",
    password: "Teacher2024@"
  };

  console.log('🔐 اختبار تسجيل الدخول الجديد (بدون grade)');
  console.log('📧 الإيميل:', loginData.email);
  console.log('🔑 كلمة المرور:', loginData.password);
  
  try {
    console.log('\n⏳ إرسال طلب تسجيل الدخول...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ نجح تسجيل الدخول!');
      console.log('👤 اسم المستخدم:', result.user?.name);
      console.log('🏷️  النوع:', result.user?.role);
      console.log('📧 الإيميل:', result.user?.email);
      console.log('✅ مفعل:', result.user?.isVerified ? 'نعم' : 'لا');
      console.log('🎓 الصف:', result.user?.grade);
      console.log('🔑 توكن المصادقة متاح:', result.token ? 'نعم' : 'لا');
      
      if (result.token) {
        console.log('\n🎯 يمكن الآن استخدام التوكن للوصول للـ APIs المحمية');
      }
    } else {
      console.error('\n❌ فشل في تسجيل الدخول:');
      console.error('📝 رسالة الخطأ:', result.message);
      console.error('🔍 تفاصيل الخطأ:', result.error);
      
      if (result.requiresVerification) {
        console.log('⚠️  الحساب يحتاج إلى تفعيل');
      }
    }
    
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال:');
    console.error('📝 رسالة الخطأ:', error.message);
    console.log('\n🔧 تأكد من:');
    console.log('- تشغيل الخادم على المنفذ 3000');
    console.log('- صحة رابط API للدخول');
  }
}

// تشغيل الاختبار
console.log('🚀 بدء اختبار تسجيل الدخول الجديد...');
testLogin();