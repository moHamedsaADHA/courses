import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import { emailService } from "../../services/email.service.js";
import jwt from "jsonwebtoken";
import { Code } from "../../models/code.js";

export const registerUserHandler = async (req, res, next) => {
  try {
    // طباعة تشخيص خدمة البريد الإلكتروني
    emailService.printEmailDiagnostics();
    
    // التحقق من وجود الكود مسبقاً
    const existingUser = await User.findOne({ code: req.body.code });
    if (existingUser) {
      return res.status(400).json({ 
        message: "الكود مستخدم مسبقاً" 
      });
    }

    // التحقق من البريد الإلكتروني إذا تم إرساله
    if (req.body.email) {
      const existingEmailUser = await User.findOne({ email: req.body.email });
      if (existingEmailUser) {
        return res.status(400).json({ 
          message: "البريد الإلكتروني مستخدم مسبقاً" 
        });
      }
    }

    // إنشاء OTP ووقت انتهاء الصلاحية
    const otp = emailService.generateOTP();
    const otpExpires = emailService.getOTPExpiry();

    // طباعة OTP في التيرمينال للتطوير والاختبار
    console.log("=".repeat(50));
    console.log(`📧 تم إنشاء OTP جديد للمستخدم: ${req.body.name}`);
    console.log(`📱 رقم OTP: ${otp}`);
    console.log(`⏰ انتهاء الصلاحية: ${otpExpires.toLocaleString('ar-EG')}`);
    console.log(`📨 الإيميل المستهدف: ${req.body.email}`);
    console.log("=".repeat(50));

    // تحقق من الكود إذا كان الدور معلم أو أدمن أو طالب
    let usedCode = null;
    if (["admin", "instructor", "student"].includes(req.body.role || "student")) {
      if (!req.body.code) {
        return res.status(400).json({ message: "يرجى إدخال كود التسجيل الصحيح" });
      }
      usedCode = await Code.findOne({ code: req.body.code, role: req.body.role || "student", used: false });
      if (!usedCode) {
        return res.status(400).json({ message: "كود التسجيل غير صحيح أو مستخدم بالفعل" });
      }
    }

    // إنشاء المستخدم مع OTP
    const user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email || null,
      location: req.body.location,
      grade: req.body.grade,
      role: req.body.role || "student",
      phone: req.body.phone,
      code: usedCode.code, // استخدام الكود من الداتابيس
      otp: otp,
      otpExpires: otpExpires,
      isVerified: true // الحساب مفعل تلقائياً عند استخدام كود صحيح
    });

    // إذا كان هناك كود، حدثه ليصبح مستخدم واربطه بالمستخدم
    if (usedCode) {
      usedCode.used = true;
      usedCode.usedBy = user._id;
      await usedCode.save();
    }

    // التحقق من حالة الاتصال بخدمة البريد أولاً
    console.log("🔍 فحص الاتصال بخدمة البريد الإلكتروني...");
    const connectionStatus = await emailService.verifyConnection();
    console.log(`📡 حالة الاتصال: ${connectionStatus.connected ? '✅ متصل' : '❌ غير متصل'}`);
    if (!connectionStatus.connected) {
      console.warn(`⚠️ تفاصيل الخطأ: ${connectionStatus.error}`);
    }

    // إرسال OTP عبر البريد الإلكتروني (إذا كان البريد متوفر)
    // تم تخطي إرسال OTP لأن الحساب أصبح مفعل تلقائياً
    let emailSent = false;
    let emailError = null;
    
    console.log("✅ تم تفعيل الحساب تلقائياً باستخدام الكود الصحيح، لا حاجة لإرسال OTP");

    // إنشاء توكن نهائي (الحساب مفعل بالفعل)
    const { jwtService } = await import('../../services/jwt.service.js');
    
    const tokens = jwtService.generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
      grade: user.grade,
      courseId: user.courseId,
      isVerified: user.isVerified
    });

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.otp; // لا نرسل OTP في الاستجابة

    const message = "تم إنشاء الحساب وتفعيله بنجاح! يمكنك تسجيل الدخول الآن.";

    // طباعة ملخص العملية في التيرمينال
    console.log("📊 ملخص عملية التسجيل:");
    console.log(`👤 المستخدم: ${user.name} (${user.email || 'بدون بريد إلكتروني'})`);
    console.log(`🔑 الكود: ${user.code}`);
    console.log(`✅ حالة التفعيل: مفعل تلقائياً`);
    console.log("=".repeat(50));

    res.status(201).json({ 
      success: true,
      message,
      user: userObj, 
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: tokens.tokenType
      },
      // للتوافق مع الكود القديم
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      requiresVerification: false,
      isVerified: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء التسجيل", 
      error: error.message 
    });
  }
};
