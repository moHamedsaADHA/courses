import { User } from '../../models/user.js';

export const getAllUsersHandler = async (req, res) => {
  try {
    // إعدادات الصفحة والترتيب
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // فلاتر البحث
    const filters = {};
    
    // البحث بالاسم
    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: 'i' }; // بحث غير حساس للحالة
    }
    
    // البحث بالكود
    if (req.query.code) {
      filters.code = { $regex: req.query.code, $options: 'i' };
    }
    
    // فلترة حسب الدور
    if (req.query.role) {
      filters.role = req.query.role;
    }
    
    // فلترة حسب الصف
    if (req.query.grade) {
      filters.grade = req.query.grade;
    }
    
    // فلترة حسب حالة التفعيل
    if (req.query.isVerified !== undefined) {
      filters.isVerified = req.query.isVerified === 'true';
    }

    console.log('🔍 فلاتر البحث:', filters);
    console.log('📄 الصفحة:', page, 'الحد:', limit);

    // جلب المستخدمين مع الفلاتر
    const users = await User.find(filters)
      .select('name email code role grade location phone isVerified createdAt updatedAt password') // تضمين كلمة المرور كما طلب العميل
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .skip(skip)
      .limit(limit)
      .lean(); // للأداء الأفضل

    // عدد المستخدمين الإجمالي
    const total = await User.countDocuments(filters);

    // إحصائيات إضافية
    const stats = await User.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
          unverifiedUsers: { $sum: { $cond: ['$isVerified', 0, 1] } },
          roles: { $push: '$role' },
          grades: { $push: '$grade' }
        }
      }
    ]);

    // تجميع الإحصائيات
    const statistics = stats[0] || { totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 };
    
    // عدد المستخدمين حسب الدور
    const roleCount = {};
    if (statistics.roles) {
      statistics.roles.forEach(role => {
        roleCount[role] = (roleCount[role] || 0) + 1;
      });
    }
    
    // عدد المستخدمين حسب الصف
    const gradeCount = {};
    if (statistics.grades) {
      statistics.grades.forEach(grade => {
        gradeCount[grade] = (gradeCount[grade] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم جلب المستخدمين بنجاح',
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      statistics: {
        total: statistics.totalUsers,
        verified: statistics.verifiedUsers,
        unverified: statistics.unverifiedUsers,
        byRole: roleCount,
        byGrade: gradeCount
      },
      filters: req.query // إرجاع الفلاتر المطبقة
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المستخدمين',
      error: error.message
    });
  }
};