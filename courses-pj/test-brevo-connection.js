require('dotenv').config();
const nodemailer = require('nodemailer');

// إعداد nodemailer مع Brevo
const transporter = nodemailer.createTransporter({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

async function testBrevoConnection() {
    console.log('🔍 اختبار إعدادات Brevo...\n');
    
    // طباعة الإعدادات المستخدمة (بدون كلمة المرور الكاملة)
    console.log('📋 الإعدادات المستخدمة:');
    console.log('SMTP Host:', process.env.BREVO_SMTP_HOST);
    console.log('SMTP Port:', process.env.BREVO_SMTP_PORT);
    console.log('SMTP User:', process.env.BREVO_SMTP_USER);
    console.log('API Key (أول 10 أحرف):', process.env.BREVO_API_KEY?.substring(0, 10) + '...');
    console.log('Email From:', process.env.EMAIL_FROM);
    console.log('---\n');

    try {
        // اختبار الاتصال
        console.log('🔗 اختبار الاتصال مع خادم Brevo...');
        await transporter.verify();
        console.log('✅ الاتصال مع Brevo ناجح!\n');

        // إرسال إيميل تجريبي
        console.log('📧 إرسال إيميل تجريبي...');
        
        // إنشاء OTP تجريبي
        const testOTP = Math.floor(100000 + Math.random() * 900000);
        console.log(`🔢 OTP التجريبي: ${testOTP}`);
        
        const testEmail = 'test@example.com'; // غير هذا لإيميلك الحقيقي للاختبار
        
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: testEmail,
            subject: 'اختبار OTP - منصة الكورسات',
            html: `
                <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
                    <h2>اختبار إرسال OTP</h2>
                    <p>هذا إيميل اختبار لتأكيد عمل نظام OTP.</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>رمز التحقق (OTP):</h3>
                        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${testOTP}</h1>
                    </div>
                    <p>إذا وصلك هذا الإيميل، فإن إعدادات Brevo تعمل بشكل صحيح!</p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ تم إرسال الإيميل التجريبي بنجاح!');
        console.log('📨 معرف الرسالة:', result.messageId);
        console.log('📧 تم الإرسال إلى:', testEmail);
        
    } catch (error) {
        console.error('❌ فشل في اختبار Brevo:');
        console.error('نوع الخطأ:', error.name);
        console.error('رسالة الخطأ:', error.message);
        
        if (error.code) {
            console.error('كود الخطأ:', error.code);
        }
        
        // اقتراحات بناءً على نوع الخطأ
        console.log('\n💡 اقتراحات لحل المشكلة:');
        
        if (error.message.includes('authentication')) {
            console.log('- تحقق من اسم المستخدم وكلمة المرور في SMTP');
            console.log('- تأكد من صحة API Key');
        }
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
            console.log('- تحقق من اتصال الإنترنت');
            console.log('- تحقق من إعدادات الـ Firewall');
        }
        
        if (error.message.includes('535')) {
            console.log('- بيانات المصادقة غير صحيحة');
            console.log('- تحقق من BREVO_SMTP_USER و BREVO_SMTP_PASS');
        }
        
        console.log('- راجع دليل إعداد Brevo في الملف: BREVO-EMAIL-SETUP-GUIDE.md');
    }
}

// تشغيل الاختبار
testBrevoConnection().then(() => {
    console.log('\n🏁 انتهى الاختبار.');
    process.exit(0);
}).catch((error) => {
    console.error('\n💥 خطأ في تشغيل الاختبار:', error);
    process.exit(1);
});