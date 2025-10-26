import mongoose from 'mongoose';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// استيراد النماذج
import { User } from './src/models/user.js';
import { Code } from './src/models/code.js';

// الاتصال بقاعدة البيانات
const DB_CONNECTION = process.env.DB_URL 

async function addVerifiedAdminAccount() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await mongoose.connect(DB_CONNECTION);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // التحقق من وجود حسابات أدمن
        console.log('🔍 التحقق من حسابات الأدمن الموجودة...');
        const existingAdmins = await User.find({ role: 'admin' });
        console.log(`📊 عدد حسابات الأدمن الموجودة: ${existingAdmins.length}`);

        if (existingAdmins.length > 0) {
            console.log('📋 حسابات الأدمن الموجودة:');
            existingAdmins.forEach((admin, index) => {
                console.log(`${index + 1}. ${admin.name} - كود: ${admin.code} - مُفعّل: ${admin.isVerified ? 'نعم' : 'لا'}`);
            });
        }

        // إنشاء حساب أدمن جديد محقق
        console.log('\n👤 إنشاء حساب أدمن جديد محقق...');
        
        // توليد كود أدمن فريد
        const adminCode = 'VERIFIED' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const adminPassword = 'admin' + Math.random().toString(36).substring(2, 8);
        
        // التأكد من أن الكود غير موجود
        const existingCode = await User.findOne({ code: adminCode });
        if (existingCode) {
            console.log('⚠️ الكود موجود، سيتم توليد كود جديد...');
            return addVerifiedAdminAccount(); // إعادة المحاولة
        }

        const verifiedAdmin = new User({
            name: 'أدمن محقق للمنصة',
            email: `verified.admin@platform.com`,
            code: adminCode,
            password: adminPassword, // سيتم تخزينها بدون تشفير
            role: 'admin',
            isVerified: true, // محقق مباشرة
            grade: 'الصف الأول الثانوي',
            location: 'مصر - الإدارة'
        });

        await verifiedAdmin.save();
        console.log('✅ تم إنشاء حساب الأدمن المحقق');

        // إضافة كود الأدمن إلى جدول الأكواد
        console.log('🔢 إضافة كود الأدمن إلى قاعدة الأكواد...');
        const adminCodeDoc = new Code({
            code: adminCode,
            role: 'admin',
            used: true,
            usedBy: verifiedAdmin._id
        });

        await adminCodeDoc.save();
        console.log('✅ تم إضافة كود الأدمن إلى قاعدة الأكواد');

        // إحصائيات نهائية
        console.log('\n📊 الإحصائيات النهائية...');
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const verifiedAdmins = await User.countDocuments({ role: 'admin', isVerified: true });
        const totalCodes = await Code.countDocuments();
        const adminCodes = await Code.countDocuments({ role: 'admin' });

        console.log('\n🎉 تم إنشاء حساب الأدمن المحقق بنجاح!');
        console.log('\n📋 بيانات الأدمن الجديد:');
        console.log(`👤 الاسم: ${verifiedAdmin.name}`);
        console.log(`🔑 الكود: ${adminCode}`);
        console.log(`🔐 كلمة المرور: ${adminPassword}`);
        console.log(`📧 البريد الإلكتروني: ${verifiedAdmin.email}`);
        console.log(`✅ الحالة: محقق`);
        console.log(`👑 الدور: ${verifiedAdmin.role}`);
        console.log(`📍 الموقع: ${verifiedAdmin.location}`);

        console.log('\n📊 إحصائيات النظام:');
        console.log(`👥 إجمالي حسابات الأدمن: ${totalAdmins}`);
        console.log(`✅ حسابات الأدمن المحققة: ${verifiedAdmins}`);
        console.log(`🔢 إجمالي الأكواد: ${totalCodes}`);
        console.log(`👑 أكواد الأدمن: ${adminCodes}`);

        return {
            adminData: {
                name: verifiedAdmin.name,
                code: adminCode,
                password: adminPassword,
                email: verifiedAdmin.email,
                isVerified: verifiedAdmin.isVerified,
                role: verifiedAdmin.role
            },
            statistics: {
                totalAdmins,
                verifiedAdmins,
                totalCodes,
                adminCodes
            }
        };

    } catch (error) {
        console.error('❌ خطأ في إنشاء حساب الأدمن المحقق:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات');
    }
}

// تشغيل الدالة
addVerifiedAdminAccount()
    .then((result) => {
        console.log('\n✅ تمت العملية بنجاح');
        console.log('📱 يمكن للأدمن الجديد تسجيل الدخول مباشرة');
        console.log(`🔑 الكود: ${result.adminData.code}`);
        console.log(`🔐 كلمة المرور: ${result.adminData.password}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشلت العملية:', error.message);
        process.exit(1);
    });