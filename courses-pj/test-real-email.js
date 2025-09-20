import { gmailEmailService } from './src/services/gmail-email.service.js';

console.log('🧪 اختبار إرسال OTP إلى إيميل حقيقي...\n');

async function testRealEmail() {
  try {
    console.log('📧 إرسال OTP إلى إيميلك الشخصي...');
    
    const result = await gmailEmailService.sendOTPEmail(
      'amedmohmed925@gmail.com', // إيميلك
      'أحمد محمد', 
      '123456'
    );
    
    if (result.success) {
      console.log('🎉 ممتاز! تم إرسال OTP بنجاح!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log('📬 تحقق من صندوق البريد أو spam folder');
    } else {
      console.log('❌ فشل الإرسال:', result.error);
      
      if (result.code === 'EAUTH') {
        console.log('\n🔧 مشكلة في App Password:');
        console.log('1. تأكد إن 2-Step Verification مُفعّل');
        console.log('2. اعمل App Password جديد');
        console.log('3. تأكد إنك نسخت ال 16 حرف صح');
        console.log('4. جرّب بدون مسافات: abcdefghijklmnop');
      }
    }

  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

testRealEmail();