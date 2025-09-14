import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";

export const verifyOTPHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!email || !otp) {
      return res.status(400).json({
        message: "البريد الإلكتروني ورمز التحقق مطلوبان"
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "المستخدم غير موجود"
      });
    }

    // التحقق من أن الحساب غير مفعل مسبقاً
    if (user.isVerified) {
      return res.status(400).json({
        message: "الحساب مفعل مسبقاً"
      });
    }

    // التحقق من وجود OTP
    if (!user.otp) {
      return res.status(400).json({
        message: "لا يوجد رمز تحقق صالح لهذا الحساب"
      });
    }

    // التحقق من انتهاء صلاحية OTP
    if (user.otpExpires && user.otpExpires < new Date()) {
      // حذف OTP المنتهي الصلاحية
      await User.findByIdAndUpdate(user._id, {
        $unset: { otp: 1, otpExpires: 1 }
      });
      
      return res.status(400).json({
        message: "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد"
      });
    }

    // التحقق من صحة OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "رمز التحقق غير صحيح"
      });
    }

    // تفعيل الحساب وحذف OTP
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        $unset: { otp: 1, otpExpires: 1 }
      },
      { new: true }
    );

    // إنشاء توكن دائم بعد التفعيل
    const token = jwt.sign(
      {
        userId: updatedUser._id,
        role: updatedUser.role,
        courseId: updatedUser.courseId,
        isVerified: true
      },
      environment.JWT_SECRET,
      { expiresIn: environment.JWT_EXPIRES_IN }
    );

    const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    delete userObj.password;

    res.status(200).json({
      message: "تم تفعيل الحساب بنجاح",
      user: userObj,
      token,
      isVerified: true
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      message: "حدث خطأ أثناء التحقق من الرمز",
      error: error.message
    });
  }
};

// إعادة إرسال OTP
export const resendOTPHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "البريد الإلكتروني مطلوب"
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "المستخدم غير موجود"
      });
    }

    // التحقق من أن الحساب غير مفعل
    if (user.isVerified) {
      return res.status(400).json({
        message: "الحساب مفعل مسبقاً"
      });
    }

    // إنشاء OTP جديد
    const { emailService } = await import("../../services/email.service.js");
    const otp = emailService.generateOTP();
    const otpExpires = emailService.getOTPExpiry();

    // تحديث OTP في قاعدة البيانات
    await User.findByIdAndUpdate(user._id, {
      otp: otp,
      otpExpires: otpExpires
    });

    // إرسال OTP الجديد عبر البريد الإلكتروني
    try {
      await emailService.sendOTPEmail(user.email, user.name, otp);
      
      res.status(200).json({
        message: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني"
      });
      
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      res.status(500).json({
        message: "فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى"
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      message: "حدث خطأ أثناء إعادة إرسال الرمز",
      error: error.message
    });
  }
};