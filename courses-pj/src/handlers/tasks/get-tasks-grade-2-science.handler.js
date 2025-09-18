import { Task } from '../../models/task.js';

export const getTasksByGradeTwoScience = async (req, res, next) => {
  try {
    console.log('🧪 جلب مهام الصف الثاني الثانوي علمي...');
    console.log('👤 معرف المستخدم:', req.user?._id);

    // التحقق من وجود المستخدم
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const grade = "الصف الثاني الثانوي علمي";

    // إعدادات الصفحة والترتيب
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // فلاتر إضافية
    const filters = { grade };
    
    if (req.query.subject) {
      filters.subject = { $regex: req.query.subject, $options: 'i' };
    }
    
    if (req.query.status) {
      filters.status = req.query.status;
    } else {
      filters.status = { $ne: 'ملغي' }; // استثناء المهام الملغية بشكل افتراضي
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

    // ترتيب حسب تاريخ التسليم والأولوية
    let sortOption = { dueDate: 1, createdAt: -1 };

    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    console.log('🔍 فلاتر البحث للصف الثاني علمي:', filters);

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

    console.log(`✅ تم جلب ${tasks.length} مهمة للصف الثاني علمي من أصل ${totalTasks}`);

    // إحصائيات المهام للصف الثاني علمي
    const gradeStats = await Task.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          activeTasks: { $sum: { $cond: [{ $eq: ['$status', 'نشط'] }, 1, 0] } },
          expiredTasks: { $sum: { $cond: [{ $eq: ['$status', 'منتهي'] }, 1, 0] } },
          cancelledTasks: { $sum: { $cond: [{ $eq: ['$status', 'ملغي'] }, 1, 0] } },
          urgentTasks: { $sum: { $cond: [{ $eq: ['$priority', 'عاجل'] }, 1, 0] } },
          highPriorityTasks: { $sum: { $cond: [{ $eq: ['$priority', 'عالي'] }, 1, 0] } }
        }
      }
    ]);

    // إحصائيات المواد العلمية
    const subjectStats = await Task.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          activeTasks: { $sum: { $cond: [{ $eq: ['$status', 'نشط'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'تم جلب مهام الصف الثاني الثانوي علمي بنجاح',
      grade: grade,
      data: tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        hasNext: page * limit < totalTasks,
        hasPrev: page > 1
      },
      statistics: {
        gradeOverview: gradeStats[0] || {},
        subjectBreakdown: subjectStats
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب مهام الصف الثاني علمي:', error);
    next(error);
  }
};