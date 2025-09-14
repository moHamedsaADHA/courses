import http from 'http';

// اختبار بسيط للاتصال
const testData = {
  name: 'أحمد محمد علي حسن',
  email: 'test' + Date.now() + '@example.com', // ايميل فريد
  password: 'Password123',
  location: 'بغداد',
  grade: 'الصف الأول الإعدادي'
};

console.log('اختبار بسيط للتسجيل...');
console.log('البيانات:', JSON.stringify(testData, null, 2));

const postData = JSON.stringify(testData);

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

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('✨ استجابة مُحللة:');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.success) {
          console.log('✅ تم التسجيل بنجاح!');
          if (parsed.emailSent) {
            console.log('📧 تم إرسال OTP إلى البريد الإلكتروني');
          }
          if (parsed.otpForTesting) {
            console.log('🔢 OTP للاختبار:', parsed.otpForTesting);
          }
        }
      } catch (e) {
        console.log('خطأ في تحليل JSON:', e.message);
      }
    }
  });
});

req.on('error', (e) => {
  console.error('خطأ في الطلب:', e.message);
});

req.write(postData);
req.end();