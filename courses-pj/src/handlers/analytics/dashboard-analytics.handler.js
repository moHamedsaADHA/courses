import { User } from "../../models/user.js";
import { Course } from "../../models/course.js";
import { Quiz } from "../../models/quiz.js";
import { Task } from "../../models/task.js";
import { Lesson } from "../../models/lesson.js";
import { Category } from "../../models/category.js";

/**
 * جلب جميع التحليلات والإحصائيات للأدمن والمعلم
 * GET /api/analytics/dashboard
 * الصلاحيات المطلوبة: admin أو instructor
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { role } = req.user;

    // التحقق من الصلاحيات
    if (role !== 'admin' && role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بالوصول لهذه البيانات"
      });
    }

    // إحصائيات المستخدمين
    const userStats = await getUserStatistics();
    
    // إحصائيات الكورسات
    const courseStats = await getCourseStatistics(role, req.user._id);
    
    // إحصائيات الكويزات
    const quizStats = await getQuizStatistics(role, req.user._id);
    
    // إحصائيات المهام
    const taskStats = await getTaskStatistics(role, req.user._id);
    
    // إحصائيات الدروس
    const lessonStats = await getLessonStatistics(role, req.user._id);
    
    // إحصائيات الفئات (للأدمن فقط)
    const categoryStats = role === 'admin' ? await getCategoryStatistics() : null;

    // إحصائيات النشاط اليومي
    const dailyActivity = await getDailyActivity(role, req.user._id);

    // إحصائيات حسب الصف
    const gradeStats = await getGradeStatistics(role, req.user._id);
    
    // إحصائيات الطلاب حسب الصف
    const studentsByGrade = await getStudentsByGradeStatistics();

    const analytics = {
      success: true,
      data: {
        overview: {
          users: userStats,
          quizzes: quizStats,
          tasks: taskStats,
          lessons: lessonStats,
          ...(categoryStats && { categories: categoryStats })
        },
        activity: {
          daily: dailyActivity,
          byGrade: gradeStats
        },
        studentsByGrade: studentsByGrade,
        metadata: {
          generatedAt: new Date(),
          userRole: role,
          timezone: 'Africa/Cairo'
        }
      }
    };

    res.status(200).json(analytics);

  } catch (error) {
    console.error('❌ خطأ في جلب التحليلات:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في جلب البيانات",
      error: error.message
    });
  }
};

/**
 * إحصائيات المستخدمين
 */
async function getUserStatistics() {
  try {
    const [total, admins, instructors, students, verified, recent] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    return {
      total,
      byRole: {
        admin: admins,
        instructor: instructors,
        student: students
      },
      verified,
      recent: recent,
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0
    };
  } catch (error) {
    console.error('خطأ في إحصائيات المستخدمين:', error);
    return null;
  }
}

/**
 * إحصائيات الكورسات
 */
