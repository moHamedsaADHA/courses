import { Quiz } from '../../models/quiz.js';
import mongoose from 'mongoose';

export const deleteQuiz = async (req, res, next) => {
  try {
    console.log('🗑️ محاولة حذف كويز...');
    console.log('🆔 معرف الكويز:', req.params.id);
    console.log('👤 معرف المستخدم:', req.user?._id);

    // التحقق من وجود المستخدم
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const { id } = req.params;

    // التحقق من صحة معرف الكويز
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرف الكويز غير صحيح'
      });
    }

    // جلب الكويز للتحقق من وجودها والصلاحيات
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      console.log('❌ الكويز غير موجود');
      return res.status(404).json({
        success: false,
        message: 'الكويز غير موجود'
      });
    }

    // التحقق من الصلاحيات
    const canDelete = req.user._id.toString() === quiz.createdBy.toString() || 
                      req.user.role === 'admin';

    if (!canDelete) {
      console.log('❌ ليس لديك صلاحية لحذف هذا الكويز');
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذا الكويز'
      });
    }

    // حفظ معلومات الكويز قبل الحذف للسجلات
    const quizInfo = {
      id: quiz._id,
      title: quiz.title,
      grade: quiz.grade,
      subject: quiz.subject,
      totalQuestions: quiz.totalQuestions,
      createdBy: quiz.createdBy,
      deletedBy: req.user._id,
      deletedAt: new Date()
    };

    console.log('📝 معلومات الكويز المحذوف:', quizInfo);

    // حذف الكويز نهائياً
    await Quiz.findByIdAndDelete(id);

    console.log('✅ تم حذف الكويز بنجاح:', quizInfo.title);

    res.status(200).json({
      success: true,
      message: 'تم حذف الكويز بنجاح',
      data: {
        deletedQuiz: {
          id: quizInfo.id,
          title: quizInfo.title,
          grade: quizInfo.grade,
          subject: quizInfo.subject,
          totalQuestions: quizInfo.totalQuestions
        },
        deletedAt: quizInfo.deletedAt,
        deletedBy: req.user.name || req.user.email
      }
    });

  } catch (error) {
    console.error('❌ خطأ في حذف الكويز:', error);
    next(error);
  }
};