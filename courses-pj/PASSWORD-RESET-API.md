# 🔐 Password Reset & Refresh Token API Documentation

## Overview
This documentation covers the password reset and refresh token functionality for the Courses Platform API.

### Base URL
- **Production:** `https://courses-nine-eta.vercel.app/api`
- **Local Development:** `http://localhost:3000/api`

---

## 🔄 Refresh Token Endpoint

### `POST /auth/refresh-token`

**Description:** Generates a new access token using a valid refresh token.

### Request Format
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Frontend Implementation
```javascript
// JavaScript/React Example
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Update access token
      localStorage.setItem('accessToken', data.data.accessToken);
      
      // Optionally update refresh token if provided
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      
      console.log('Token refreshed successfully!');
      return data.data.accessToken;
    } else {
      // Refresh token expired, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Handle error - likely redirect to login
  }
};

// Automatic token refresh on 401 errors
const apiCall = async (url, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    accessToken = await refreshAccessToken();
    
    if (accessToken) {
      // Retry the original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
  }
  
  return response;
};
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم تجديد الـ Access Token بنجاح",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

#### Error Responses

**400 - Missing Refresh Token**
```json
{
  "success": false,
  "message": "الـ Refresh Token مطلوب"
}
```

**401 - Invalid/Expired Refresh Token**
```json
{
  "success": false,
  "message": "الـ Refresh Token غير صالح أو منتهي الصلاحية"
}
```

**404 - User Not Found**
```json
{
  "success": false,
  "message": "المستخدم غير موجود"
}
```

---

## 🔓 Forgot Password Endpoints

### 1. `POST /auth/forgot-password`

**Description:** Initiates password reset process by sending a reset email with token.

### Request Format
```json
{
  "email": "user@example.com"
}
```

### Frontend Implementation
```javascript
// JavaScript/React Example
const forgotPassword = async (email) => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      // Redirect to "check email" page
      window.location.href = '/check-email';
    } else {
      alert(data.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ في الشبكة، يرجى المحاولة مرة أخرى');
  }
};

// HTML Form
const handleForgotPassword = (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  forgotPassword(email);
};
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

#### Error Responses

**400 - Missing Email**
```json
{
  "success": false,
  "message": "البريد الإلكتروني مطلوب"
}
```

**404 - Email Not Found**
```json
{
  "success": false,
  "message": "البريد الإلكتروني غير مسجل في النظام"
}
```

**500 - Email Send Failed**
```json
{
  "success": false,
  "message": "فشل في إرسال البريد الإلكتروني، يرجى المحاولة مرة أخرى"
}
```

---

### 2. `POST /auth/reset-password`

**Description:** Resets password using the token received via email.

### Request Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

### Frontend Implementation
```javascript
// JavaScript/React Example
const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      alert('كلمة المرور يجب أن تكون أطول من 6 أحرف');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('تم تغيير كلمة المرور بنجاح');
      // Redirect to login page
      window.location.href = '/login';
    } else {
      alert(data.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ في الشبكة، يرجى المحاولة مرة أخرى');
  }
};

// Get token from URL parameters
const getTokenFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};

// HTML Form Handler
const handleResetPassword = (e) => {
  e.preventDefault();
  const token = getTokenFromURL(); // or from hidden input
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  resetPassword(token, newPassword, confirmPassword);
};
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

#### Error Responses

**400 - Missing Fields**
```json
{
  "success": false,
  "message": "جميع الحقول مطلوبة"
}
```

**400 - Password Mismatch**
```json
{
  "success": false,
  "message": "كلمات المرور غير متطابقة"
}
```

**400 - Weak Password**
```json
{
  "success": false,
  "message": "كلمة المرور يجب أن تكون أطول من 6 أحرف"
}
```

**401 - Invalid Token**
```json
{
  "success": false,
  "message": "الرمز غير صالح أو منتهي الصلاحية"
}
```

**404 - User Not Found**
```json
{
  "success": false,
  "message": "المستخدم غير موجود"
}
```

---

## 📧 Email Reset Link Format

When a user requests password reset, they receive an email with:

### Reset Link Structure
```
http://localhost:5173//reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Email Content
- **Subject:** إعادة تعيين كلمة المرور - منصة الكورسات
- **Content:** Styled HTML email with reset button and manual token
- **Expiry:** 1 hour from generation time

