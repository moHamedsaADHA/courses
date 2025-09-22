import { Quiz } from '../../models/quiz.js';
import { QuizResult } from '../../models/quiz-result.js';
import { User } from '../../models/user.js';

export const startQuizHandler = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user._id || req.user.userId;

    // التحقق من صحة معرف الكويز
    if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "معرف الكويز غير صالح"
      });
    }

    // جلب الكويز
    const quiz = await Quiz.findById(quizId)
      .populate('createdBy', 'name email')
      .select('-questions.correctAnswer -questions.options.isCorrect');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "الكويز غير موجود"
      });
    }

    // التحقق من أن الكويز نشط
    if (!quiz.isActive) {
      return res.status(400).json({
        success: false,
        message: "هذا الكويز غير متاح حالياً"
      });
    }

    // جلب بيانات المستخدم للتحقق من الدور والصف
    const user = await User.findById(userId).select('grade role');

    // السماح للطالب أو المعلم أو الأدمن ببدء الكويز
    if (!['student', 'instructor', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "هذه الميزة متاحة للطلاب والمعلمين والإداريين فقط"
      });
    }

    // التحقق من الصف فقط للطلاب، أما المعلم والإدمن يمكنهم بدء أي كويز
    if (user.role === 'student' && user.grade !== quiz.grade) {
      return res.status(403).json({
        success: false,
        message: `هذا الكويز مخصص لـ ${quiz.grade} فقط`
      });
    }

    // التحقق من أن الطالب لم يحل الكويز من قبل
    const existingResult = await QuizResult.findOne({
      student: userId,
      quiz: quizId
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: "لقد قمت بحل هذا الكويز من قبل",
        previousResult: {
          score: existingResult.score,
          grade: existingResult.grade,
          completedAt: existingResult.completedAt
        }
      });
    }

    // إعداد الأسئلة للإرسال (بدون الإجابات الصحيحة)
    const questionsForStudent = quiz.questions.map((question, index) => ({
      questionIndex: index,
      questionText: question.questionText,
      type: question.type,
      points: question.points,
      explanation: question.explanation,
      options: question.type === 'اختر من متعدد' ? 
        question.options.map(option => ({
          _id: option._id,
          text: option.text
        })) : undefined
    }));

    res.status(200).json({
      success: true,
      message: "تم جلب الكويز بنجاح",
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          grade: quiz.grade,
          subject: quiz.subject,
          totalQuestions: quiz.totalQuestions,
          totalPoints: quiz.totalPoints,
          timeLimit: quiz.timeLimit,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt
        },
        questions: questionsForStudent,
        instructions: {
          timeLimit: quiz.timeLimit,
          totalQuestions: quiz.totalQuestions,
          totalPoints: quiz.totalPoints,
          rules: [
            "اقرأ كل سؤال بعناية",
            `لديك ${quiz.timeLimit} دقيقة لإنهاء الكويز`,
            "يمكنك حل الكويز مرة واحدة فقط",
            "تأكد من اختيار الإجابة الصحيحة قبل المتابعة",
            "سيتم حفظ إجاباتك تلقائياً عند الإرسال"
          ]
        },
        startedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب الكويز",
      error: error.message
    });
  }
};