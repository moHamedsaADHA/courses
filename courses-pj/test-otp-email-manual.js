import { emailService } from './src/services/email.service.js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

async function testOTPEmail() {
  console.log('🚀 بدء اختبار إرسال OTP...\n');
  
  try {
    // طباعة تشخيص الإعدادات
    emailService.printEmailDiagnostics();
    
    // اختبار الاتصال
    console.log('\n🔍 اختبار الاتصال بخادم البريد...');
    const connectionResult = await emailService.verifyConnection();
    console.log(`📡 حالة الاتصال: ${connectionResult.connected ? '✅ نجح' : '❌ فشل'}`);
    if (!connectionResult.connected) {
      console.error('❗ خطأ الاتصال:', connectionResult.error);
      return;
    }
    
    // إنشاء OTP تجريبي
    const testOTP = emailService.generateOTP();
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testName = 'مستخدم تجريبي';
    
    console.log(`\n📧 إرسال OTP تجريبي...`);
    console.log(`📨 الإيميل: ${testEmail}`);
    console.log(`🔢 رمز OTP: ${testOTP}`);
    console.log(`⏰ انتهاء الصلاحية: ${emailService.getOTPExpiry().toLocaleString('ar-EG')}`);
    
    // إرسال البريد
    const result = await emailService.sendOTPEmail(testEmail, testName, testOTP);
    
    if (result.success) {
      console.log(`\n✅ تم إرسال OTP بنجاح!`);
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log(`🆔 Email ID: ${result.emailId}`);
    } else {
      console.log(`\n❌ فشل في إرسال OTP`);
    }
    
    // طباعة سجل البريد الإلكتروني
    console.log('\n📋 سجل آخر رسائل البريد:');
    const emailLog = emailService.getEmailLog();
    emailLog.slice(-3).forEach((log, index) => {
      const status = log.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${log.type} إلى ${log.recipient}`);
      console.log(`   الوقت: ${log.timestamp.toLocaleString('ar-EG')}`);
      console.log(`   المحاولات: ${log.attempts}`);
      if (log.messageId) console.log(`   Message ID: ${log.messageId}`);
      if (log.error) console.log(`   خطأ: ${log.error}`);
    });
    
  } catch (error) {
    console.error('💥 خطأ في اختبار OTP:', error);
  }
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  testOTPEmail().then(() => {
    console.log('\n🏁 انتهى الاختبار');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 خطأ فادح:', error);
    process.exit(1);
  });
}

export { testOTPEmail };