---

## 🔧 Integration Examples

### Complete Authentication Flow
```javascript
// auth.js - Complete authentication service

class AuthService {
  constructor() {
    this.baseURL = 'https://courses-nine-eta.vercel.app/api';
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Login
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      this.accessToken = data.data.accessToken;
      this.refreshToken = data.data.refreshToken;
      
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    }
    
    return data;
  }

  // Refresh Token
  async refreshAccessToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });
    
    const data = await response.json();
    
    if (data.success) {
      this.accessToken = data.data.accessToken;
      localStorage.setItem('accessToken', this.accessToken);
    } else {
      this.logout();
    }
    
    return data;
  }

  // Forgot Password
  async forgotPassword(email) {
    const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    return await response.json();
  }

  // Reset Password
  async resetPassword(token, newPassword, confirmPassword) {
    const response = await fetch(`${this.baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
    
    return await response.json();
  }

  // Authenticated API Call
  async apiCall(endpoint, options = {}) {
    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
    
    // Handle token expiry
    if (response.status === 401) {
      const refreshResult = await this.refreshAccessToken();
      
      if (refreshResult.success) {
        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });
      }
    }
    
    return response;
  }

  // Logout
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}

// Usage
const auth = new AuthService();
export default auth;
```

---

## ⚠️ Security Notes

### Token Expiry Times
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days
- **Reset Token:** 1 hour

### Security Best Practices
1. **Store tokens securely** - Use httpOnly cookies in production
2. **HTTPS only** - Never send tokens over HTTP
3. **Validate on frontend** - Check password strength before sending
4. **Rate limiting** - Implement on password reset endpoints
5. **Log security events** - Monitor failed attempts

### Environment Variables Required
```env
# JWT Secrets
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_RESET_SECRET=your-reset-secret-key

# Email Configuration
EMAILTEST=your-email@gmail.com
APIKE=your-app-password
```

---

## 🧪 Testing

### Manual Testing Steps

1. **Test Forgot Password:**
   ```bash
   curl -X POST https://courses-nine-eta.vercel.app/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

2. **Test Reset Password:**
   ```bash
   curl -X POST https://courses-nine-eta.vercel.app/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "your-reset-token", "newPassword": "newpass123", "confirmPassword": "newpass123"}'
   ```

3. **Test Refresh Token:**
   ```bash
   curl -X POST https://courses-nine-eta.vercel.app/api/auth/refresh-token \
     -H "Content-Type: application/json" \
     -d '{"refreshToken": "your-refresh-token"}'
   ```

---

## 📱 Frontend Integration Checklist

### Required Pages/Components:
- [ ] Forgot Password Form
- [ ] Check Email Page (after forgot password)
- [ ] Reset Password Form (with token validation)
- [ ] Login Form (with "Forgot Password?" link)
- [ ] Token Refresh Logic
- [ ] Automatic logout on refresh failure

### Required State Management:
- [ ] Access Token storage
- [ ] Refresh Token storage
- [ ] User authentication state
- [ ] Loading states for async operations
- [ ] Error handling for failed requests

### Required UI Features:
- [ ] Password strength indicator
- [ ] Email validation
- [ ] Token expiry notifications
- [ ] Success/error messages
- [ ] Automatic redirects

---

**🎯 Quick Start:**
1. Use the forgot password endpoint to send reset email
2. Check email and click reset link (or copy token)
3. Use reset password endpoint with token
4. Implement refresh token logic for seamless authentication
5. Handle token expiry gracefully in your frontend

**📞 Support:** For additional questions, refer to the main API documentation or contact the development team.