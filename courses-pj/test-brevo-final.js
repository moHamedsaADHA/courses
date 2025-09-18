import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// إنشاء transporter مع إعدادات Brevo
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
}); 

async function testBrevoConnection() {
  console.log('🔍 اختبار الاتصال مع Brevo...');
  console.log('📧 SMTP Host:', process.env.BREVO_SMTP_HOST);
  console.log('🔌 SMTP Port:', process.env.BREVO_SMTP_PORT);
  console.log('👤 SMTP User:', process.env.BREVO_SMTP_USER);
  console.log('🔑 API Key (آخر 10 أحرف):', process.env.BREVO_API_KEY.slice(-10));
  
  try {
    // التحقق من الاتصال
    console.log('\n⏳ التحقق من الاتصال...');
    await transporter.verify();
    console.log('✅ الاتصال نجح! Brevo متصل بنجاح');
    
    // إرسال رسالة تجريبية
    console.log('\n📤 إرسال رسالة تجريبية...');
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 OTP المُولد:', testOTP);
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // إرسال للنفس كاختبار
      subject: 'اختبار OTP - منصة الكورسات',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>🔐 رمز التحقق (OTP)</h2>
          <p>هذا اختبار لخدمة البريد الإلكتروني</p>
          <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${testOTP}</h1>
          </div>
          <p>إذا وصلت هذه الرسالة، فإن إعدادات Brevo تعمل بشكل صحيح!</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📬 تم إرسال الرسالة بنجاح!');
    console.log('📍 Message ID:', result.messageId);
    console.log('✉️  تحقق من صندوق الوارد في:', process.env.EMAIL_FROM);
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال مع Brevo:');
    console.error('🔍 نوع الخطأ:', error.code);
    console.error('📝 رسالة الخطأ:', error.message);
    
    // اقتراحات الإصلاح
    console.log('\n🔧 اقتراحات الإصلاح:');
    
    if (error.code === 'EAUTH') {
      console.log('- تحقق من صحة API Key');
      console.log('- تأكد من أن API Key له صلاحيات إرسال البريد');
      console.log('- تحقق من صحة SMTP User');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('- تحقق من اتصال الإنترنت');
      console.log('- تأكد من صحة SMTP Host');
    }
    
    if (error.code === 'ESOCKET') {
      console.log('- جرب Port 25 بدلاً من 587');
      console.log('- تحقق من إعدادات الجدار الناري (Firewall)');
    }
  }
}

// تشغيل الاختبار
testBrevoConnection();