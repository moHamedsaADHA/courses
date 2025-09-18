import { Task } from '../../models/task.js';
import mongoose from 'mongoose';

export const getTask = async (req, res, next) => {
  try {
    console.log('📋 جلب مهمة واحدة...');
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

    // جلب المهمة
    const task = await Task.findById(id)
      .populate('createdBy', 'name email role grade')
      .populate('updatedBy', 'name email role');

    if (!task) {
      console.log('❌ المهمة غير موجودة');
      return res.status(404).json({
        success: false,
        message: 'المهمة غير موجودة'
      });
    }

    // تحديث حالة المهمة إذا انتهت صلاحيتها
    await task.checkExpiry();
    
    // إعادة جلب المهمة في حالة تغيير حالتها
    const updatedTask = await Task.findById(id)
      .populate('createdBy', 'name email role grade')
      .populate('updatedBy', 'name email role');

    console.log('✅ تم جلب المهمة بنجاح:', task.title);

    // معلومات إضافية عن المهمة
    const additionalInfo = {
      isExpired: updatedTask.dueDate < new Date(),
      daysUntilDue: Math.ceil((updatedTask.dueDate - new Date()) / (1000 * 60 * 60 * 24)),
      canEdit: req.user._id.toString() === updatedTask.createdBy._id.toString() || 
               req.user.role === 'admin',
      attachmentCount: updatedTask.attachments ? updatedTask.attachments.length : 0
    };

    res.status(200).json({
      success: true,
      message: 'تم جلب المهمة بنجاح',
      data: {
        ...updatedTask.toObject(),
        additionalInfo
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب المهمة:', error);
    next(error);
  }
};