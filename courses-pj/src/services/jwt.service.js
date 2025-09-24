import jwt from 'jsonwebtoken';
import { environment } from '../config/server.config.js';

class JWTService {
  constructor() {
    this.accessTokenSecret = environment.JWT_SECRET;
    this.refreshTokenSecret = environment.JWT_REFRESH_SECRET || environment.JWT_SECRET + '_refresh';
  this.accessTokenExpiry = '7d'; // Access token صالح لمدة أسبوع
    this.refreshTokenExpiry = '7d'; // Refresh token طويل المدى
  }

  /**
   * إنشاء Access Token و Refresh Token
   */
  generateTokens(payload) {
    try {
      // Access Token - قصير المدى (15 دقيقة)
      const accessToken = jwt.sign(
        {
          ...payload,
          type: 'access'
        },
        this.accessTokenSecret,
        { 
          expiresIn: this.accessTokenExpiry,
          issuer: 'courses-platform',
          audience: 'courses-users'
        }
      );

      // Refresh Token - طويل المدى (7 أيام)
      const refreshToken = jwt.sign(
        {
          userId: payload.userId,
          type: 'refresh'
        },
        this.refreshTokenSecret,
        { 
          expiresIn: this.refreshTokenExpiry,
          issuer: 'courses-platform',
          audience: 'courses-users'
        }
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: this.accessTokenExpiry,
        tokenType: 'Bearer'
      };

    } catch (error) {
      console.error('❌ خطأ في إنشاء Tokens:', error.message);
      throw new Error('فشل في إنشاء Authentication Tokens');
    }
  }

  /**
   * التحقق من Access Token
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret);
      
      if (decoded.type !== 'access') {
        throw new Error('نوع Token غير صحيح');
      }

      return {
        valid: true,
        decoded,
        expired: false
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          decoded: null,
          expired: true,
          message: 'Access token منتهي الصلاحية'
        };
      }

      return {
        valid: false,
        decoded: null,
        expired: false,
        message: error.message || 'Access token غير صالح'
      };
    }
  }

  /**
   * التحقق من Refresh Token
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret);
      
      if (decoded.type !== 'refresh') {
        throw new Error('نوع Token غير صحيح');
      }

      return {
        valid: true,
        decoded,
        expired: false
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          decoded: null,
          expired: true,
          message: 'Refresh token منتهي الصلاحية'
        };
      }

      return {
        valid: false,
        decoded: null,
        expired: false,
        message: error.message || 'Refresh token غير صالح'
      };
    }
  }

  /**
   * تجديد Access Token باستخدام Refresh Token
   */
  async refreshAccessToken(refreshToken, getUserData) {
    try {
      // التحقق من Refresh Token
      const refreshResult = this.verifyRefreshToken(refreshToken);
      
      if (!refreshResult.valid) {
        throw new Error(refreshResult.message);
      }

      // جلب بيانات المستخدم المحدثة
      const userData = await getUserData(refreshResult.decoded.userId);
      
      if (!userData) {
        throw new Error('المستخدم غير موجود');
      }

      if (!userData.isVerified) {
        throw new Error('الحساب غير مُفعّل');
      }

      // إنشاء Access Token جديد
      const newAccessToken = jwt.sign(
        {
          userId: userData._id,
          email: userData.email,
          role: userData.role,
          isVerified: userData.isVerified,
          type: 'access'
        },
        this.accessTokenSecret,
        { 
          expiresIn: this.accessTokenExpiry,
          issuer: 'courses-platform',
          audience: 'courses-users'
        }
      );

      return {
        success: true,
        accessToken: newAccessToken,
        expiresIn: this.accessTokenExpiry,
        user: {
          id: userData._id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          grade: userData.grade
        }
      };

    } catch (error) {
      console.error('❌ خطأ في تجديد Access Token:', error.message);
      
      return {
        success: false,
        error: error.message,
        requiresLogin: true
      };
    }
  }

  /**
   * إنشاء Temporary Token للـ OTP
   */
  generateTemporaryToken(payload) {
    try {
      return jwt.sign(
        {
          ...payload,
          isTemporary: true,
          type: 'temp'
        },
        this.accessTokenSecret,
        { 
          expiresIn: '1h', // ساعة واحدة للتفعيل
          issuer: 'courses-platform',
          audience: 'courses-temp'
        }
      );

    } catch (error) {
      console.error('❌ خطأ في إنشاء Temporary Token:', error.message);
      throw new Error('فشل في إنشاء Temporary Token');
    }
  }

  /**
   * استخراج Token من Header
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }

  /**
   * إنشاء Reset Password Token
   */
  generateResetToken(payload) {
    return jwt.sign(
      { 
        ...payload, 
        type: 'reset'
      }, 
      this.accessTokenSecret, // استخدام نفس السر للبساطة
      { 
        expiresIn: '1h' // صالح لمدة ساعة واحدة فقط
      }
    );
  }

  /**
   * التحقق من Reset Password Token
   */
  verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret);
      
      if (decoded.type !== 'reset') {
        throw new Error('Invalid token type');
      }
      
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}

// تصدير instance واحد
export const jwtService = new JWTService();

// للاستخدام في باقي الملفات
export { JWTService };
