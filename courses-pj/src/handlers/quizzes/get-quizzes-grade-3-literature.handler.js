import { Quiz } from '../../models/quiz.js';

export const getQuizzesByGradeThreeLiterature = async (req, res, next) => {
  try {
    console.log('📖 جلب كويزات الصف الثالث الثانوي أدبي...');
    console.log('👤 معرف المستخدم:', req.user?._id);

    // التحقق من وجود المستخدم
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const grade = "الصف الثالث الثانوي ادبي";

    // إعدادات الصفحة والترتيب
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // فلاتر إضافية
    const filters = { grade };
    
    if (req.query.subject) {
      filters.subject = { $regex: req.query.subject, $options: 'i' };
    }
    
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    } else {
      filters.isActive = true; // فقط الكويزات النشطة بشكل افتراضي
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

    // ترتيب حسب تاريخ الإنشاء وعدد الأسئلة (للثانوية العامة)
    let sortOption = { totalQuestions: -1, createdAt: -1 };

    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    console.log('🔍 فلاتر البحث للصف الثالث أدبي:', filters);

    // جلب الكويزات مع العد الكامل
    const [quizzes, totalQuizzes] = await Promise.all([
      Quiz.find(filters)
        .populate('createdBy', 'name email role')
        .populate('updatedBy', 'name email role')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select('-questions.correctAnswer -questions.options.isCorrect'), // إخفاء الإجابات
      Quiz.countDocuments(filters)
    ]);

    console.log(`✅ تم جلب ${quizzes.length} كويز للصف الثالث أدبي من أصل ${totalQuizzes}`);

    // إحصائيات مفصلة للثانوية العامة
    const gradeStats = await Quiz.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          activeQuizzes: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          inactiveQuizzes: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          avgQuestions: { $avg: '$totalQuestions' },
          totalQuestions: { $sum: '$totalQuestions' },
          avgTimeLimit: { $avg: '$timeLimit' },
          maxQuestions: { $max: '$totalQuestions' },
          minQuestions: { $min: '$totalQuestions' }
        }
      }
    ]);

    // إحصائيات المواد الأدبية للثانوية العامة
    const subjectStats = await Quiz.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          activeQuizzes: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          avgQuestions: { $avg: '$totalQuestions' },
          totalPoints: { $sum: '$totalPoints' },
          avgTimeLimit: { $avg: '$timeLimit' }
        }
      },
      { $sort: { totalPoints: -1, count: -1 } }
    ]);

    // أحدث الكويزات وأكثرها شمولية
    const recentQuizzes = await Quiz.find({
      ...filters,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title createdAt totalQuestions subject timeLimit totalPoints')
      .populate('createdBy', 'name');

    // الكويزات الأكثر شمولية (أكثر أسئلة)
    const comprehensiveQuizzes = await Quiz.find({
      ...filters,
      isActive: true
    })
      .sort({ totalQuestions: -1, totalPoints: -1 })
      .limit(3)
      .select('title totalQuestions subject totalPoints timeLimit')
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'تم جلب كويزات الصف الثالث الثانوي أدبي بنجاح',
      grade: grade,
      data: quizzes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / limit),
        totalQuizzes,
        hasNext: page * limit < totalQuizzes,
        hasPrev: page > 1
      },
      statistics: {
        gradeOverview: gradeStats[0] || {},
        subjectBreakdown: subjectStats,
        recentQuizzes: recentQuizzes,
        comprehensiveQuizzes: comprehensiveQuizzes
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب كويزات الصف الثالث أدبي:', error);
    next(error);
  }
};