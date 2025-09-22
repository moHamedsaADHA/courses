import { QuizResult } from '../../models/quiz-result.js';
import { User } from '../../models/user.js';

export const getStudentResultsHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;

    // جلب بيانات المستخدم
    const user = await User.findById(userId).select('name grade role');
    
    // متاح لجميع المستخدمين

    // جلب نتائج الطالب
    const results = await QuizResult.find({ student: userId })
      .populate({
        path: 'quiz',
        select: 'title subject grade totalQuestions totalPoints createdAt',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      })
      .sort({ completedAt: -1 })
      .lean();

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "لا توجد نتائج كويزات لهذا المستخدم",
        data: {
          user: {
            name: user.name,
            grade: user.grade,
            role: user.role
          },
          results: [],
          statistics: {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            worstScore: 0,
            totalTimeSpent: 0,
            gradeDistribution: {}
          }
        }
      });
    }

    // حساب الإحصائيات
    const totalQuizzes = results.length;
    const scores = results.map(r => r.score.percentage);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / totalQuizzes);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    const totalTimeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0);

    // توزيع التقديرات
    const gradeDistribution = results.reduce((dist, result) => {
      const grade = result.grade.letter;
      dist[grade] = (dist[grade] || 0) + 1;
      return dist;
    }, {});

    // إعداد النتائج للعرض
    const formattedResults = results.map(result => {
      // إذا لم يوجد كويز (quiz=null) لأي سبب، تجنب الخطأ وأظهر بيانات افتراضية
      const quiz = result.quiz || {};
      return {
        id: result._id,
        quiz: {
          title: quiz.title || 'غير متوفر',
          subject: quiz.subject || 'غير متوفر',
          grade: quiz.grade || 'غير متوفر',
          totalQuestions: quiz.totalQuestions || 0,
          totalPoints: quiz.totalPoints || 0,
          createdBy: quiz.createdBy?.name || 'غير معروف'
        },
        score: {
          percentage: result.score.percentage,
          earnedPoints: result.score.earnedPoints,
          totalPoints: result.score.totalPoints,
          correctAnswers: result.score.correctAnswers,
          totalQuestions: result.score.totalQuestions
        },
        grade: result.grade,
        timeSpent: {
          seconds: result.timeSpent,
          display: `${Math.floor(result.timeSpent / 60)}:${(result.timeSpent % 60).toString().padStart(2, '0')}`
        },
        completedAt: result.completedAt,
        // تحديد الأداء
        performance: result.score.percentage >= 90 ? 'ممتاز' : 
                    result.score.percentage >= 80 ? 'جيد جداً' :
                    result.score.percentage >= 70 ? 'جيد' :
                    result.score.percentage >= 60 ? 'مقبول' : 'يحتاج تحسين'
      };
    });

    res.status(200).json({
      success: true,
      message: "تم جلب نتائج الكويزات بنجاح",
      data: {
        user: {
          name: user.name,
          grade: user.grade,
          role: user.role
        },
        results: formattedResults,
        statistics: {
          totalQuizzes,
          averageScore,
          bestScore,
          worstScore,
          totalTimeSpent: {
            seconds: totalTimeSpent,
            minutes: Math.floor(totalTimeSpent / 60),
            hours: Math.floor(totalTimeSpent / 3600),
            display: `${Math.floor(totalTimeSpent / 3600)}:${Math.floor((totalTimeSpent % 3600) / 60).toString().padStart(2, '0')}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
          },
          gradeDistribution,
          performanceTrend: formattedResults.slice(0, 5).map(r => ({
            date: r.completedAt,
            score: r.score.percentage
          }))
        }
      }
    });

  } catch (error) {
    console.error('Error getting student results:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب النتائج",
      error: error.message
    });
  }
};