import http from 'http';

// اختبار register مع بريد إلكتروني حقيقي
const postData = JSON.stringify({
  name: 'أحمد محمد علي حسن',
  email: 'moHamedsaADHA@gmail.com', // البريد الخاص بك
  password: 'Password123',
  location: 'بغداد',
  grade: 'الصف الأول الإعدادي'
});

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

console.log('إرسال طلب التسجيل...');
console.log('البيانات:', postData);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        console.log('\n✅ تم التسجيل بنجاح!');
        console.log('📧 حالة البريد الإلكتروني:', parsed.emailSent ? 'تم الإرسال' : 'فشل الإرسال');
        if (parsed.tempToken) {
          console.log('🔑 الرمز المؤقت متاح للتفعيل');
        }
        if (parsed.otpForTesting) {
          console.log('🔢 رمز OTP للاختبار:', parsed.otpForTesting);
        }
      }
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(postData);
req.end();