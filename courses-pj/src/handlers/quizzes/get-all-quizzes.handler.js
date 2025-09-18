import { Quiz } from '../../models/quiz.js';

export const getAllQuizzes = async (req, res, next) => {
  try {
    console.log('📋 جلب جميع الكويزات...');
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
    
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }

    // فلتر المدرس (إذا لم يكن admin)
    if (req.user.role === 'instructor') {
      filters.createdBy = req.user._id;
    }

    // البحث النصي
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // إعدادات الترتيب
    let sortOption = { createdAt: -1 }; // الافتراضي: الأحدث أولاً
    
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    console.log('🔍 فلاتر البحث:', filters);
    console.log('📊 إعدادات الترتيب:', sortOption);

    // جلب الكويزات مع العد الكامل
    const [quizzes, totalQuizzes] = await Promise.all([
      Quiz.find(filters)
        .populate('createdBy', 'name email role')
        .populate('updatedBy', 'name email role')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select('-questions.correctAnswer'), // إخفاء الإجابات الصحيحة
      Quiz.countDocuments(filters)
    ]);

    console.log(`✅ تم جلب ${quizzes.length} كويز من أصل ${totalQuizzes}`);

    // حساب الإحصائيات
    const stats = await Quiz.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 },
          avgQuestions: { $avg: '$totalQuestions' },
          avgPoints: { $avg: '$totalPoints' }
        }
      }
    ]);

    const subjectStats = await Quiz.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          activeQuizzes: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'تم جلب الكويزات بنجاح',
      data: quizzes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / limit),
        totalQuizzes,
        hasNext: page * limit < totalQuizzes,
        hasPrev: page > 1
      },
      statistics: {
        statusCounts: stats,
        subjectBreakdown: subjectStats
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب الكويزات:', error);
    next(error);
  }
};