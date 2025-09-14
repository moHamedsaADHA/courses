import http from 'http';

/**
 * تحسين اختبار التسجيل وإرسال OTP بالبريد الإلكتروني
 * مع تحسينات لعرض رسائل الخطأ وتتبع العمليات
 */

// بيانات المستخدم للتسجيل - قم بتغيير البريد الإلكتروني إلى بريدك الحقيقي
const postData = JSON.stringify({
  name: 'أحمد محمد علي حسن',
  email: 'YOUR_REAL_EMAIL@example.com', // قم بتغييره إلى بريدك الإلكتروني الحقيقي
  password: 'Password123',
  location: 'بغداد',
  grade: 'الصف الأول الإعدادي'
});

// إعداد طلب HTTP
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('=== اختبار تسجيل المستخدم وإرسال بريد OTP ===');
console.log('\nإرسال طلب التسجيل...');
console.log('البيانات:', JSON.parse(postData));

// تنفيذ الطلب
const req = http.request(options, (res) => {
  console.log(`\nاستجابة الخادم - رمز الحالة: ${res.statusCode}`);
  console.log('عناوين الاستجابة:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      
      console.log('\n=== نتيجة الاختبار ===');
      if (parsed.success || res.statusCode === 201) {
        console.log('✅ تم التسجيل بنجاح!');
        
        // التحقق من حالة إرسال البريد الإلكتروني
        if (parsed.emailSent) {
          console.log('📧 تم إرسال البريد الإلكتروني بنجاح.');
          console.log('🔍 تحقق من صندوق البريد الوارد الخاص بك (وأيضًا مجلد الرسائل غير المرغوب فيها).');
          console.log('⏱️ قد يستغرق وصول البريد الإلكتروني بضع دقائق.');
        } else {
          console.log('❌ فشل إرسال البريد الإلكتروني.');
          console.log('🔍 التحقق من ملفات السجل في الخادم للحصول على مزيد من التفاصيل.');
          
          if (parsed.otpForTesting) {
            console.log('🔢 رمز OTP للاختبار (متاح فقط بسبب فشل إرسال البريد):', parsed.otpForTesting);
          }
        }
        
        // عرض الرمز المؤقت إذا كان متاحًا
        if (parsed.tempToken) {
          console.log('\n🔑 الرمز المؤقت متاح للتفعيل (صالح لمدة ساعة واحدة)');
        }
      } else {
        console.log('❌ فشل التسجيل!');
        console.log('رسالة الخطأ:', parsed.message || 'لا توجد رسالة خطأ');
        if (parsed.error) {
          console.log('تفاصيل الخطأ:', parsed.error);
        }
      }
      
      // عرض الاستجابة الكاملة للتحليل
      console.log('\n=== الاستجابة الكاملة ===');
      console.log(JSON.stringify(parsed, null, 2));
      
    } catch (e) {
      console.log('\n❌ خطأ في تحليل استجابة JSON:');
      console.log('استجابة غير صالحة:', data);
      console.log('خطأ التحليل:', e.message);
    }
    
    console.log('\n=== اكتمال الاختبار ===');
    console.log('للتحقق من إعدادات Brevo والبريد الإلكتروني، راجع ملف BREVO-EMAIL-SETUP-GUIDE.md');
  });
});

// معالجة أخطاء الطلب
req.on('error', (e) => {
  console.error('\n❌ خطأ في طلب HTTP:');
  console.error('- الرسالة:', e.message);
  console.error('- الرمز:', e.code);
  console.error('- التفاصيل:', e);
  console.error('\n🔍 تأكد من تشغيل الخادم على المنفذ 3000');
});

// إرسال البيانات وإنهاء الطلب
req.write(postData);
req.end();