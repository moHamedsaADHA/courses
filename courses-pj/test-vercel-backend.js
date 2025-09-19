// اختبار شامل للباك إند على Vercel
// يتضمن اختبار جميع الـ endpoints الأساسية

const BASE_URL = 'https://courses-j9010ueb3-mohameds-projects-b68e5f4b.vercel.app';

console.log('🚀 بدء اختبار الباك إند على Vercel...\n');

// دالة مساعدة لإجراء طلبات HTTP
async function testEndpoint(url, method = 'GET', body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`📡 ${method} ${url}`);
    const response = await fetch(url, options);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📄 Response:`, data);
    console.log('');
    
    return { status: response.status, data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log('');
    return { error: error.message };
  }
}

// اختبارات الـ endpoints
async function runTests() {
  console.log('='.repeat(60));
  console.log('1. اختبار الصفحة الرئيسية');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/`);
  
  console.log('='.repeat(60));
  console.log('2. اختبار Health Check');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/health`);
  
  console.log('='.repeat(60));
  console.log('3. اختبار Ping Function');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/ping`);
  
  console.log('='.repeat(60));
  console.log('4. اختبار Categories API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/categories`);
  
  console.log('='.repeat(60));
  console.log('5. اختبار Courses API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/courses`);
  
  console.log('='.repeat(60));
  console.log('6. اختبار Lessons API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/lessons`);
  
  console.log('='.repeat(60));
  console.log('7. اختبار Schedule API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/schedule`);
  
  console.log('='.repeat(60));
  console.log('8. اختبار Tasks API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/tasks`);
  
  console.log('='.repeat(60));
  console.log('9. اختبار Quizzes API');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/quizzes`);
  
  console.log('='.repeat(60));
  console.log('10. اختبار 404 Handler');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/non-existent-endpoint`);
  
  console.log('='.repeat(60));
  console.log('11. اختبار CORS Headers');
  console.log('='.repeat(60));
  await testEndpoint(`${BASE_URL}/api/health`, 'OPTIONS', null, {
    'Origin': 'https://mohamedsaadha.github.io',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'content-type'
  });
  
  console.log('🎉 انتهى الاختبار!');
  console.log('\n📊 النتائج المتوقعة:');
  console.log('- الصفحة الرئيسية: 200 مع JSON banner');
  console.log('- Health Check: 200 مع { "ok": true }');
  console.log('- Ping: 200 مع معلومات الـ function');
  console.log('- APIs: 200 أو 401 (محتاج authentication)');
  console.log('- 404: 404 مع JSON error message');
  console.log('- CORS: 200 مع headers صحيحة');
}

// تشغيل الاختبارات
runTests().catch(console.error);