import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import { emailService } from "../../services/email.service.js";
import jwt from "jsonwebtoken";
import { Code } from "../../models/code.js";

export const registerUserHandler = async (req, res, next) => {
  try {
    // طباعة تشخيص خدمة البريد الإلكتروني
    emailService.printEmailDiagnostics();
    
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
    
      email: req.body.email,
      location: req.body.location,
      grade: req.body.grade,
      role: req.body.role || "student",
      phone: req.body.phone,
      code: req.body.code || undefined,
      otp: otp,
      otpExpires: otpExpires,
      isVerified: false
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

    // إرسال OTP عبر البريد الإلكتروني
    let emailSent = false;
    let emailError = null;
    
    console.log("📤 محاولة إرسال OTP عبر البريد الإلكتروني...");
    try {
      const emailResult = await emailService.sendOTPEmail(user.email, user.name, otp);
      emailSent = true;
      console.log(`✅ تم إرسال OTP بنجاح! Message ID: ${emailResult.messageId}`);
    } catch (error) {
      emailError = error;
      console.error('❌ فشل في إرسال OTP عبر البريد الإلكتروني:', error.message);
      console.error('📋 تفاصيل الخطأ:', error.stack);
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
      { expiresIn: "7d" } // توكن مؤقت صالح لمدة 7 أيام
    );

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.otp; // لا نرسل OTP في الاستجابة

    const message = emailSent 
      ? "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
      : "تم إنشاء الحساب بنجاح. لكن فشل في إرسال رمز التحقق. يمكنك طلب إرسال رمز جديد.";

    // طباعة ملخص العملية في التيرمينال
    console.log("📊 ملخص عملية التسجيل:");
    console.log(`👤 المستخدم: ${user.name} (${user.email})`);
    console.log(`📧 حالة الإيميل: ${emailSent ? '✅ تم الإرسال' : '❌ فشل الإرسال'}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏳ صالح حتى: ${otpExpires.toLocaleString('ar-EG')}`);
    if (emailError) {
      console.log(`❗ سبب فشل الإيميل: ${emailError.message}`);
    }
    console.log("=".repeat(50));

    res.status(201).json({ 
      message,
      user: userObj, 
      tempToken,
      requiresVerification: true,
      emailSent,
      emailError: emailError ? emailError.message : null,
      // في بيئة التطوير، أرسل OTP دائماً للاختبار
      otp: process.env.NODE_ENV === 'development' ? otp : (!emailSent ? otp : undefined),
      otpExpires: otpExpires.toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء التسجيل", 
      error: error.message 
    });
  }
};
