import { environment } from "./src/config/server.config.js";
import fetch from 'node-fetch';

console.log('🔍 فحص بيانات Brevo...\n');

console.log('📋 بيانات البيئة:');
console.log(`BREVO_API_KEY: ${environment.BREVO_API_KEY ? `...${environment.BREVO_API_KEY.slice(-10)}` : 'غير موجود'}`);
console.log(`EMAIL_FROM: ${environment.EMAIL_FROM}`);
console.log(`EMAIL_FROM_NAME: ${environment.EMAIL_FROM_NAME}\n`);

async function directAPITest() {
  try {
    console.log('🧪 اختبار مباشر للـ API...');
    
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': environment.BREVO_API_KEY
      }
    });
    
    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📡 Response Status Text: ${response.statusText}`);
    
    const data = await response.text(); // استخدام text بدلاً من json للحصول على الرد الخام
    console.log(`📡 Response Body: ${data}`);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('\n✅ نجح الاتصال!');
      console.log(`   الإيميل: ${jsonData.email}`);
      return true;
    } else {
      console.log('\n❌ فشل الاتصال');
      return false;
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    return false;
  }
}

directAPITest();