import fetch from 'node-fetch';

// اختبار register endpoint
const testRegister = async () => {
  try {
    const userData = {
      name: 'أحمد محمد علي حسن',
      email: 'test@example.com',
      password: 'Password123',
      location: 'بغداد',
      grade: 'الصف الأول متوسط'
    };

    console.log('إرسال البيانات:', userData);

    const response = await fetch('http://localhost:3000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegister();