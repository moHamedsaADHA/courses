import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginUserHandler = async (req, res) => {
  try {
    const { code, password } = req.body;

    // البحث عن المستخدم بالكود
    const user = await User.findOne({ code });

    if (!user) {
      return res.status(401).json({ 
        message: "بيانات تسجيل الدخول غير صحيحة (الكود غير موجود)" 
      });
    }

    // التحقق من تفعيل الحساب
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "يجب تفعيل الحساب أولاً", 
        requiresVerification: true,
        userEmail: user.email
      });
    }

    // التحقق من كلمة المرور
    // تم تعطيل bcrypt بناءً على طلب العميل - مقارنة مباشرة
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    const isPasswordCorrect = password === user.password; // مقارنة مباشرة بدون تشفير

    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: "كلمة المرور غير صحيحة" 
      });
    }

    // إنشاء Access Token و Refresh Token
    const { jwtService } = await import('../../services/jwt.service.js');
    
    const tokens = jwtService.generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
      grade: user.grade,
      courseId: user.courseId,
      isVerified: user.isVerified
    });

    // للتوافق مع الكود القديم
    const token = tokens.accessToken;

    // إعداد بيانات المستخدم للإرسال (جميع البيانات)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      grade: user.grade,
      role: user.role,
      phone: user.phone || null,
      courseId: user.courseId || [],
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: {
        user: userResponse,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
          tokenType: tokens.tokenType
        }
      },
      // للتوافق مع الكود القديم
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء تسجيل الدخول", 
      error: error.message 
    });
  }
};
