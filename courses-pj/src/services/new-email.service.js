// نفس منطق mailSender من المشروع الشغال
import nodemailer from 'nodemailer';
import { environment } from '../config/server.config.js';

const mailSender = async (email, title, body) => {
  try {
    console.log(`📧 إرسال بريد إلى: ${email}`);
    
    let transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: environment.EMAILTEST,
        pass: environment.APIKE,
      },
    });

    let info = await transporter.sendMail({
      from: `"منصة الكورسات" <${environment.EMAILTEST}>`, 
      to: email, 
      subject: title, 
      html: body, 
    });

    console.log("✅ تم إرسال البريد بنجاح:", info.messageId);
    return info;
    
  } catch (error) {
    console.log("❌ خطأ في إرسال البريد:", error.message);
    throw error;
  }
};

// دالة لإرسال OTP مثل المشروع الأصلي
export const sendOTPEmail = async (email, otp, userName = 'المستخدم') => {
  try {
    const title = "تفعيل حسابك - منصة الكورسات";
    
    const body = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #4CAF50; text-align: center; margin-bottom: 30px;">
            🎓 منصة الكورسات التعليمية
          </h1>
          
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            مرحباً <strong>${userName}</strong>،
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            لإتمام تسجيل حسابك في منصة الكورسات، يُرجى استخدام رمز التحقق التالي:
          </p>
          
          <div style="background: #f0f8f0; border: 2px dashed #4CAF50; padding: 25px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #2e7d32; letter-spacing: 4px; font-family: monospace;">
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
    `;

    const result = await mailSender(email, title, body);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'تم إرسال OTP بنجاح'
    };
    
  } catch (error) {
    console.error('❌ فشل إرسال OTP:', error.message);
    
    return {
      success: false,
      error: error.message,
      message: 'فشل في إرسال OTP'
    };
  }
};

// دالة لإرسال بريد ترحيب
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const title = "مرحباً بك في منصة الكورسات! 🎉";
    
    const body = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; text-align: center;">🎓 أهلاً وسهلاً ${userName}!</h2>
          
          <p>تم تفعيل حسابك بنجاح في منصة الكورسات التعليمية.</p>
          
          <p>يمكنك الآن:</p>
          <ul style="line-height: 1.8;">
            <li>📚 تصفح الكورسات المتاحة</li>
            <li>📝 التسجيل في الكورسات</li>
            <li>👨‍🏫 التفاعل مع المدرسين</li>
            <li>📊 متابعة تقدمك الدراسي</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://stellular-manatee-69e2de.netlify.app/" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              🚀 ابدأ التعلم الآن
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
          <p style="text-align: center;"><small>منصة الكورسات التعليمية</small></p>
        </div>
      </div>
    `;

    const result = await mailSender(email, title, body);
    
    return {
      success: true,
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('❌ فشل إرسال بريد الترحيب:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة لإرسال بريد إعادة تعيين كلمة المرور
export const sendResetPasswordEmail = async (email, userName, resetLink, resetToken) => {
  try {
    const title = "إعادة تعيين كلمة المرور - منصة الكورسات";
    
    const body = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #FF5722; text-align: center; margin-bottom: 30px;">
            🔐 إعادة تعيين كلمة المرور
          </h2>
          
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            مرحباً <strong>${userName}</strong>،
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة الكورسات. إذا لم تطلب هذا، يُرجى تجاهل هذا البريد.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #FF5722; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              🔄 إعادة تعيين كلمة المرور
            </a>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⚠️ <strong>تنبيه:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              إذا لم يعمل الرابط، انسخ الكود التالي واستخدمه في صفحة إعادة التعيين:
            </p>
            <p style="font-family: monospace; background: #e9ecef; padding: 10px; margin: 10px 0; border-radius: 3px; word-break: break-all; font-size: 11px;">
              ${resetToken}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            إذا لم تطلب إعادة تعيين كلمة المرور، يُرجى تجاهل هذا البريد الإلكتروني. حسابك آمن.
          </p>
          
          <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
          
          <p style="text-align: center; color: #999; font-size: 12px;">
            © 2025 منصة الكورسات التعليمية - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    `;

    const result = await mailSender(email, title, body);
    
    console.log(`✅ تم إرسال بريد إعادة تعيين كلمة المرور إلى ${email}`);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'تم إرسال بريد إعادة تعيين كلمة المرور بنجاح'
    };
    
  } catch (error) {
    console.error('❌ فشل إرسال بريد إعادة تعيين كلمة المرور:', error.message);
    
    return {
      success: false,
      error: error.message,
      message: 'فشل في إرسال بريد إعادة تعيين كلمة المرور'
    };
  }
};

export default mailSender;