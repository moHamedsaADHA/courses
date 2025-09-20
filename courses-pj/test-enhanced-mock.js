// تعديل مؤقت لحين إصلاح Gmail
import { mockEmailService } from './src/services/mock-email.service.js';

console.log('🔧 استخدام Enhanced Mock Service مؤقتاً...\n');

async function testEnhancedMock() {
  try {
    console.log('📧 إرسال OTP تجريبي...');
    
    const result = await mockEmailService.sendOTPEmail(
      'amedmohmed925@gmail.com',
      '123456',
      'أحمد محمد'
    );
    
    if (result.success) {
      console.log('✅ Mock Service يعمل بشكل مثالي!');
      console.log(`🔢 OTP: ${result.otp}`);
      console.log('💡 يمكن استخدامه للتطوير حالياً');
      
      console.log('\n📝 لإصلاح Gmail:');
      console.log('1. تأكد من 2-Step Verification');
      console.log('2. اعمل App Password جديد');
      console.log('3. جرّب مرة أخرى');
      
    } else {
      console.log('❌ حتى Mock Service فيه مشكلة:', result.error);
    }

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

console.log('🎯 اختبار Enhanced Mock Service');
console.log('==============================\n');

testEnhancedMock();