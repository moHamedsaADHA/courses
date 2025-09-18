import { Task } from '../../models/task.js';

export const getAllTasks = async (req, res, next) => {
  try {
    console.log('📋 جلب جميع المهام...');
    console.log('👤 معرف المستخدم:', req.user?._id);

    // التحقق من وجود المستخدم
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    // إعدادات الصفحة والترتيب
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // فلاتر البحث
    const filters = {};
    
    if (req.query.grade) {
      filters.grade = req.query.grade;
    }
    
    if (req.query.subject) {
      filters.subject = { $regex: req.query.subject, $options: 'i' };
    }
    
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    if (req.query.priority) {
      filters.priority = req.query.priority;
    }

    // فلتر التاريخ
    if (req.query.dueDateFrom || req.query.dueDateTo) {
      filters.dueDate = {};
      if (req.query.dueDateFrom) {
        filters.dueDate.$gte = new Date(req.query.dueDateFrom);
      }
      if (req.query.dueDateTo) {
        filters.dueDate.$lte = new Date(req.query.dueDateTo);
      }
    }

    // البحث النصي
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // إعدادات الترتيب
    let sortOption = { dueDate: 1, createdAt: -1 }; // الافتراضي: حسب تاريخ التسليم ثم الأحدث
    
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    console.log('🔍 فلاتر البحث:', filters);
    console.log('📊 إعدادات الترتيب:', sortOption);

    // جلب المهام مع العد الكامل
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filters)
        .populate('createdBy', 'name email role')
        .populate('updatedBy', 'name email role')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filters)
    ]);

    // تحديث حالة المهام المنتهية الصلاحية
    const expiredTasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: 'نشط'
    });

    for (let task of expiredTasks) {
      await task.checkExpiry();
    }

    console.log(`✅ تم جلب ${tasks.length} مهمة من أصل ${totalTasks}`);

    // حساب الإحصائيات
    const stats = await Task.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { ...filters, status: 'نشط' } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'تم جلب المهام بنجاح',
      data: tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        hasNext: page * limit < totalTasks,
        hasPrev: page > 1
      },
      statistics: {
        statusCounts: stats,
        priorityCounts: priorityStats
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب المهام:', error);
    next(error);
  }
};