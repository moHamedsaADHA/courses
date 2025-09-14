import http from 'http';

const postData = JSON.stringify({
  name: 'أحمد محمد علي حسن',
  email: 'test2@example.com',
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

console.log('إرسال البيانات:', postData);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
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