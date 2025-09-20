// خدمة بريد إلكتروني محدثة تدعم Gmail SMTP
import nodemailer from 'nodemailer';
import { environment } from '../config/server.config.js';

class GmailEmailService {
  constructor() {
    // تكوين Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: environment.GMAIL_USER,     // إيميل Gmail
        pass: environment.GMAIL_PASS      // App Password من Google
      },
      // إعدادات إضافية لتحسين الأداء
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
    
    this.senderEmail = environment.GMAIL_USER;
    this.senderName = environment.EMAIL_FROM_NAME || 'منصة الكورسات';
    
    console.log('📧 Gmail Email Service مُهيأ');
  }

  /**
   * إرسال بريد إلكتروني OTP
   */
  async sendOTPEmail(userEmail, userName, otp) {
    try {
      console.log(`📧 إرسال OTP إلى ${userEmail}...`);

      const mailOptions = {
        from: {
          name: this.senderName,
          address: this.senderEmail
        },
        to: {
          name: userName,
          address: userEmail
        },
        subject: '[منصة الكورسات] رمز التحقق OTP',
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #4CAF50; text-align: center; margin-bottom: 30px;">
                🎓أ.مجدي جمال منصة الكورسات التعليمية
              </h2>
              
              <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                مرحباً <strong>${userName}</strong>،
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                لإتمام تسجيل حسابك في منصة الكورسات، يُرجى استخدام رمز التحقق التالي:
              </p>
              
              <div style="background: #f0f8f0; border: 2px dashed #4CAF50; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #2e7d32; letter-spacing: 3px;">
                  ${otp}
                </span>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  ⚠️ <strong>تنبيه:</strong> هذا الرمز صالح لمدة 15 دقيقة فقط
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                إذا لم تطلب هذا الرمز، يُرجى تجاهل هذا البريد الإلكتروني.
              </p>
              
              <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
              
              <p style="text-align: center; color: #999; font-size: 12px;">
                © 2025 منصة الكورسات التعليمية - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        `,
        text: `مرحباً ${userName}،\n\nرمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 15 دقيقة فقط.\n\nمنصة الكورسات التعليمية`
      };

      // إرسال البريد الإلكتروني
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`✅ تم إرسال OTP بنجاح إلى ${userEmail}: ${result.messageId}`);
      
      return { 
        success: true, 
        messageId: result.messageId,
        response: result.response
      };

    } catch (error) {
      console.error('❌ فشل إرسال OTP:', error.message);
      
      // تشخيص نوع الخطأ
      if (error.code === 'EAUTH') {
        console.error('🔐 خطأ في المصادقة - تحقق من Gmail credentials');
      } else if (error.code === 'EMESSAGE') {
        console.error('📧 خطأ في محتوى البريد');
      }
      
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * إرسال بريد ترحيب
   */
  async sendWelcomeEmail(userEmail, userName) {
    try {
      console.log(`📧 إرسال بريد ترحيب إلى ${userEmail}...`);

      const mailOptions = {
        from: {
          name: this.senderName,
          address: this.senderEmail
        },
        to: userEmail,
        subject: '🎉 مرحباً بك في منصة الكورسات!',
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">🎓 أهلاً وسهلاً ${userName}!</h2>
            <p>تم تفعيل حسابك بنجاح في منصة الكورسات التعليمية.</p>
            <p>يمكنك الآن:</p>
            <ul>
              <li>📚 تصفح الكورسات المتاحة</li>
              <li>📝 التسجيل في الكورسات</li>
              <li>👨‍🏫 التفاعل مع المدرسين</li>
              <li>📊 متابعة تقدمك الدراسي</li>
            </ul>
            <hr>
            <p><small>منصة الكورسات التعليمية</small></p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ تم إرسال بريد الترحيب بنجاح: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ فشل إرسال بريد الترحيب:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * اختبار الاتصال
   */
  async testConnection() {
    try {
      console.log('🧪 اختبار اتصال Gmail SMTP...');
      
      await this.transporter.verify();
      
      console.log('✅ Gmail SMTP يعمل بشكل مثالي!');
      return { success: true, message: 'اتصال ناجح' };
      
    } catch (error) {
      console.error('❌ فشل اختبار Gmail SMTP:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// تصدير instance واحد
export const gmailEmailService = new GmailEmailService();

// للاستخدام في باقي الملفات
export { GmailEmailService };