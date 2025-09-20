// اختبار خدمة البريد الجديدة
import { brevoEmailService } from './src/services/brevo-email.service.js';

console.log('🧪 اختبار خدمة Brevo Email الجديدة\n');

async function testNewEmailService() {
  try {
    // اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال...');
    const connectionTest = await brevoEmailService.testConnection();
    
    if (!connectionTest) {
      console.log('❌ فشل الاتصال - توقف الاختبار');
      return;
    }
    
    console.log('\n2️⃣ اختبار إرسال OTP...');
    
    // إرسال OTP تجريبي
    const result = await brevoEmailService.sendOTPEmail(
      'admin@courses.com',
      'مدير النظام', 
      '123456'
    );
    
    if (result.success) {
      console.log('✅ نجح إرسال OTP!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log('   📧 تحقق من بريد admin@courses.com');
    } else {
      console.log('❌ فشل إرسال OTP');
      console.log(`   الخطأ: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testNewEmailService();