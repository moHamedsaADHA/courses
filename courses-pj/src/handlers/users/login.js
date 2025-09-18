import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم بالبريد الإلكتروني فقط
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        message: "بيانات تسجيل الدخول غير صحيحة (البريد الإلكتروني غير موجود)" 
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
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: "كلمة المرور غير صحيحة" 
      });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        grade: user.grade,
        courseId: user.courseId,
        isVerified: user.isVerified
      },
      environment.JWT_SECRET,
      { expiresIn: environment.JWT_EXPIRES_IN }
    );

    // إعداد بيانات المستخدم للإرسال
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      grade: user.grade,
      role: user.role,
      phone: user.phone,
      courseId: user.courseId,
      isVerified: user.isVerified
    };

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: userResponse,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء تسجيل الدخول", 
      error: error.message 
    });
  }
};
