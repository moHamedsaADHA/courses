import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { environment } from "../config/server.config.js";

// Middleware للتحقق من تفعيل الحساب
export const requireVerification = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: "لا يوجد رمز مصادقة"
      });
    }

    const decoded = jwt.verify(token, environment.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "المستخدم غير موجود"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "يجب تفعيل الحساب أولاً",
        requiresVerification: true,
        userEmail: user.email
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "رمز المصادقة غير صالح"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "انتهت صلاحية رمز المصادقة"
      });
    }

    console.error('Verification middleware error:', error);
    res.status(500).json({
      message: "خطأ في التحقق من المصادقة"
    });
  }
};