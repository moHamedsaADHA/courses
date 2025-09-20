import { environment } from "../config/server.config.js";
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockEmailService } from './mock-email.service.js';

class EmailService {
  constructor() {
    // تكوين Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: environment.BREVO_SMTP_HOST,
      port: parseInt(environment.BREVO_SMTP_PORT),
      secure: false, // true للمنفذ 465، false للمنافذ الأخرى
      auth: {
        user: environment.BREVO_SMTP_USER,
        pass: environment.BREVO_SMTP_PASS,
      },
      // إضافة خيارات إضافية لتحسين التسليم
      pool: true, // استخدام وضع التجمع للاتصالات
      maxConnections: 5, // الحد الأقصى للاتصالات المتزامنة
      maxMessages: 100, // الحد الأقصى للرسائل لكل اتصال
      // تعيين وقت انتظار أطول (بالملي ثانية)
      connectionTimeout: 10000, // 10 ثواني للاتصال
      socketTimeout: 30000, // 30 ثانية لعمليات الإرسال
    });
    
    // بيانات المرسل
    this.senderEmail = environment.EMAIL_FROM;
    this.senderName = environment.EMAIL_FROM_NAME;
    
    // عدد محاولات إعادة الإرسال وعداد محاولات الإرسال
    this.maxRetries = 3;
    this.retryDelay = 1000; // تأخير بين المحاولات بالمللي ثانية
    
    // سجل إرسال البريد الإلكتروني للتتبع
    this.emailLog = [];
  }

  /**
   * إرسال بريد إلكتروني OTP مع إمكانية إعادة المحاولة والسجلات
   * @param {string} userEmail - البريد الإلكتروني للمستلم
   * @param {string} userName - اسم المستلم
   * @param {string} otp - رمز OTP
   * @returns {Promise<Object>} - نتيجة إرسال البريد
   */
  async sendOTPEmail(userEmail, userName, otp) {
    // استخدام النظام الجديد المجرب من المشروع الشغال
    const USE_NEW_EMAIL = environment.EMAILTEST && environment.APIKE;
    
    if (USE_NEW_EMAIL) {
      console.log('📧 استخدام New Email Service (المجرب والشغال)');
      const { sendOTPEmail } = await import('./new-email.service.js');
      return await sendOTPEmail(userEmail, otp, userName);
    } else {
      console.log('🔧 استخدام Mock Email Service للتطوير');
      return await mockEmailService.sendOTPEmail(userEmail, otp, userName);
    }

    const emailId = `otp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logEntry = {
      id: emailId,
      type: 'otp',
      recipient: userEmail,
      timestamp: new Date(),
      attempts: 0,
      success: false
    };
    
    try {
      // قراءة قالب البريد الإلكتروني
  // Resolve template path relative to this file (works in serverless bundles)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, '..', 'templates', 'email.template.html');
      let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
      
      // استبدال المتغيرات في القالب
      htmlTemplate = htmlTemplate
        .replace('{{userName}}', userName)
        .replace('{{otp}}', otp)
        .replace('{{companyName}}', 'منصة الكورسات');

      // إعداد خيارات البريد
      const mailOptions = {
        from: {
          name: this.senderName,
          address: this.senderEmail
        },
        to: {
          name: userName,
          address: userEmail
        },
        subject: '[منصة الكورسات] تفعيل حسابك - رمز التحقق OTP',
        html: htmlTemplate,
        text: `مرحبا ${userName}،\n\nرمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 15 دقيقة فقط.\n\nمنصة الكورسات`,
        // إضافة معلومات رأس إضافية لتحسين التسليم
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      };

      // محاولة إرسال البريد الإلكتروني مع إعادة المحاولة
      let lastError = null;
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          // تسجيل محاولة
          logEntry.attempts++;
          
          // محاولة إرسال البريد
          const result = await this.transporter.sendMail(mailOptions);
          
          // تحديث سجل البريد
          logEntry.success = true;
          logEntry.messageId = result.messageId;
          this.emailLog.push(logEntry);
          
          console.log(`OTP Email sent successfully to ${userEmail}: ${result.messageId}`);
          return { success: true, messageId: result.messageId, emailId };
        } catch (err) {
          lastError = err;
          console.warn(`Email sending attempt ${attempt}/${this.maxRetries} failed:`, err.message);
          
          // انتظر قبل المحاولة التالية (إلا إذا كانت المحاولة الأخيرة)
          if (attempt < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            // زيادة التأخير للمحاولة التالية (تأخير متصاعد)
            this.retryDelay *= 1.5;
          }
        }
      }
      
      // إذا وصلنا إلى هنا، فإن جميع المحاولات قد فشلت
      throw lastError || new Error('Failed to send email after multiple attempts');
    } catch (error) {
      // تحديث سجل البريد بمعلومات الخطأ
      logEntry.error = error.message;
      logEntry.errorStack = error.stack;
      this.emailLog.push(logEntry);
      
      console.error(`Error sending OTP email to ${userEmail}:`, error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  /**
   * إرسال بريد إلكتروني إعادة تعيين كلمة المرور
   * @param {string} userEmail - البريد الإلكتروني للمستلم
   * @param {string} userName - اسم المستلم
   * @param {string} resetToken - رمز إعادة تعيين كلمة المرور
   * @returns {Promise<Object>} - نتيجة إرسال البريد
   */
  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const emailId = `reset-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logEntry = {
      id: emailId,
      type: 'password-reset',
      recipient: userEmail,
      timestamp: new Date(),
      attempts: 0,
      success: false
    };
    
    try {
      const resetUrl = `${environment.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: {
          name: this.senderName,
          address: this.senderEmail
        },
        to: {
          name: userName,
          address: userEmail
        },
        subject: '[منصة الكورسات] إعادة تعيين كلمة المرور',
        html: `
          <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
            <h2>مرحبا ${userName}</h2>
            <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
            <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
            <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
            <br>
            <p>مع تحيات فريق منصة الكورسات</p>
          </div>
        `,
        text: `مرحبا ${userName}،\n\nلإعادة تعيين كلمة المرور، اذهب إلى: ${resetUrl}\n\nهذا الرابط صالح لمدة ساعة واحدة فقط.\n\nمنصة الكورسات`
      };

      // محاولة إرسال البريد الإلكتروني مع إعادة المحاولة
      let lastError = null;
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          // تسجيل محاولة
          logEntry.attempts++;
          
          // محاولة إرسال البريد
          const result = await this.transporter.sendMail(mailOptions);
          
          // تحديث سجل البريد
          logEntry.success = true;
          logEntry.messageId = result.messageId;
          this.emailLog.push(logEntry);
          
          console.log(`Password reset email sent successfully to ${userEmail}: ${result.messageId}`);
          return { success: true, messageId: result.messageId, emailId };
        } catch (err) {
          lastError = err;
          console.warn(`Email sending attempt ${attempt}/${this.maxRetries} failed:`, err.message);
          
          // انتظر قبل المحاولة التالية (إلا إذا كانت المحاولة الأخيرة)
          if (attempt < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            // زيادة التأخير للمحاولة التالية (تأخير متصاعد)
            this.retryDelay *= 1.5;
          }
        }
      }
      
      // إذا وصلنا إلى هنا، فإن جميع المحاولات قد فشلت
      throw lastError || new Error('Failed to send email after multiple attempts');
    } catch (error) {
      // تحديث سجل البريد بمعلومات الخطأ
      logEntry.error = error.message;
      logEntry.errorStack = error.stack;
      this.emailLog.push(logEntry);
      
      console.error(`Error sending password reset email to ${userEmail}:`, error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * إرسال بريد إلكتروني اختبار للتحقق من الإعدادات
   * @param {string} targetEmail - البريد الإلكتروني المستهدف
   * @returns {Promise<Object>} - نتيجة الإرسال
   */
  async sendTestEmail(targetEmail) {
    try {
      const mailOptions = {
        from: {
          name: this.senderName,
          address: this.senderEmail
        },
        to: targetEmail,
        subject: '[منصة الكورسات] اختبار خدمة البريد الإلكتروني',
        html: `
          <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
            <h2>اختبار إرسال البريد الإلكتروني</h2>
            <p>هذا بريد إلكتروني للتحقق من إعدادات خدمة البريد.</p>
            <p>إذا استلمت هذا البريد، فهذا يعني أن خدمة البريد الإلكتروني تعمل بشكل صحيح.</p>
            <p>الوقت: ${new Date().toLocaleString('ar-EG')}</p>
          </div>
        `,
        text: `اختبار إرسال البريد الإلكتروني\n\nهذا بريد إلكتروني للتحقق من إعدادات خدمة البريد.\nإذا استلمت هذا البريد، فهذا يعني أن خدمة البريد الإلكتروني تعمل بشكل صحيح.\n\nالوقت: ${new Date().toLocaleString('ar-EG')}`
      };

      // محاولة إرسال البريد الإلكتروني مع إعادة المحاولة
      let lastError = null;
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          // محاولة إرسال البريد
          const result = await this.transporter.sendMail(mailOptions);
          console.log('Test email sent successfully:', result.messageId);
          return { success: true, messageId: result.messageId };
        } catch (err) {
          lastError = err;
          console.warn(`Test email sending attempt ${attempt}/${this.maxRetries} failed:`, err.message);
          
          // انتظر قبل المحاولة التالية (إلا إذا كانت المحاولة الأخيرة)
          if (attempt < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            // زيادة التأخير للمحاولة التالية (تأخير متصاعد)
            this.retryDelay *= 1.5;
          }
        }
      }
      
      // إذا وصلنا إلى هنا، فإن جميع المحاولات قد فشلت
      throw lastError || new Error('Failed to send test email after multiple attempts');
    } catch (error) {
      console.error('Error sending test email:', error);
      throw new Error(`Failed to send test email: ${error.message}`);
    }
  }

  /**
   * دالة لإنشاء OTP عشوائي
   * @returns {string} - رمز OTP مكون من 6 أرقام
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * حساب تاريخ انتهاء صلاحية OTP (15 دقيقة من الآن)
   * @returns {Date} - تاريخ انتهاء الصلاحية
   */
  getOTPExpiry() {
    return new Date(Date.now() + 15 * 60 * 1000); // 15 دقيقة
  }
  
  /**
   * التحقق من حالة الاتصال بخدمة البريد الإلكتروني
   * @returns {Promise<Object>} - حالة الاتصال
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { connected: true, message: "تم الاتصال بخادم البريد بنجاح" };
    } catch (error) {
      return { connected: false, message: "فشل الاتصال بخادم البريد", error: error.message };
    }
  }
  
  /**
   * الحصول على سجل البريد الإلكتروني
   * @returns {Array} - سجل البريد الإلكتروني
   */
  getEmailLog() {
    return this.emailLog;
  }

  /**
   * اختبار إرسال OTP لتأكيد عمل الخدمة
   * @param {string} testEmail - البريد الإلكتروني للاختبار
   * @returns {Promise<Object>} - نتيجة الاختبار
   */
  async testOTPSending(testEmail = 'test@example.com') {
    const testOTP = this.generateOTP();
    console.log(`🧪 اختبار إرسال OTP للإيميل: ${testEmail}`);
    console.log(`🔢 رمز OTP للاختبار: ${testOTP}`);
    
    try {
      const result = await this.sendOTPEmail(testEmail, 'مستخدم تجريبي', testOTP);
      console.log('✅ نجح اختبار إرسال OTP');
      return { success: true, otp: testOTP, result };
    } catch (error) {
      console.error('❌ فشل اختبار إرسال OTP:', error.message);
      return { success: false, otp: testOTP, error: error.message };
    }
  }

  /**
   * طباعة معلومات تشخيص البريد الإلكتروني
   */
  printEmailDiagnostics() {
    console.log("=".repeat(60));
    console.log("📊 تشخيص خدمة البريد الإلكتروني");
    console.log("=".repeat(60));
    console.log(`🏢 خادم SMTP: ${this.transporter.options.host}:${this.transporter.options.port}`);
    console.log(`👤 مستخدم SMTP: ${this.transporter.options.auth?.user || 'غير محدد'}`);
    console.log(`📧 البريد المرسل: ${this.senderEmail} (${this.senderName})`);
    console.log(`🔄 عدد محاولات إعادة الإرسال: ${this.maxRetries}`);
    console.log(`⏱️ تأخير إعادة المحاولة: ${this.retryDelay}ms`);
    console.log(`📨 عدد الرسائل المسجلة: ${this.emailLog.length}`);
    
    if (this.emailLog.length > 0) {
      const successCount = this.emailLog.filter(log => log.success).length;
      const failureCount = this.emailLog.length - successCount;
      console.log(`✅ الرسائل الناجحة: ${successCount}`);
      console.log(`❌ الرسائل الفاشلة: ${failureCount}`);
      
      // آخر 3 رسائل
      console.log("\n📋 آخر 3 رسائل:");
      this.emailLog.slice(-3).forEach((log, index) => {
        const status = log.success ? '✅' : '❌';
        console.log(`  ${index + 1}. ${status} ${log.type} إلى ${log.recipient} في ${log.timestamp.toLocaleString('ar-EG')}`);
        if (!log.success && log.error) {
          console.log(`     خطأ: ${log.error}`);
        }
      });
    }
    console.log("=".repeat(60));
  }
}

export const emailService = new EmailService();