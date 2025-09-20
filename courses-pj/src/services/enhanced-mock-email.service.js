// تحسين Mock Service مع حفظ OTP في قاعدة البيانات
import mongoose from 'mongoose';

// إنشاء نموذج OTP للحفظ والاستعلام
const otpLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, default: 'registration' },
  sentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

const OTPLog = mongoose.model('OTPLog', otpLogSchema);

export class EnhancedMockEmailService {
  
  constructor() {
    console.log('📧 Enhanced Mock Email Service مُفعّل');
  }

  async sendOTPEmail(email, otp, firstName = 'المستخدم') {
    try {
      // حفظ OTP في قاعدة البيانات
      const otpLog = new OTPLog({
        email,
        otp,
        purpose: 'registration',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 دقيقة
      });
      
      await otpLog.save();
      
      // طباعة OTP للتطوير
      console.log('\n🎯 ================================');
      console.log('📧 OTP محفوظ في قاعدة البيانات');
      console.log('🎯 ================================');
      console.log(`👤 الاسم: ${firstName}`);
      console.log(`📧 الإيميل: ${email}`);
      console.log(`🔢 كود OTP: ${otp}`);
      console.log(`⏰ ينتهي في: ${otpLog.expiresAt.toLocaleString('ar-EG')}`);
      console.log(`🆔 Log ID: ${otpLog._id}`);
      console.log('🎯 ================================\n');
      
      return {
        success: true,
        messageId: `mock-${otpLog._id}`,
        message: 'تم حفظ OTP بنجاح (محاكاة)',
        otp: otp, // للتطوير فقط
        logId: otpLog._id
      };
      
    } catch (error) {
      console.error('❌ خطأ في حفظ OTP:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // دالة للحصول على آخر OTP لإيميل معين
  async getLastOTP(email) {
    try {
      const lastOTP = await OTPLog.findOne({ 
        email, 
        used: false,
        expiresAt: { $gt: new Date() }
      }).sort({ sentAt: -1 });
      
      if (lastOTP) {
        console.log(`📧 آخر OTP لـ ${email}: ${lastOTP.otp}`);
        return lastOTP;
      } else {
        console.log(`❌ لا يوجد OTP صالح لـ ${email}`);
        return null;
      }
    } catch (error) {
      console.error('❌ خطأ في البحث عن OTP:', error.message);
      return null;
    }
  }

  // دالة لعرض جميع OTP المُرسلة
  async getAllOTPs() {
    try {
      const otps = await OTPLog.find()
        .sort({ sentAt: -1 })
        .limit(10);
      
      console.log('\n📋 آخر 10 OTP مُرسلة:');
      console.log('====================');
      otps.forEach((otp, index) => {
        const status = otp.used ? '✅ مُستخدم' : otp.expiresAt > new Date() ? '⏰ صالح' : '❌ منتهي';
        console.log(`${index + 1}. ${otp.email} → ${otp.otp} (${status})`);
      });
      
      return otps;
    } catch (error) {
      console.error('❌ خطأ في عرض OTPs:', error.message);
      return [];
    }
  }
}

export const enhancedMockEmailService = new EnhancedMockEmailService();