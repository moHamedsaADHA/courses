import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// استيراد نموذج الأكواد
import { Code } from './src/models/code.js';

// الاتصال بقاعدة البيانات
const DB_CONNECTION = process.env.DB_URL;

async function exportStudentCodes() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await mongoose.connect(DB_CONNECTION);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // جلب جميع أكواد الطلاب
        console.log('📥 جلب أكواد الطلاب من قاعدة البيانات...');
        const studentCodes = await Code.find({ role: 'student' }).select('code used');

        console.log(`📊 عدد الأكواد المستخرجة: ${studentCodes.length}`);

        // تحويل الأكواد إلى نص
        const codesText = studentCodes.map(codeDoc => codeDoc.code).join('\n');

        // حفظ الأكواد في ملف
        const outputPath = path.join(process.cwd(), 'exported-student-codes.txt');
        fs.writeFileSync(outputPath, codesText, 'utf8');

        console.log(`✅ تم حفظ الأكواد في: ${outputPath}`);

        // إحصائيات
        const usedCount = studentCodes.filter(c => c.used).length;
        const availableCount = studentCodes.filter(c => !c.used).length;

        console.log('\n📋 إحصائيات الأكواد:');
        console.log(`📊 إجمالي الأكواد: ${studentCodes.length}`);
        console.log(`✅ أكواد مستخدمة: ${usedCount}`);
        console.log(`🆓 أكواد متاحة: ${availableCount}`);

        return {
            totalCodes: studentCodes.length,
            usedCodes: usedCount,
            availableCodes: availableCount,
            outputPath: outputPath
        };

    } catch (error) {
        console.error('❌ خطأ في استخراج أكواد الطلاب:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات');
    }
}

// تشغيل الدالة
exportStudentCodes()
    .then((result) => {
        console.log('\n✅ تمت عملية الاستخراج بنجاح');
        console.log(`📁 الملف: ${result.outputPath}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشلت العملية:', error.message);
        process.exit(1);
    });
