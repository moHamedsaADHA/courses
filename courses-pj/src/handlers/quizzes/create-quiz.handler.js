import { validationResult } from 'express-validator';
import { Quiz } from '../../models/quiz.js';

export const createQuiz = async (req, res, next) => {
  try {
    console.log('📝 محاولة إنشاء كويز جديد...');
    console.log('📊 بيانات الطلب:', req.body);
    console.log('👤 معرف المستخدم:', req.user?._id);

    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ أخطاء في التحقق من صحة البيانات:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    // التحقق من وجود المستخدم وصلاحياته
    if (!req.user || !req.user._id) {
      console.log('❌ لا يوجد مستخدم في الطلب');
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    // التحقق من صلاحية المستخدم لإنشاء الكويزات
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      console.log('❌ المستخدم ليس له صلاحية إنشاء كويزات:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لإنشاء الكويزات'
      });
    }

    const { title, description, grade, subject, questions, timeLimit, isActive } = req.body;

    // التحقق من عدم وجود كويز بنفس العنوان والصف والمادة
    const existingQuiz = await Quiz.findOne({
      title: title.trim(),
      grade,
      subject: subject.trim(),
      isActive: true
    });

    if (existingQuiz) {
      console.log('⚠️ توجد كويز بنفس العنوان والصف والمادة');
      return res.status(409).json({
        success: false,
        message: 'توجد كويز أخرى بنفس العنوان والصف والمادة'
      });
    }

    // إنشاء الكويز الجديد
    const newQuiz = new Quiz({
      title: title.trim(),
      description: description ? description.trim() : '',
      grade,
      subject: subject.trim(),
      questions: questions || [],
      timeLimit: timeLimit || 30,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });

    // التحقق من صحة الأسئلة
    const questionErrors = newQuiz.validateQuestions();
    if (questionErrors.length > 0) {
      console.log('❌ أخطاء في الأسئلة:', questionErrors);
      return res.status(400).json({
        success: false,
        message: 'أخطاء في الأسئلة',
        errors: questionErrors.map(error => ({ message: error }))
      });
    }

    const savedQuiz = await newQuiz.save();
    console.log('✅ تم إنشاء الكويز بنجاح:', savedQuiz._id);

    // جلب الكويز مع معلومات المنشئ
    const populatedQuiz = await Quiz.findById(savedQuiz._id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الكويز بنجاح',
      data: populatedQuiz
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء الكويز:', error);
    next(error);
  }
};