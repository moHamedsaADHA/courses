import { QuizResult } from '../../models/quiz-result.js';
import { Quiz } from '../../models/quiz.js';

export const getQuizResultDetailsHandler = async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user._id || req.user.userId;

    // التحقق من صحة معرف النتيجة
    if (!resultId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "معرف النتيجة غير صالح"
      });
    }

    // جلب تفاصيل النتيجة
    const result = await QuizResult.findById(resultId)
      .populate({
        path: 'student',
        select: 'name email grade'
      })
      .populate({
        path: 'quiz',
        select: 'title description subject grade questions totalQuestions totalPoints timeLimit createdAt',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      })
      .lean();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "النتيجة غير موجودة"
      });
    }

    // التحقق من أن النتيجة تخص المستخدم الحالي أو أن المستخدم مدرس/أدمن
    const userRole = req.user.role;
    // إذا لم يوجد student أو لم يوجد _id اعتبرها غير مصرح
    if (!result.student || !result.student._id) {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بعرض هذه النتيجة"
      });
    }
    // قارن userId وresult.student._id بعد تحويلهما إلى string
    if (result.student._id.toString() !== userId.toString() && userRole !== 'instructor' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بعرض هذه النتيجة"
      });
    }

    // إعداد تفاصيل الأسئلة والإجابات
    const detailedAnswers = result.quiz.questions.map((question, index) => {
      const userAnswer = result.answers[index];
      let correctAnswerText;
      let selectedAnswerText;
      let optionsWithCorrect;

      if (question.type === 'صح وخطأ') {
        correctAnswerText = question.correctAnswer ? 'صح' : 'خطأ';
        selectedAnswerText = userAnswer.selectedAnswer ? 'صح' : 'خطأ';
      } else if (question.type === 'اختر من متعدد') {
        // إضافة معلومات الإجابة الصحيحة للخيارات
        optionsWithCorrect = question.options.map(option => ({
          _id: option._id,
          text: option.text,
          isCorrect: option.isCorrect,
          isSelected: option._id.toString() === userAnswer.selectedAnswer
        }));

        const correctOption = question.options.find(opt => opt.isCorrect);
        const selectedOption = question.options.find(opt => opt._id.toString() === userAnswer.selectedAnswer);
        
        correctAnswerText = correctOption?.text || 'غير محدد';
        selectedAnswerText = selectedOption?.text || 'لم يتم الاختيار';
      }

      return {
        questionNumber: index + 1,
        questionText: question.questionText,
        type: question.type,
        maxPoints: question.points,
        pointsEarned: userAnswer.pointsEarned,
        userAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: userAnswer.isCorrect,
        explanation: question.explanation,
        options: optionsWithCorrect
      };
    });

    // حساب إحصائيات إضافية
    const correctAnswers = result.answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = result.answers.length - correctAnswers;

    res.status(200).json({
      success: true,
      message: "تم جلب تفاصيل النتيجة بنجاح",
      data: {
        result: {
          id: result._id,
          student: result.student,
          quiz: {
            title: result.quiz.title,
            description: result.quiz.description,
            subject: result.quiz.subject,
            grade: result.quiz.grade,
            totalQuestions: result.quiz.totalQuestions,
            totalPoints: result.quiz.totalPoints,
            timeLimit: result.quiz.timeLimit,
            createdBy: result.quiz.createdBy,
            createdAt: result.quiz.createdAt
          },
          score: result.score,
          grade: result.grade,
          timeSpent: {
            seconds: result.timeSpent,
            minutes: Math.floor(result.timeSpent / 60),
            display: `${Math.floor(result.timeSpent / 60)}:${(result.timeSpent % 60).toString().padStart(2, '0')}`
          },
          completedAt: result.completedAt,
          startedAt: result.startedAt
        },
        answers: detailedAnswers,
        statistics: {
          totalQuestions: result.quiz.totalQuestions,
          correctAnswers,
          incorrectAnswers,
          accuracyRate: result.score.percentage,
          pointsEarned: result.score.earnedPoints,
          maxPoints: result.score.totalPoints,
          timeEfficiency: result.timeSpent <= (result.quiz.timeLimit * 60 * 0.75) ? 'ممتاز' :
                          result.timeSpent <= (result.quiz.timeLimit * 60 * 0.9) ? 'جيد' : 'عادي',
          breakdown: {
            byType: result.quiz.questions.reduce((acc, question, index) => {
              const type = question.type;
              if (!acc[type]) {
                acc[type] = { total: 0, correct: 0 };
              }
              acc[type].total++;
              if (result.answers[index].isCorrect) {
                acc[type].correct++;
              }
              return acc;
            }, {})
          }
        }
      }
    });

  } catch (error) {
    console.error('Error getting quiz result details:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب تفاصيل النتيجة",
      error: error.message
    });
  }
};