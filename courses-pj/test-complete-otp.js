import http from 'http';

// وظائف مساعدة للاختبار
const makeRequest = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// بيانات المستخدم للاختبار
const testUser = {
  name: 'أحمد محمد علي حسن',
  email: 'moHamedsaADHA@gmail.com',
  password: 'Password123',
  location: 'بغداد',
  grade: 'الصف الأول الإعدادي'
};

console.log('🚀 بدء اختبار نظام OTP الكامل...\n');

async function testCompleteOTPSystem() {
  try {
    // 1. اختبار التسجيل مع إرسال OTP
    console.log('📝 1. اختبار التسجيل مع إرسال OTP...');
    
    const registerOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const registerResponse = await makeRequest(registerOptions, testUser);
    console.log('Status:', registerResponse.status);
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));

    if (registerResponse.status === 201 && registerResponse.data.success) {
      console.log('✅ التسجيل تم بنجاح!');
      console.log('📧 حالة البريد:', registerResponse.data.emailSent ? 'تم الإرسال' : 'فشل الإرسال');
      
      if (registerResponse.data.otpForTesting) {
        console.log('🔢 OTP للاختبار:', registerResponse.data.otpForTesting);
        
        // 2. اختبار تفعيل OTP
        console.log('\n🔓 2. اختبار تفعيل OTP...');
        
        const verifyOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/users/verify-otp',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        };

        const verifyData = {
          email: testUser.email,
          otp: registerResponse.data.otpForTesting
        };

        const verifyResponse = await makeRequest(verifyOptions, verifyData);
        console.log('Status:', verifyResponse.status);
        console.log('Response:', JSON.stringify(verifyResponse.data, null, 2));

        if (verifyResponse.status === 200 && verifyResponse.data.success) {
          console.log('✅ تم تفعيل الحساب بنجاح!');
          console.log('🔑 الرمز الدائم:', verifyResponse.data.token ? 'متاح' : 'غير متاح');
          
          // 3. اختبار تسجيل الدخول
          console.log('\n🔐 3. اختبار تسجيل الدخول...');
          
          const loginOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/users/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          };

          const loginData = {
            email: testUser.email,
            password: testUser.password,
            grade: testUser.grade
          };

          const loginResponse = await makeRequest(loginOptions, loginData);
          console.log('Status:', loginResponse.status);
          console.log('Response:', JSON.stringify(loginResponse.data, null, 2));

          if (loginResponse.status === 200 && loginResponse.data.success) {
            console.log('✅ تسجيل الدخول تم بنجاح!');
            console.log('👤 المستخدم:', loginResponse.data.user?.name);
            console.log('🎯 الدور:', loginResponse.data.user?.role);
          } else {
            console.log('❌ فشل تسجيل الدخول');
          }

        } else {
          console.log('❌ فشل تفعيل OTP');
        }

      } else {
        console.log('⚠️  لم يتم إرجاع OTP للاختبار');
      }

    } else if (registerResponse.status === 400 && registerResponse.data.message?.includes('مستخدم مسبقاً')) {
      console.log('ℹ️  المستخدم موجود مسبقاً');
      
      // اختبار إعادة إرسال OTP
      console.log('\n📨 اختبار إعادة إرسال OTP...');
      
      const resendOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/resend-otp',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      const resendData = { email: testUser.email };
      const resendResponse = await makeRequest(resendOptions, resendData);
      
      console.log('Status:', resendResponse.status);
      console.log('Response:', JSON.stringify(resendResponse.data, null, 2));

      if (resendResponse.status === 200 && resendResponse.data.success) {
        console.log('✅ تم إعادة إرسال OTP بنجاح!');
      } else {
        console.log('❌ فشل إعادة إرسال OTP');
      }

    } else {
      console.log('❌ فشل التسجيل');
    }

    // 4. اختبار إعادة تعيين كلمة المرور
    console.log('\n🔄 4. اختبار طلب إعادة تعيين كلمة المرور...');
    
    const resetOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/reset-password/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const resetData = { email: testUser.email };
    const resetResponse = await makeRequest(resetOptions, resetData);
    
    console.log('Status:', resetResponse.status);
    console.log('Response:', JSON.stringify(resetResponse.data, null, 2));

    if (resetResponse.status === 200) {
      console.log('✅ تم إرسال رابط إعادة التعيين!');
      console.log('📧 حالة البريد:', resetResponse.data.emailSent ? 'تم الإرسال' : 'فشل الإرسال');
    } else {
      console.log('❌ فشل إرسال رابط إعادة التعيين');
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// بدء الاختبارات
testCompleteOTPSystem().then(() => {
  console.log('\n🏁 انتهاء الاختبارات');
}).catch(console.error);