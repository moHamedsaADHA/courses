// خدمة بريد محدثة تستخدم Brevo API بدلاً من SMTP
import { environment } from "../config/server.config.js";
import fetch from 'node-fetch';

class BrevoEmailService {
  constructor() {
    this.apiKey = environment.BREVO_API_KEY;
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
    this.senderEmail = environment.EMAIL_FROM;
    this.senderName = environment.EMAIL_FROM_NAME;
  }

  /**
   * إرسال بريد إلكتروني OTP باستخدام Brevo API
   */
  async sendOTPEmail(userEmail, userName, otp) {
    try {
      console.log(`📧 إرسال OTP إلى ${userEmail}...`);
      
      const emailData = {
        sender: {
          name: this.senderName,
          email: this.senderEmail
        },
        to: [
          {
            email: userEmail,
            name: userName
          }
        ],
        subject: '[منصة الكورسات] تفعيل حسابك - رمز التحقق OTP',
        htmlContent: this.getOTPEmailTemplate(userName, otp),
        textContent: this.getOTPEmailText(userName, otp)
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ تم إرسال OTP بنجاح! Message ID: ${result.messageId}`);
        return {
          success: true,
          messageId: result.messageId,
          message: 'تم إرسال رمز التحقق بنجاح'
        };
      } else {
        console.error('❌ فشل إرسال OTP:', result);
        return {
          success: false,
          error: result.message || 'فشل في إرسال البريد الإلكتروني'
        };
      }

    } catch (error) {
      console.error('❌ خطأ في إرسال OTP:', error.message);
      return {
        success: false,
        error: 'خطأ في خدمة البريد الإلكتروني'
      };
    }
  }

  /**
   * قالب HTML لبريد OTP
   */
  getOTPEmailTemplate(userName, otp) {
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رمز التحقق - منصة الكورسات</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">منصة الكورسات</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">رمز التحقق الخاص بك</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">مرحباً ${userName}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              مرحباً بك في منصة الكورسات. يرجى استخدام الرمز التالي لتفعيل حسابك:
            </p>
            
            <!-- OTP Box -->
            <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px dashed #667eea;">
              <p style="color: #667eea; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">رمز التحقق</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 6px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px; text-align: center;">
                ⏰ هذا الرمز صالح لمدة <strong>15 دقيقة فقط</strong>
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذا الإيميل. حسابك آمن ولا حاجة لاتخاذ أي إجراء.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              تم إرساله في: ${new Date().toLocaleString('ar-EG')}<br>
              © 2025 منصة الكورسات - جميع الحقوق محفوظة
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;
  }

  /**
   * نص بسيط لبريد OTP
   */
  getOTPEmailText(userName, otp) {
    return `
منصة الكورسات - رمز التحقق

مرحباً ${userName}!

مرحباً بك في منصة الكورسات. يرجى استخدام الرمز التالي لتفعيل حسابك:

رمز التحقق: ${otp}

هذا الرمز صالح لمدة 15 دقيقة فقط.

إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذا الإيميل.

تم إرساله في: ${new Date().toLocaleString('ar-EG')}

منصة الكورسات
    `.trim();
  }

  /**
   * اختبار الاتصال مع Brevo API
   */
  async testConnection() {
    try {
      const response = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ اتصال Brevo API ناجح!');
        console.log(`   الإيميل: ${data.email}`);
        console.log(`   Credits متبقية: ${data.plan?.creditsLeft || 'غير محدود'}`);
        return true;
      } else {
        console.log('❌ فشل اتصال Brevo API');
        return false;
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار Brevo:', error.message);
      return false;
    }
  }
}

// إنشاء instance واحد للاستخدام
export const brevoEmailService = new BrevoEmailService();

// إبقاء التصدير القديم للتوافق
export const emailService = brevoEmailService;