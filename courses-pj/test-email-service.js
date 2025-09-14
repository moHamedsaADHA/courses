// test-email-service.js
// أداة لاختبار خدمة البريد الإلكتروني والتحقق من عمل إعدادات Brevo

import { emailService } from './src/services/email.service.js';
import dotenv from 'dotenv';

// التأكد من تحميل متغيرات البيئة
dotenv.config();

// البريد الإلكتروني المستهدف للاختبار (يمكن تعديله من سطر الأوامر)
const targetEmail = process.argv[2] || 'your-email@example.com';

/**
 * اختبار الاتصال بخادم البريد
 */
async function testConnection() {
  console.log('\n=== اختبار الاتصال بخادم البريد ===');
  try {
    const connectionStatus = await emailService.verifyConnection();
    if (connectionStatus.connected) {
      console.log('✅', connectionStatus.message);
    } else {
      console.log('❌', connectionStatus.message);
      console.log('تفاصيل الخطأ:', connectionStatus.error);
    }
  } catch (error) {
    console.error('❌ حدث خطأ أثناء اختبار الاتصال:', error.message);
  }
}

/**
 * إرسال بريد إلكتروني اختباري
 */
async function sendTestEmail() {
  console.log(`\n=== إرسال بريد إلكتروني اختباري إلى ${targetEmail} ===`);
  try {
    const result = await emailService.sendTestEmail(targetEmail);
    console.log('✅ تم إرسال البريد الإلكتروني بنجاح');
    console.log('معرف الرسالة:', result.messageId);
    console.log('\n🔍 تحقق من صندوق البريد الوارد الخاص بك (وأيضًا مجلد الرسائل غير المرغوب فيها)');
    console.log('⏱️ قد يستغرق وصول البريد الإلكتروني بضع دقائق');
  } catch (error) {
    console.error('❌ فشل إرسال البريد الإلكتروني الاختباري:', error.message);
  }
}

/**
 * اختبار إرسال OTP
 */
async function sendTestOTP() {
  console.log(`\n=== إرسال رمز OTP اختباري إلى ${targetEmail} ===`);
  try {
    // إنشاء OTP للاختبار
    const otp = emailService.generateOTP();
    const result = await emailService.sendOTPEmail(targetEmail, 'مستخدم الاختبار', otp);
    console.log('✅ تم إرسال رمز OTP بنجاح');
    console.log('الرمز:', otp);
    console.log('معرف الرسالة:', result.messageId);
  } catch (error) {
    console.error('❌ فشل إرسال رمز OTP الاختباري:', error.message);
  }
}

/**
 * عرض معلومات التكوين الحالية (بدون كشف معلومات حساسة)
 */
function displayConfiguration() {
  console.log('\n=== معلومات تكوين خدمة البريد ===');
  console.log('BREVO_SMTP_HOST:', process.env.BREVO_SMTP_HOST);
  console.log('BREVO_SMTP_PORT:', process.env.BREVO_SMTP_PORT);
  console.log('BREVO_SMTP_USER:', process.env.BREVO_SMTP_USER);
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME);
  
  // عدم عرض كلمة المرور أو المفتاح الخاص
  if (process.env.BREVO_SMTP_PASS) {
    console.log('BREVO_SMTP_PASS:', '********** (موجود)');
  } else {
    console.log('BREVO_SMTP_PASS:', '(غير محدد)');
  }
  
  if (process.env.BREVO_API_KEY) {
    console.log('BREVO_API_KEY:', '********** (موجود)');
  } else {
    console.log('BREVO_API_KEY:', '(غير محدد)');
  }
}

/**
 * وظيفة تشغيل الاختبارات
 */
async function runTests() {
  console.log('=== أداة اختبار خدمة البريد الإلكتروني ===');
  console.log('تاريخ التشغيل:', new Date().toLocaleString('ar-EG'));
  
  // عرض التكوين الحالي
  displayConfiguration();
  
  // اختبار الاتصال بخادم البريد
  await testConnection();
  
  // إرسال بريد إلكتروني اختباري
  await sendTestEmail();
  
  // اختبار إرسال OTP
  await sendTestOTP();
  
  console.log('\n=== انتهت الاختبارات ===');
  console.log('للتحقق من إعدادات Brevo والبريد الإلكتروني، راجع ملف BREVO-EMAIL-SETUP-GUIDE.md');
}

// تشغيل الاختبارات
runTests().catch(error => {
  console.error('حدث خطأ غير متوقع أثناء الاختبارات:', error);
  process.exit(1);
});