async function getCourseStatistics(role, userId) {
  try {
    const filter = role === 'instructor' ? { userId } : {};
    
    const [total, recent, byCategory] = await Promise.all([
      Course.countDocuments(filter),
      Course.countDocuments({
        ...filter,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Course.aggregate([
        ...(role === 'instructor' ? [{ $match: { userId } }] : []),
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $group: {
            _id: '$category.name',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // حساب متوسط السعر
    const priceStats = await Course.aggregate([
      ...(role === 'instructor' ? [{ $match: { userId } }] : []),
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    return {
      total,
      recent,
      byCategory: byCategory.map(item => ({
        category: item._id?.[0] || 'غير محدد',
        count: item.count
      })),
      pricing: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
    };
  } catch (error) {
    console.error('خطأ في إحصائيات الكورسات:', error);
    return null;
  }
}

/**
 * إحصائيات الكويزات
 */
async function getQuizStatistics(role, userId) {
  try {
    const filter = role === 'instructor' ? { createdBy: userId } : {};
    
    const [total, recent, byGrade, bySubject] = await Promise.all([
      Quiz.countDocuments(filter),
      Quiz.countDocuments({
        ...filter,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Quiz.aggregate([
        ...(role === 'instructor' ? [{ $match: { createdBy: userId } }] : []),
        {
          $group: {
            _id: '$grade',
            count: { $sum: 1 },
            avgQuestions: { $avg: { $size: '$questions' } }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Quiz.aggregate([
        ...(role === 'instructor' ? [{ $match: { createdBy: userId } }] : []),
        {
          $group: {
            _id: '$subject',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // إحصائيات الأسئلة
    const questionStats = await Quiz.aggregate([
      ...(role === 'instructor' ? [{ $match: { createdBy: userId } }] : []),
      {
        $project: {
          totalQuestions: { $size: '$questions' },
          multipleChoiceQuestions: {
            $size: {
              $filter: {
                input: '$questions',
                cond: { $eq: ['$$this.type', 'اختر من متعدد'] }
              }
            }
          },
          trueFalseQuestions: {
            $size: {
              $filter: {
                input: '$questions',
                cond: { $eq: ['$$this.type', 'صح وخطأ'] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: '$totalQuestions' },
          avgQuestionsPerQuiz: { $avg: '$totalQuestions' },
          multipleChoice: { $sum: '$multipleChoiceQuestions' },
          trueFalse: { $sum: '$trueFalseQuestions' }
        }
      }
    ]);

    return {
      total,
      recent,
      byGrade: byGrade.map(item => ({
        grade: item._id,
        count: item.count,
        avgQuestions: Math.round(item.avgQuestions || 0)
      })),
      bySubject: bySubject.map(item => ({
        subject: item._id,
        count: item.count
      })),
      questions: questionStats[0] || {
        totalQuestions: 0,
        avgQuestionsPerQuiz: 0,
        multipleChoice: 0,
        trueFalse: 0
      }
    };
  } catch (error) {
    console.error('خطأ في إحصائيات الكويزات:', error);
    return null;
  }
}

/**
 * إحصائيات المهام
 */
async function getTaskStatistics(role, userId) {
  try {
    const filter = role === 'instructor' ? { createdBy: userId } : {};
    const currentDate = new Date();
    
    const [total, recent, upcoming, overdue, byGrade] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({
        ...filter,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Task.countDocuments({
        ...filter,
        dueDate: { $gte: currentDate }
      }),
      Task.countDocuments({
        ...filter,
        dueDate: { $lt: currentDate }
      }),
      Task.aggregate([
        ...(role === 'instructor' ? [{ $match: { createdBy: userId } }] : []),
        {
          $group: {
            _id: '$grade',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    return {
      total,
      recent,
      upcoming,
      overdue,
      completionRate: total > 0 ? Math.round(((total - overdue) / total) * 100) : 0,
      byGrade: byGrade.map(item => ({
        grade: item._id,
        count: item.count
      }))
    };
  } catch (error) {
    console.error('خطأ في إحصائيات المهام:', error);
    return null;
  }
}

/**
 * إحصائيات الدروس
 */
async function getLessonStatistics(role, userId) {
  try {
    const filter = role === 'instructor' ? { createdBy: userId } : {};
    
    const [total, recent, byGrade] = await Promise.all([
      Lesson.countDocuments(filter),
      Lesson.countDocuments({
        ...filter,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Lesson.aggregate([
        ...(role === 'instructor' ? [{ $match: { createdBy: userId } }] : []),
        {
          $group: {
            _id: '$grade',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    return {
      total,
      recent,
      byGrade: byGrade.map(item => ({
        grade: item._id,
        count: item.count
      }))
    };
  } catch (error) {
    console.error('خطأ في إحصائيات الدروس:', error);
    return null;
  }
}

/**
 * إحصائيات الفئات (للأدمن فقط)
 */
async function getCategoryStatistics() {
  try {
    const [total, withCourses] = await Promise.all([
      Category.countDocuments(),
      Category.aggregate([
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'courses'
          }
        },
        {
          $project: {
            name: 1,
            courseCount: { $size: '$courses' }
          }
        },
        { $sort: { courseCount: -1 } }
      ])
    ]);

    return {
      total,
      withCourses: withCourses.map(cat => ({
        name: cat.name,
        courseCount: cat.courseCount
      }))
    };
  } catch (error) {
    console.error('خطأ في إحصائيات الفئات:', error);
    return null;
  }
}

/**
 * إحصائيات النشاط اليومي لآخر 7 أيام
 */
async function getDailyActivity(role, userId) {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    const activityPromises = last7Days.map(async date => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const filter = role === 'instructor' ? 
        { $or: [{ createdBy: userId }, { userId }] } : {};

      const [courses, quizzes, tasks, lessons, users] = await Promise.all([
        Course.countDocuments({
          ...filter,
          createdAt: { $gte: date, $lt: nextDate }
        }),
        Quiz.countDocuments({
          ...(role === 'instructor' ? { createdBy: userId } : {}),
          createdAt: { $gte: date, $lt: nextDate }
        }),
        Task.countDocuments({
          ...(role === 'instructor' ? { createdBy: userId } : {}),
          createdAt: { $gte: date, $lt: nextDate }
        }),
        Lesson.countDocuments({
          ...(role === 'instructor' ? { createdBy: userId } : {}),
          createdAt: { $gte: date, $lt: nextDate }
        }),
        role === 'admin' ? User.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        }) : 0
      ]);

      return {
        date: date.toISOString().split('T')[0],
        courses,
        quizzes,
        tasks,
        lessons,
        users: role === 'admin' ? users : 0,
        total: courses + quizzes + tasks + lessons + (role === 'admin' ? users : 0)
      };
    });

    return await Promise.all(activityPromises);
  } catch (error) {
    console.error('خطأ في إحصائيات النشاط اليومي:', error);
    return [];
  }
}

/**
 * إحصائيات حسب الصف
 */
async function getGradeStatistics(role, userId) {
  try {
    const grades = [
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي", 
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ];

    const gradeStatsPromises = grades.map(async grade => {
      const filter = role === 'instructor' ? { createdBy: userId } : {};

      const [quizzes, tasks, lessons, students] = await Promise.all([
        Quiz.countDocuments({ ...filter, grade }),
        Task.countDocuments({ ...filter, grade }),
        Lesson.countDocuments({ ...filter, grade }),
        User.countDocuments({ role: 'student', grade, isVerified: true })
      ]);

      return {
        grade,
        quizzes,
        tasks,
        lessons,
        students,
        total: quizzes + tasks + lessons
      };
    });

    return await Promise.all(gradeStatsPromises);
  } catch (error) {
    console.error('خطأ في إحصائيات الصفوف:', error);
    return [];
  }
}

/**
 * إحصائيات الطلاب حسب الصف
 */
async function getStudentsByGradeStatistics() {
  try {
    // قائمة جميع الصفوف المتاحة
    const allGrades = [
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي", 
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ];

    // جلب إحصائيات الطلاب الموجودين حسب الصف
    const studentsByGrade = await User.aggregate([
      {
        $match: {
          role: 'student',
          isVerified: true
        }
      },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      }
    ]);

    // تحويل النتائج إلى مرجع سريع
    const studentsMap = {};
    studentsByGrade.forEach(item => {
      studentsMap[item._id] = item.count;
    });

    // إنشاء النتيجة النهائية لتشمل جميع الصفوف
    return allGrades.map(grade => ({
      grade: grade,
      students: studentsMap[grade] || 0
    }));
    
  } catch (error) {
    console.error('خطأ في إحصائيات الطلاب حسب الصف:', error);
    // في حالة الخطأ، إرجاع جميع الصفوف بقيم 0
    return [
      { grade: "الصف الأول الثانوي", students: 0 },
      { grade: "الصف الثاني الثانوي علمي", students: 0 },
      { grade: "الصف الثاني الثانوي ادبي", students: 0 },
      { grade: "الصف الثالث الثانوي علمي", students: 0 },
      { grade: "الصف الثالث الثانوي ادبي", students: 0 }
    ];
  }
}