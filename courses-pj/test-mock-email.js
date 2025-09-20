// اختبار خدمة البريد المؤقتة
import { mockEmailService } from './src/services/mock-email.service.js';

console.log('🧪 اختبار خدمة البريد المؤقتة (محاكاة)\n');

async function testMockEmailService() {
  try {
    // اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال...');
    await mockEmailService.testConnection();
    
    console.log('\n2️⃣ اختبار إرسال OTP...');
    
    // إرسال عدة إيميلات تجريبية
    const testEmails = [
      { email: 'admin@courses.com', name: 'مدير النظام', otp: '123456' },
      { email: 'instructor@courses.com', name: 'المدرس', otp: '789012' },
      { email: 'student@courses.com', name: 'الطالب', otp: '345678' }
    ];
    
    for (const test of testEmails) {
      const result = await mockEmailService.sendOTPEmail(test.email, test.name, test.otp);
      
      if (result.success) {
        console.log(`✅ نجح إرسال OTP لـ ${test.email}`);
      } else {
        console.log(`❌ فشل إرسال OTP لـ ${test.email}: ${result.error}`);
      }
    }
    
    // طباعة ملخص الإيميلات المرسلة
    console.log('\n3️⃣ ملخص الإيميلات المرسلة:');
    mockEmailService.printSentEmails();
    
    // اختبار استرجاع OTP
    console.log('\n4️⃣ اختبار استرجاع آخر OTP:');
    const lastOTP = mockEmailService.getLastOTP('student@courses.com');
    if (lastOTP) {
      console.log(`✅ آخر OTP للطالب: ${lastOTP.otp}`);
      console.log(`   تم إرساله في: ${lastOTP.sentAt.toLocaleString('ar-EG')}`);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testMockEmailService();