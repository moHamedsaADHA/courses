import { validationResult } from 'express-validator';
import { Task } from '../../models/task.js';
import mongoose from 'mongoose';

export const updateTask = async (req, res, next) => {
  try {
    console.log('✏️ محاولة تحديث مهمة...');
    console.log('🆔 معرف المهمة:', req.params.id);
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

    // التحقق من صحة معرف المهمة
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرف المهمة غير صحيح'
      });
    }

    // جلب المهمة الحالية
    const existingTask = await Task.findById(id);
    
    if (!existingTask) {
      console.log('❌ المهمة غير موجودة');
      return res.status(404).json({
        success: false,
        message: 'المهمة غير موجودة'
      });
    }

    // التحقق من الصلاحيات
    const canEdit = req.user._id.toString() === existingTask.createdBy.toString() || 
                    req.user.role === 'admin';

    if (!canEdit) {
      console.log('❌ ليس لديك صلاحية لتعديل هذه المهمة');
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذه المهمة'
      });
    }

  const { title, description, dueDate, grade, subject, priority, status, attachments, questions } = req.body;

    // التحقق من عدم التضارب في العنوان والصف والمادة (إذا تم تغييرها)
    if (title || grade || subject) {
      const checkTitle = title ? title.trim() : existingTask.title;
      const checkGrade = grade || existingTask.grade;
      const checkSubject = subject ? subject.trim() : existingTask.subject;

      const conflictTask = await Task.findOne({
        _id: { $ne: id },
        title: checkTitle,
        grade: checkGrade,
        subject: checkSubject,
        status: { $ne: 'ملغي' }
      });

      if (conflictTask) {
        console.log('⚠️ توجد مهمة أخرى بنفس العنوان والصف والمادة');
        return res.status(409).json({
          success: false,
          message: 'توجد مهمة أخرى بنفس العنوان والصف والمادة'
        });
      }
    }

    // إعداد البيانات المحدثة
    const updateData = {
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (grade) updateData.grade = grade;
    if (subject) updateData.subject = subject.trim();
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (attachments) updateData.attachments = attachments;
    if (Array.isArray(questions)) updateData.questions = questions;

    // تحديث المهمة
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email role')
     .populate('updatedBy', 'name email role');

    console.log('✅ تم تحديث المهمة بنجاح:', updatedTask.title);

    res.status(200).json({
      success: true,
      message: 'تم تحديث المهمة بنجاح',
      data: updatedTask
    });

  } catch (error) {
    console.error('❌ خطأ في تحديث المهمة:', error);
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