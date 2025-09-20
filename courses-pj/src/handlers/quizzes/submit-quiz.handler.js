import { Quiz } from '../../models/quiz.js';
import { QuizResult } from '../../models/quiz-result.js';
import { User } from '../../models/user.js';

export const submitQuizHandler = async (req, res) => {
  try {
    const { quizId } = req.params;
    let { answers, startedAt, timeSpent } = req.body;
    const userId = req.user._id || req.user.userId;

    // تعديل لدعم التنسيق الذي يرسله الـ Frontend
    if (req.body.answers && typeof req.body.answers === 'object' && req.body.answers.answers) {
      answers = req.body.answers.answers;
      startedAt = req.body.answers.startTime || req.body.answers.startedAt;
      timeSpent = req.body.answers.timeSpent;
    }

    // التحقق من البيانات المطلوبة
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "الإجابات مطلوبة ويجب أن تكون مصفوفة"
      });
    }

    if (!startedAt) {
      return res.status(400).json({
        success: false,
        message: "وقت البدء مطلوب"
      });
    }

    // التحقق من صحة معرف الكويز
    if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "معرف الكويز غير صالح"
      });
    }

    // جلب الكويز مع الإجابات الصحيحة
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "الكويز غير موجود"
      });
    }

    if (!quiz.isActive) {
      return res.status(400).json({
        success: false,
        message: "هذا الكويز غير متاح حالياً"
      });
    }

    // جلب بيانات المستخدم
    const user = await User.findById(userId).select('grade role name');
    
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "هذه الميزة متاحة للطلاب فقط"
      });
    }

    if (user.grade !== quiz.grade) {
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
        message: "لقد قمت بحل هذا الكويز من قبل"
      });
    }

    // التحقق من عدد الإجابات
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `يجب الإجابة على جميع الأسئلة (${quiz.questions.length} سؤال)`
      });
    }

    // حساب الوقت المستغرق إذا لم يتم توفيره
    let actualTimeSpent = timeSpent;
    if (!actualTimeSpent) {
      const startTime = new Date(startedAt);
      const endTime = new Date();
      actualTimeSpent = Math.floor((endTime - startTime) / 1000); // بالثواني
    }

    // التحقق من أن الوقت لم يتجاوز الحد المسموح (مع هامش 30 ثانية)
    const timeLimit = quiz.timeLimit * 60; // تحويل إلى ثواني
    if (actualTimeSpent > timeLimit + 30) {
      return res.status(400).json({
        success: false,
        message: "تم تجاوز الوقت المحدد للكويز"
      });
    }

    // معالجة الإجابات وحساب النتائج
    const processedAnswers = [];
    let totalEarnedPoints = 0;
    let correctAnswersCount = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const answerObject = answers[i];
      
      // استخراج الإجابة من الكائن أو استخدامها مباشرةً
      const userAnswer = answerObject && typeof answerObject === 'object' && answerObject.answer 
        ? answerObject.answer 
        : answerObject;
      
      let isCorrect = false;
      let pointsEarned = 0;

      if (question.type === 'صح وخطأ') {
        // للأسئلة من نوع صح وخطأ
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === 'اختر من متعدد') {
        // للأسئلة من نوع اختر من متعدد
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = userAnswer === correctOption._id.toString();
      }

      if (isCorrect) {
        pointsEarned = question.points;
        totalEarnedPoints += pointsEarned;
        correctAnswersCount++;
      }

      processedAnswers.push({
        questionIndex: i,
        selectedAnswer: userAnswer,
        isCorrect,
        pointsEarned
      });
    }

    // حساب النسبة المئوية
    const percentage = Math.round((correctAnswersCount / quiz.questions.length) * 100);

    // حساب التقدير بناء على النسبة المئوية
    let gradeInfo = {};
    if (percentage >= 97) {
      gradeInfo = { letter: 'A+', description: 'ممتاز+' };
    } else if (percentage >= 93) {
      gradeInfo = { letter: 'A', description: 'ممتاز' };
    } else if (percentage >= 89) {
      gradeInfo = { letter: 'A-', description: 'ممتاز-' };
    } else if (percentage >= 84) {
      gradeInfo = { letter: 'B+', description: 'جيد جداً+' };
    } else if (percentage >= 80) {
      gradeInfo = { letter: 'B', description: 'جيد جداً' };
    } else if (percentage >= 76) {
      gradeInfo = { letter: 'B-', description: 'جيد جداً-' };
    } else if (percentage >= 73) {
      gradeInfo = { letter: 'C+', description: 'جيد+' };
    } else if (percentage >= 70) {
      gradeInfo = { letter: 'C', description: 'جيد' };
    } else if (percentage >= 67) {
      gradeInfo = { letter: 'C-', description: 'جيد-' };
    } else if (percentage >= 64) {
      gradeInfo = { letter: 'D+', description: 'مقبول+' };
    } else if (percentage >= 60) {
      gradeInfo = { letter: 'D', description: 'مقبول' };
    } else {
      gradeInfo = { letter: 'F', description: 'راسب' };
    }

    // إنشاء كائن النتيجة
    const quizResult = new QuizResult({
      student: userId,
      quiz: quizId,
      answers: processedAnswers,
      score: {
        totalPoints: quiz.totalPoints,
        earnedPoints: totalEarnedPoints,
        correctAnswers: correctAnswersCount,
        totalQuestions: quiz.questions.length,
        percentage
      },
      grade: gradeInfo,
      timeSpent: actualTimeSpent,
      startedAt: new Date(startedAt),
      completedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    // حفظ النتيجة
    await quizResult.save();

    // إعداد تفاصيل الإجابات للعرض
    const detailedAnswers = quiz.questions.map((question, index) => {
      const userAnswer = processedAnswers[index];
      let correctAnswer;
      let selectedAnswerText;

      if (question.type === 'صح وخطأ') {
        correctAnswer = question.correctAnswer ? 'صح' : 'خطأ';
        selectedAnswerText = userAnswer.selectedAnswer ? 'صح' : 'خطأ';
      } else if (question.type === 'اختر من متعدد') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        const selectedOption = question.options.find(opt => opt._id.toString() === userAnswer.selectedAnswer);
        
        correctAnswer = correctOption.text;
        selectedAnswerText = selectedOption ? selectedOption.text : 'لم يتم الاختيار';
      }

      return {
        questionIndex: index + 1,
        questionText: question.questionText,
        type: question.type,
        userAnswer: selectedAnswerText,
        correctAnswer,
        isCorrect: userAnswer.isCorrect,
        pointsEarned: userAnswer.pointsEarned,
        maxPoints: question.points,
        explanation: question.explanation
      };
    });

    // رسالة تحفيزية بناءً على النتيجة
    let motivationalMessage;
    if (percentage >= 90) {
      motivationalMessage = "🎉 ممتاز! أداء رائع جداً!";
    } else if (percentage >= 80) {
      motivationalMessage = "👏 أحسنت! أداء جيد جداً!";
    } else if (percentage >= 70) {
      motivationalMessage = "👍 جيد! يمكنك التحسن أكثر!";
    } else if (percentage >= 60) {
      motivationalMessage = "💪 أداء مقبول، واصل المذاكرة!";
    } else {
      motivationalMessage = "📚 تحتاج للمزيد من المذاكرة، لا تستسلم!";
    }

    res.status(200).json({
      success: true,
      message: "تم إرسال الإجابات وحساب النتيجة بنجاح",
      data: {
        result: {
          id: quizResult._id,
          quiz: {
            title: quiz.title,
            subject: quiz.subject,
            grade: quiz.grade
          },
          student: {
            name: user.name,
            grade: user.grade
          },
          score: quizResult.score,
          grade: quizResult.grade,
          timeSpent: {
            seconds: actualTimeSpent,
            minutes: Math.floor(actualTimeSpent / 60),
            display: `${Math.floor(actualTimeSpent / 60)}:${(actualTimeSpent % 60).toString().padStart(2, '0')}`
          },
          completedAt: quizResult.completedAt,
          motivationalMessage
        },
        answers: detailedAnswers,
        statistics: {
          totalQuestions: quiz.questions.length,
          correctAnswers: correctAnswersCount,
          incorrectAnswers: quiz.questions.length - correctAnswersCount,
          accuracyRate: percentage,
          pointsEarned: totalEarnedPoints,
          maxPoints: quiz.totalPoints
        }
      }
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء معالجة الإجابات",
      error: error.message
    });
  }
};