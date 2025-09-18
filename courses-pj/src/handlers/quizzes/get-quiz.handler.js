import { Quiz } from '../../models/quiz.js';
import mongoose from 'mongoose';

export const getQuiz = async (req, res, next) => {
  try {
    console.log('📋 جلب كويز واحد...');
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

    // جلب الكويز
    let quiz = await Quiz.findById(id)
      .populate('createdBy', 'name email role grade')
      .populate('updatedBy', 'name email role');

    if (!quiz) {
      console.log('❌ الكويز غير موجود');
      return res.status(404).json({
        success: false,
        message: 'الكويز غير موجود'
      });
    }

    // التحقق من الصلاحيات للعرض
    const canViewAnswers = req.user._id.toString() === quiz.createdBy._id.toString() || 
                           req.user.role === 'admin';

    // إذا كان المستخدم طالب، أخف الإجابات الصحيحة
    if (!canViewAnswers) {
      quiz = quiz.toObject();
      quiz.questions = quiz.questions.map(question => {
        const questionCopy = { ...question };
        delete questionCopy.correctAnswer;
        if (questionCopy.options) {
          questionCopy.options = questionCopy.options.map(option => ({
            _id: option._id,
            text: option.text
            // إخفاء isCorrect
          }));
        }
        return questionCopy;
      });
    }

    console.log('✅ تم جلب الكويز بنجاح:', quiz.title);

    // معلومات إضافية عن الكويز
    const additionalInfo = {
      canEdit: req.user._id.toString() === quiz.createdBy._id.toString() || 
               req.user.role === 'admin',
      canViewAnswers,
      questionsCount: quiz.totalQuestions,
      estimatedTime: quiz.timeLimit,
      difficulty: quiz.totalQuestions <= 5 ? 'سهل' : 
                 quiz.totalQuestions <= 10 ? 'متوسط' : 'صعب'
    };

    res.status(200).json({
      success: true,
      message: 'تم جلب الكويز بنجاح',
      data: {
        ...quiz,
        additionalInfo
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب الكويز:', error);
    next(error);
  }
};