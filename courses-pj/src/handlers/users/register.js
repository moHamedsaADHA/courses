import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import { emailService } from "../../services/email.service.js";
import jwt from "jsonwebtoken";

export const registerUserHandler = async (req, res, next) => {
  try {
    // التحقق من وجود البريد الإلكتروني مسبقاً
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "البريد الإلكتروني مستخدم مسبقاً" 
      });
    }

    // إنشاء OTP ووقت انتهاء الصلاحية
    const otp = emailService.generateOTP();
    const otpExpires = emailService.getOTPExpiry();

    // إنشاء المستخدم مع OTP
    const user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      location: req.body.location,
      grade: req.body.grade,
      role: req.body.role || "student",
      phone: req.body.phone,
      otp: otp,
      otpExpires: otpExpires,
      isVerified: false
    });

    // إرسال OTP عبر البريد الإلكتروني (اختياري)
    let emailSent = false;
    try {
      await emailService.sendOTPEmail(user.email, user.name, otp);
      emailSent = true;
    } catch (emailError) {
      console.warn('Warning: Could not send OTP email:', emailError);
      // استمرار العملية حتى لو فشل إرسال البريد
    }

    // إنشاء توكن مؤقت (سيتم تحديثه بعد التفعيل)
    const tempToken = jwt.sign(
      {
        userId: user._id,
        isTemporary: true,
        isVerified: false
      },
      environment.JWT_SECRET,
      { expiresIn: "1h" } // توكن مؤقت لساعة واحدة
    );

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.otp; // لا نرسل OTP في الاستجابة

    const message = emailSent 
      ? "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
      : "تم إنشاء الحساب بنجاح. لكن فشل في إرسال رمز التحقق. يمكنك طلب إرسال رمز جديد.";

    res.status(201).json({ 
      message,
      user: userObj, 
      tempToken,
      requiresVerification: true,
      emailSent,
      otp: !emailSent ? otp : undefined // أرسل OTP فقط إذا فشل إرسال البريد للاختبار
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء التسجيل", 
      error: error.message 
    });
  }
};
