// خدمة بريد مؤقتة تحاكي إرسال OTP للتطوير
import { environment } from "../config/server.config.js";

class MockEmailService {
  constructor() {
    this.sentEmails = new Map(); // تخزين الإيميلات المرسلة
  }

  /**
   * محاكاة إرسال OTP (للتطوير)
   */
  async sendOTPEmail(userEmail, userName, otp) {
    try {
      console.log('📧 محاكاة إرسال OTP...');
      console.log(`   إلى: ${userEmail}`);
      console.log(`   الاسم: ${userName}`);
      console.log(`   OTP: ${otp}`);
      
      // حفظ OTP في الذاكرة للاختبار
      this.sentEmails.set(userEmail, {
        otp,
        userName,
        sentAt: new Date(),
        messageId: `mock-${Date.now()}`
      });
      
      console.log('✅ تم "إرسال" OTP بنجاح (محاكاة)!');
      
      return {
        success: true,
        messageId: `mock-${Date.now()}`,
        message: 'تم إرسال رمز التحقق بنجاح',
        note: 'هذه محاكاة - لا يتم إرسال إيميل فعلي'
      };
      
    } catch (error) {
      console.error('❌ خطأ في محاكاة الإرسال:', error.message);
      return {
        success: false,
        error: 'خطأ في محاكاة البريد الإلكتروني'
      };
    }
  }

  /**
   * الحصول على آخر OTP مرسل (للاختبار)
   */
  getLastOTP(userEmail) {
    return this.sentEmails.get(userEmail);
  }

  /**
   * طباعة جميع الإيميلات المرسلة
   */
  printSentEmails() {
    console.log('\n📧 الإيميلات المرسلة:');
    console.log('====================');
    
    if (this.sentEmails.size === 0) {
      console.log('لا توجد إيميلات مرسلة');
      return;
    }
    
    this.sentEmails.forEach((data, email) => {
      console.log(`📧 ${email}`);
      console.log(`   👤 الاسم: ${data.userName}`);
      console.log(`   🔢 OTP: ${data.otp}`);
      console.log(`   📅 الوقت: ${data.sentAt.toLocaleString('ar-EG')}`);
      console.log('');
    });
  }

  /**
   * اختبار "الاتصال" (دائماً ناجح)
   */
  async testConnection() {
    console.log('✅ خدمة البريد المؤقتة جاهزة (محاكاة)');
    return true;
  }
}

// إنشاء خدمة البريد المؤقتة
export const mockEmailService = new MockEmailService();

// تصدير للاستخدام
export const emailService = mockEmailService;