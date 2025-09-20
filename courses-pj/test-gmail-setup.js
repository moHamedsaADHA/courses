import { gmailEmailService } from './src/services/gmail-email.service.js';

console.log('🧪 اختبار Gmail SMTP Service...\n');

async function testGmailService() {
  try {
    console.log('1️⃣ اختبار الاتصال...');
    const connectionTest = await gmailEmailService.testConnection();
    
    if (!connectionTest.success) {
      console.log('❌ فشل الاتصال:', connectionTest.error);
      console.log('\n🔧 تأكد من:');
      console.log('- تفعيل 2-Step Verification في Google Account');
      console.log('- إنشاء App Password صحيح');
      console.log('- إضافة GMAIL_USER و GMAIL_PASS في .env');
      return;
    }
    
    console.log('\n2️⃣ اختبار إرسال OTP...');
    const otpTest = await gmailEmailService.sendOTPEmail(
      'test@example.com', // سيتم تحديثه بإيميلك
      'أحمد تست',
      '123456'
    );
    
    if (otpTest.success) {
      console.log('✅ تم إرسال OTP بنجاح!');
      console.log(`📧 Message ID: ${otpTest.messageId}`);
    } else {
      console.log('❌ فشل إرسال OTP:', otpTest.error);
    }

  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

console.log('📝 خطوات الإعداد:');
console.log('1. فعّل 2-Step Verification في Google Account');
console.log('2. أنشئ App Password للتطبيق');
console.log('3. أضف GMAIL_USER و GMAIL_PASS في .env');
console.log('4. شغّل هذا الاختبار\n');

testGmailService();