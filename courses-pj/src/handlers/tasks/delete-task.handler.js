import { Task } from '../../models/task.js';
import mongoose from 'mongoose';

export const deleteTask = async (req, res, next) => {
  try {
    console.log('🗑️ محاولة حذف مهمة...');
    console.log('🆔 معرف المهمة:', req.params.id);
    console.log('👤 معرف المستخدم:', req.user?._id);

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

    // جلب المهمة للتحقق من وجودها والصلاحيات
    const task = await Task.findById(id);

    if (!task) {
      console.log('❌ المهمة غير موجودة');
      return res.status(404).json({
        success: false,
        message: 'المهمة غير موجودة'
      });
    }

    // التحقق من الصلاحيات
    const canDelete = req.user._id.toString() === task.createdBy.toString() || 
                      req.user.role === 'admin';

    if (!canDelete) {
      console.log('❌ ليس لديك صلاحية لحذف هذه المهمة');
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذه المهمة'
      });
    }

    // حفظ معلومات المهمة قبل الحذف للسجلات
    const taskInfo = {
      id: task._id,
      title: task.title,
      grade: task.grade,
      subject: task.subject,
      dueDate: task.dueDate,
      createdBy: task.createdBy,
      deletedBy: req.user._id,
      deletedAt: new Date()
    };

    console.log('📝 معلومات المهمة المحذوفة:', taskInfo);

    // حذف المهمة نهائياً
    await Task.findByIdAndDelete(id);

    console.log('✅ تم حذف المهمة بنجاح:', taskInfo.title);

    res.status(200).json({
      success: true,
      message: 'تم حذف المهمة بنجاح',
      data: {
        deletedTask: {
          id: taskInfo.id,
          title: taskInfo.title,
          grade: taskInfo.grade,
          subject: taskInfo.subject
        },
        deletedAt: taskInfo.deletedAt,
        deletedBy: req.user.name || req.user.email
      }
    });

  } catch (error) {
    console.error('❌ خطأ في حذف المهمة:', error);
    next(error);
  }
};