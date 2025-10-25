import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// استيراد نموذج الأكواد
import { Code } from './src/models/code.js';

// الاتصال بقاعدة البيانات
const DB_CONNECTION = process.env.DB_URL 

async function addStudentCodes() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await mongoose.connect(DB_CONNECTION);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // قراءة أكواد الطلاب من الملف
        console.log('📖 قراءة أكواد الطلاب من الملف...');
        const studentCodesPath = path.join(process.cwd(), 'student-codes.txt');
        const studentCodesContent = fs.readFileSync(studentCodesPath, 'utf8');
        const studentCodes = studentCodesContent.split('\n').filter(code => code.trim() !== '');

        console.log(`📊 عدد أكواد الطلاب في الملف: ${studentCodes.length}`);

        // التحقق من الأكواد الموجودة مسبقاً
        console.log('🔍 التحقق من الأكواد الموجودة...');
        const existingCodes = await Code.find({ role: 'student' });
        const existingCodeValues = existingCodes.map(code => code.code);
        
        console.log(`📋 عدد أكواد الطلاب الموجودة: ${existingCodes.length}`);

        // تحديد الأكواد الجديدة التي تحتاج للإضافة
        const newCodes = studentCodes
            .map(code => code.trim())
            .filter(code => !existingCodeValues.includes(code));

        console.log(`🆕 عدد الأكواد الجديدة للإضافة: ${newCodes.length}`);

        if (newCodes.length === 0) {
            console.log('✅ جميع الأكواد موجودة مسبقاً - لا حاجة للإضافة');
            return {
                totalCodes: studentCodes.length,
                existingCodes: existingCodes.length,
                newCodes: 0,
                addedCodes: 0
            };
        }

        // إضافة الأكواد الجديدة بالدفعات لتحسين الأداء
        const batchSize = 100;
        let addedCount = 0;

        for (let i = 0; i < newCodes.length; i += batchSize) {
            const batch = newCodes.slice(i, i + batchSize);
            
            const codeDocuments = batch.map(code => ({
                code: code,
                role: 'student',
                used: false // الكود غير مستخدم بعد
            }));

            try {
                await Code.insertMany(codeDocuments);
                addedCount += batch.length;
                console.log(`✅ تم إضافة ${addedCount}/${newCodes.length} كود...`);
            } catch (error) {
                // في حالة وجود تضارب في الأكواد، سنحاول إضافة كل كود منفرداً
                console.log(`⚠️ خطأ في الدفعة، سيتم المحاولة منفرداً...`);
                for (const codeDoc of codeDocuments) {
                    try {
                        await Code.create(codeDoc);
                        addedCount++;
                    } catch (singleError) {
                        console.log(`❌ فشل في إضافة الكود: ${codeDoc.code} - ${singleError.message}`);
                    }
                }
                console.log(`✅ تم إضافة ${addedCount}/${newCodes.length} كود...`);
            }
        }

        // التحقق النهائي من النتائج
        console.log('📊 التحقق من النتائج النهائية...');
        const finalCount = await Code.countDocuments({ role: 'student' });
        const usedCount = await Code.countDocuments({ role: 'student', used: true });
        const availableCount = await Code.countDocuments({ role: 'student', used: false });

        console.log('\n🎉 تمت إضافة أكواد الطلاب بنجاح!');
        console.log('\n📋 ملخص النتائج:');
        console.log(`📁 عدد الأكواد في الملف: ${studentCodes.length}`);
        console.log(`➕ عدد الأكواد المضافة: ${addedCount}`);
        console.log(`📊 إجمالي أكواد الطلاب في قاعدة البيانات: ${finalCount}`);
        console.log(`✅ أكواد مستخدمة: ${usedCount}`);
        console.log(`🆓 أكواد متاحة: ${availableCount}`);

        return {
            totalCodes: studentCodes.length,
            existingCodes: existingCodes.length,
            newCodes: newCodes.length,
            addedCodes: addedCount,
            finalCount: finalCount,
            usedCount: usedCount,
            availableCount: availableCount
        };

    } catch (error) {
        console.error('❌ خطأ في إضافة أكواد الطلاب:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات');
    }
}

// تشغيل الدالة
addStudentCodes()
    .then((result) => {
        console.log('\n✅ تمت العملية بنجاح');
        console.log('🎓 النظام جاهز لاستخدام الأكواد في التسجيل');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ فشلت العملية:', error.message);
        process.exit(1);
    });