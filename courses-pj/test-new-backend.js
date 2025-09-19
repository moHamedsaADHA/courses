// اختبار سريع للباك إند الجديد
const BASE_URL = 'https://courses-nine-eta.vercel.app';

console.log('🔗 اختبار الباك إند الجديد...');

async function testNewBackend() {
  const endpoints = [
    '/',
    '/api/health', 
    '/ping',
    '/api/users'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 GET ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`);
      console.log(`   ✅ Status: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        console.log(`   📄 Response:`, data);
      } else {
        console.log(`   ⚠️  Error response received`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }
}

testNewBackend();