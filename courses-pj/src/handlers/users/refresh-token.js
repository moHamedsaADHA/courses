import { User } from '../../models/user.js';
import { jwtService } from '../../services/jwt.service.js';

export const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token مطلوب",
        error: "REFRESH_TOKEN_MISSING"
      });
    }

    console.log('🔄 طلب تجديد Access Token...');

    // دالة لجلب بيانات المستخدم
    const getUserData = async (userId) => {
      try {
        const user = await User.findById(userId).select('-password');
        return user;
      } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error.message);
        return null;
      }
    };

    // تجديد Access Token
    const result = await jwtService.refreshAccessToken(refreshToken, getUserData);

    if (!result.success) {
      return res.status(401).json({
        message: result.error,
        error: "REFRESH_TOKEN_INVALID",
        requiresLogin: result.requiresLogin
      });
    }

    console.log('✅ تم تجديد Access Token بنجاح');

    res.status(200).json({
      message: "تم تجديد الجلسة بنجاح",
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      tokenType: "Bearer",
      user: result.user,
      // للتوافق مع الكود القديم
      token: result.accessToken
    });

  } catch (error) {
    console.error('❌ خطأ في تجديد Token:', error.message);
    
    res.status(500).json({
      message: "حدث خطأ أثناء تجديد الجلسة",
      error: error.message,
      requiresLogin: true
    });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    // في المستقبل يمكن إضافة blacklist للـ refresh tokens
    console.log('🚪 طلب تسجيل خروج');

    res.status(200).json({
      message: "تم تسجيل الخروج بنجاح"
    });

  } catch (error) {
    console.error('❌ خطأ في تسجيل الخروج:', error.message);
    
    res.status(500).json({
      message: "حدث خطأ أثناء تسجيل الخروج",
      error: error.message
    });
  }
};