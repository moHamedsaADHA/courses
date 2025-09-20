// حل بديل: استخدام Gmail SMTP للتطوير
import nodemailer from 'nodemailer';

console.log('🔧 اختبار Gmail SMTP كبديل لـ Brevo...\n');

async function testGmailSMTP() {
  try {
    console.log('📝 لاستخدام Gmail SMTP:');
    console.log('1. اذهب إلى Google Account Settings');
    console.log('2. Security → 2-Step Verification (فعّلها)');
    console.log('3. App Passwords → Mail → Generate');
    console.log('4. استخدم الباسورد المُولد في الكود\n');

    // مثال Gmail SMTP Configuration
    const gmailConfig = {
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // ضع إيميلك هنا
        pass: 'your-app-password'      // ضع App Password هنا
      }
    };

    console.log('📋 مثال Gmail Configuration:');
    console.log(`
// في ملف .env أضف:
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-digit-app-password

// في email.service.js:
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});
    `);

    console.log('💡 أو استخدم خدمات بديلة:');
    console.log('- SendGrid (مجانية حتى 100 إيميل/يوم)');
    console.log('- Mailgun (مجانية حتى 5000 إيميل/شهر)');
    console.log('- Amazon SES');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

// حل مؤقت: تحسين Mock Email Service
console.log('🎯 حل مؤقت: تحسين Mock Email Service');
console.log('=====================================');
console.log('بدلاً من إصلاح Brevo، يمكن تحسين Mock Service:');
console.log('1. حفظ OTP في قاعدة البيانات');
console.log('2. إظهار OTP في لوحة الأدمن');
console.log('3. إرسال OTP عبر SMS (مكتبة مجانية)');
console.log('4. استخدام Web Push Notifications\n');

testGmailSMTP();