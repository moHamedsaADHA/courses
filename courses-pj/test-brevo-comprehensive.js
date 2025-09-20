import fetch from 'node-fetch';

console.log('🔍 فحص شامل لحالة Brevo API Key...\n');

const API_KEY = 'xsmtpsib-a073e6bde557288e6b895f157e1283204b435e5ecb0b27f150516ae030d70e4b-UgfDVPKM28BnpGxv';

async function checkBrevoComprehensive() {
  try {
    console.log('1️⃣ اختبار صحة API Key...');
    
    // اختبار Account Info
    const accountResponse = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 حالة Account API: ${accountResponse.status} ${accountResponse.statusText}`);
    
    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('✅ API Key صحيح!');
      console.log('📋 بيانات الحساب:');
      console.log(`   📧 الإيميل: ${accountData.email}`);
      console.log(`   🏢 الشركة: ${accountData.companyName || 'غير محدد'}`);
      console.log(`   📊 نوع الحساب: ${accountData.plan?.type || 'Free'}`);
      
      // اختبار حدود الإرسال
      console.log('\n2️⃣ فحص حدود الإرسال...');
      
      const limitsResponse = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: {
          'api-key': API_KEY
        }
      });

      if (limitsResponse.ok) {
        const limitsData = await limitsResponse.json();
        console.log('📈 حدود الإرسال:');
        console.log(`   📧 إيميلات متاحة اليوم: ${limitsData.plan?.emailsPerDay || 'غير محدود'}`);
        console.log(`   📊 إيميلات مُرسلة: ${limitsData.statistics?.emailsSent || 0}`);
      }
      
      // اختبار إرسال بسيط
      console.log('\n3️⃣ اختبار إرسال بريد تجريبي...');
      
      const testEmailData = {
        sender: {
          name: "منصة الكورسات - اختبار",
          email: "86f72b002@smtp-brevo.com"
        },
        to: [{
          email: "86f72b002@smtp-brevo.com", // إرسال للمرسل نفسه للاختبار
          name: "اختبار منصة الكورسات"
        }],
        subject: "[اختبار] تأكيد عمل Brevo API",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
            <h2 style="color: #4CAF50;">✅ اختبار ناجح لـ Brevo API</h2>
            <p>هذا البريد يؤكد أن Brevo API يعمل بشكل صحيح.</p>
            <ul>
              <li><strong>الوقت:</strong> ${new Date().toLocaleString('ar-EG')}</li>
              <li><strong>API Key:</strong> يعمل بنجاح ✅</li>
              <li><strong>حالة الإرسال:</strong> نشط 🚀</li>
            </ul>
            <hr style="margin: 20px 0;">
            <p><small style="color: #666;">منصة الكورسات التعليمية</small></p>
          </div>
        `,
        textContent: `اختبار ناجح لـ Brevo API - الوقت: ${new Date().toLocaleString('ar-EG')}`
      };

      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testEmailData)
      });

      console.log(`📊 حالة إرسال البريد: ${emailResponse.status} ${emailResponse.statusText}`);
      
      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log('🎉 تم إرسال البريد التجريبي بنجاح!');
        console.log(`📧 Message ID: ${emailResult.messageId}`);
        console.log(`📬 تحقق من صندوق البريد: 86f72b002@smtp-brevo.com`);
        
        console.log('\n✅ Brevo API يعمل بشكل مثالي!');
        console.log('💡 يمكنك الآن تحديث الـ Email Service لاستخدام API بدلاً من SMTP');
        
      } else {
        const emailError = await emailResponse.json();
        console.log('❌ فشل إرسال البريد:');
        console.log(JSON.stringify(emailError, null, 2));
        
        // تحليل نوع الخطأ
        if (emailError.code === 'invalid_parameter') {
          console.log('\n💡 مشكلة في بيانات البريد:');
          console.log('- تأكد من صحة الإيميل المرسل');
          console.log('- تأكد من تفعيل الإيميل في Brevo');
        }
      }
      
    } else {
      const errorData = await accountResponse.json();
      console.log('❌ مشكلة في API Key:');
      console.log(JSON.stringify(errorData, null, 2));
      
      console.log('\n🔧 الحلول المقترحة:');
      console.log('1. اذهب إلى https://app.brevo.com');
      console.log('2. Settings → SMTP & API');
      console.log('3. Generate a new API key');
      console.log('4. تأكد من تحديد صلاحيات "Send emails"');
      console.log('5. انسخ المفتاح الجديد');
    }

  } catch (error) {
    console.error('❌ خطأ في الشبكة:', error.message);
    console.log('\n🔧 تحقق من:');
    console.log('- الاتصال بالإنترنت');
    console.log('- عدم حجب Brevo من الشبكة/Firewall');
  }
}

console.log('🎯 اختبار شامل لـ Brevo API');
console.log('=========================\n');

checkBrevoComprehensive();