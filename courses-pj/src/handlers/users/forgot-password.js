import { User } from "../../models/user.js";
import { emailService } from "../../services/email.service.js";
import { jwtService } from "../../services/jwt.service.js";
import bcrypt from "bcryptjs";

/**
 * طلب إعادة تعيين كلمة المرور
 */
export const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;

    // التحقق من وجود الإيميل
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مطلوب"
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    
    if (!user) {
      // عدم إظهار أن الحساب غير موجود لأسباب أمنية
      return res.status(200).json({
        success: true,
        message: "إذا كان هذا البريد الإلكتروني مسجل لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور"
      });
    }

    // إنشاء reset token (صالح لمدة ساعة واحدة)
    const resetToken = jwtService.generateResetToken({
      userId: user._id,
      email: user.email
    });

    // حفظ reset token في قاعدة البيانات (optional)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // ساعة واحدة
    await user.save();

    // إرسال البريد الإلكتروني
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    try {
      await emailService.sendResetPasswordEmail(
        user.email, 
        user.name || `${user.firstName} ${user.lastName}`, 
        resetLink,
        resetToken
      );

      console.log(`✅ Reset password email sent to: ${user.email}`);
      
      res.status(200).json({
        success: true,
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      });

    } catch (emailError) {
      console.error("❌ Failed to send reset email:", emailError.message);
      
      // في حالة فشل الإرسال، لا نفشل العملية كلها
      res.status(200).json({
        success: true,
        message: "حدثت مشكلة في إرسال البريد. يرجى المحاولة مرة أخرى أو التواصل مع الدعم",
        resetToken: resetToken // للتطوير فقط - احذف في الإنتاج
      });
    }

  } catch (error) {
    console.error("❌ Error in forgotPasswordHandler:", error.message);
    
    res.status(500).json({
      success: false,
      message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
    });
  }
};

/**
 * تأكيد إعادة تعيين كلمة المرور
 */
export const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // التحقق من البيانات المطلوبة
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "جميع البيانات مطلوبة"
      });
    }

    // التحقق من تطابق كلمات المرور
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "كلمات المرور غير متطابقة"
      });
    }

    // التحقق من قوة كلمة المرور
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل حرف صغير وكبير ورقم"
      });
    }

    // التحقق من صحة الـ reset token
    let decoded;
    try {
      decoded = jwtService.verifyResetToken(token);
    } catch (jwtError) {
      return res.status(400).json({
        success: false,
        message: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية"
      });
    }

    // البحث عن المستخدم
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود"
      });
    }

    // التحقق من أن الـ token لم يستخدم من قبل (optional)
    if (user.resetPasswordToken !== token) {
      return res.status(400).json({
        success: false,
        message: "رابط إعادة التعيين غير صالح"
      });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // تحديث كلمة المرور وحذف reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.updatedAt = new Date();
    
    await user.save();

    console.log(`✅ Password reset successful for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول"
    });

  } catch (error) {
    console.error("❌ Error in resetPasswordHandler:", error.message);
    
    res.status(500).json({
      success: false,
      message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
    });
  }
};