import { validationResult } from 'express-validator';
import { Task } from '../../models/task.js';

export const createTask = async (req, res, next) => {
  try {
    console.log('📝 محاولة إنشاء مهمة جديدة...');
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

    // التحقق من صلاحية المستخدم لإنشاء المهام
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      console.log('❌ المستخدم ليس له صلاحية إنشاء مهام:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لإنشاء المهام'
      });
    }

    const { title, description, dueDate, grade, subject, priority, status, attachments } = req.body;

    // التحقق من عدم وجود مهمة بنفس العنوان والصف والمادة
    const existingTask = await Task.findOne({
      title: title.trim(),
      grade,
      subject: subject.trim(),
      status: { $ne: 'ملغي' }
    });

    if (existingTask) {
      console.log('⚠️ توجد مهمة بنفس العنوان والصف والمادة');
      return res.status(409).json({
        success: false,
        message: 'توجد مهمة أخرى بنفس العنوان والصف والمادة'
      });
    }

    // إنشاء المهمة الجديدة
    const newTask = new Task({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      grade,
      subject: subject.trim(),
      priority: priority || 'متوسط',
      status: status || 'نشط',
      attachments: attachments || [],
      createdBy: req.user._id
    });

    const savedTask = await newTask.save();
    console.log('✅ تم إنشاء المهمة بنجاح:', savedTask._id);

    // جلب المهمة مع معلومات المنشئ
    const populatedTask = await Task.findById(savedTask._id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المهمة بنجاح',
      data: populatedTask
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء المهمة:', error);
    next(error);
  }
};