import { validationResult } from 'express-validator';
import { Quiz } from '../../models/quiz.js';
import mongoose from 'mongoose';

export const updateQuiz = async (req, res, next) => {
  try {
    console.log('✏️ محاولة تحديث كويز...');
    console.log('🆔 معرف الكويز:', req.params.id);
    console.log('📊 بيانات التحديث:', req.body);
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

    // جلب الكويز الحالي
    const existingQuiz = await Quiz.findById(id);
    
    if (!existingQuiz) {
      console.log('❌ الكويز غير موجود');
      return res.status(404).json({
        success: false,
        message: 'الكويز غير موجود'
      });
    }

    // التحقق من الصلاحيات
    const canEdit = req.user._id.toString() === existingQuiz.createdBy.toString() || 
                    req.user.role === 'admin';

    if (!canEdit) {
      console.log('❌ ليس لديك صلاحية لتعديل هذا الكويز');
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا الكويز'
      });
    }

    const { title, description, grade, subject, questions, timeLimit, isActive } = req.body;

    // التحقق من عدم التضارب في العنوان والصف والمادة (إذا تم تغييرها)
    if (title || grade || subject) {
      const checkTitle = title ? title.trim() : existingQuiz.title;
      const checkGrade = grade || existingQuiz.grade;
      const checkSubject = subject ? subject.trim() : existingQuiz.subject;

      const conflictQuiz = await Quiz.findOne({
        _id: { $ne: id },
        title: checkTitle,
        grade: checkGrade,
        subject: checkSubject,
        isActive: true
      });

      if (conflictQuiz) {
        console.log('⚠️ توجد كويز أخرى بنفس العنوان والصف والمادة');
        return res.status(409).json({
          success: false,
          message: 'توجد كويز أخرى بنفس العنوان والصف والمادة'
        });
      }
    }

    // إعداد البيانات المحدثة
    const updateData = {
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (grade) updateData.grade = grade;
    if (subject) updateData.subject = subject.trim();
    if (timeLimit) updateData.timeLimit = timeLimit;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (questions) updateData.questions = questions;

    // إنشاء كويز مؤقت للتحقق من صحة الأسئلة
    if (questions) {
      const tempQuiz = new Quiz({
        ...existingQuiz.toObject(),
        ...updateData
      });

      const questionErrors = tempQuiz.validateQuestions();
      if (questionErrors.length > 0) {
        console.log('❌ أخطاء في الأسئلة:', questionErrors);
        return res.status(400).json({
          success: false,
          message: 'أخطاء في الأسئلة',
          errors: questionErrors.map(error => ({ message: error }))
        });
      }
    }

    // تحديث الكويز
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email role')
     .populate('updatedBy', 'name email role');

    console.log('✅ تم تحديث الكويز بنجاح:', updatedQuiz.title);

    res.status(200).json({
      success: true,
      message: 'تم تحديث الكويز بنجاح',
      data: updatedQuiz
    });

  } catch (error) {
    console.error('❌ خطأ في تحديث الكويز:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    next(error);
  }
};