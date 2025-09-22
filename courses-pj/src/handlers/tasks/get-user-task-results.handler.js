import { TaskResult } from '../../models/task-result.js';
import { Task } from '../../models/task.js';
import { User } from '../../models/user.js';

export const getUserTaskResultsHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId).select('name grade role');

    // جلب جميع نتائج المهام لهذا المستخدم
    const results = await TaskResult.find({ student: userId })
      .populate({
        path: 'task',
        select: 'title subject grade dueDate createdBy',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .sort({ completedAt: -1 })
      .lean();

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا توجد نتائج مهام لهذا المستخدم',
        data: {
          user: { name: user.name, grade: user.grade, role: user.role },
          results: [],
          statistics: {
            totalTasks: 0,
            averageScore: 0,
            bestScore: 0,
            worstScore: 0,
            totalTimeSpent: 0
          }
        }
      });
    }

    // حساب الإحصائيات
    const totalTasks = results.length;
    const scores = results.map(r => r.score.percentage);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / totalTasks);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    const totalTimeSpent = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

    // إعداد النتائج للعرض
    const formattedResults = results.map(result => ({
      id: result._id,
      task: {
        title: result.task?.title || 'غير متوفر',
        subject: result.task?.subject || 'غير متوفر',
        grade: result.task?.grade || 'غير متوفر',
        dueDate: result.task?.dueDate,
        createdBy: result.task?.createdBy?.name || 'غير معروف'
      },
      score: result.score,
      grade: result.grade,
      timeSpent: {
        seconds: result.timeSpent,
        display: `${Math.floor((result.timeSpent || 0) / 60)}:${((result.timeSpent || 0) % 60).toString().padStart(2, '0')}`
      },
      completedAt: result.completedAt
    }));

    res.status(200).json({
      success: true,
      message: 'تم جلب نتائج المهام بنجاح',
      data: {
        user: { name: user.name, grade: user.grade, role: user.role },
        results: formattedResults,
        statistics: {
          totalTasks,
          averageScore,
          bestScore,
          worstScore,
          totalTimeSpent: {
            seconds: totalTimeSpent,
            minutes: Math.floor(totalTimeSpent / 60),
            hours: Math.floor(totalTimeSpent / 3600),
            display: `${Math.floor(totalTimeSpent / 3600)}:${Math.floor((totalTimeSpent % 3600) / 60).toString().padStart(2, '0')}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
          }
        }
      }
    });
  } catch (error) {
    console.error('Error getting user task results:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب نتائج المهام', error: error.message });
  }
};
