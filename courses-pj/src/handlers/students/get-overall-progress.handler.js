import { QuizResult } from '../../models/quiz-result.js';
import { TaskResult } from '../../models/task-result.js';
import { User } from '../../models/user.js';

export const getOverallProgressHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId).select('name grade role code');

    // جلب نتائج الكويزات
    const quizResults = await QuizResult.find({ student: userId }).lean();
    // جلب نتائج المهام
    const taskResults = await TaskResult.find({ student: userId }).lean();

    // حساب النسب
    const quizPercentages = quizResults.map(r => r.score?.percentage || 0);
    const taskPercentages = taskResults.map(r => r.score?.percentage || 0);
    const allPercentages = [...quizPercentages, ...taskPercentages];

    let overallPercentage = 0;
    if (allPercentages.length > 0) {
      overallPercentage = Math.round(allPercentages.reduce((sum, p) => sum + p, 0) / allPercentages.length);
    }

    // حساب عدد النجاح والسقوط
    const passed = allPercentages.filter(p => p >= 60).length;
    const failed = allPercentages.filter(p => p < 60).length;

    res.status(200).json({
      success: true,
      message: 'تم جلب المستوى العام للطالب بنجاح',
      data: {
        user: { 
          name: user.name, 
          grade: user.grade, 
          role: user.role,
          code: user.code
        },
        overallPercentage,
        totalActivities: allPercentages.length,
        passed,
        failed
      }
    });
  } catch (error) {
    console.error('Error getting overall progress:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المستوى العام', error: error.message });
  }
};
