import { Task } from '../../models/task.js';
import { TaskResult } from '../../models/task-result.js';
import { User } from '../../models/user.js';

export const submitTaskHandler = async (req, res) => {
  try {
    const { taskId } = req.params;
    let { answers, startedAt, timeSpent } = req.body;
    const userId = req.user._id || req.user.userId;

    // التحقق من صحة البيانات
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'الإجابات مطلوبة ويجب أن تكون مصفوفة'
      });
    }
    // وقت البدء اختياري في المهمات، إذا لم يوجد يتم حساب الوقت المستغرق كـ 0 أو من timeSpent فقط
    // جلب المهمة
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'المهمة غير موجودة' });
    }
    // جلب المستخدم
    const user = await User.findById(userId).select('grade role name');
    if (!['student', 'instructor', 'admin'].includes(user.role)) {
      return res.status(403).json({ success: false, message: 'هذه الميزة متاحة للطلاب والمعلمين والإداريين فقط' });
    }
    // التحقق من الصف فقط للطلاب، أما المعلم والإدمن يمكنهم تسليم أي مهمة
    if (user.role === 'student' && user.grade !== task.grade) {
      return res.status(403).json({ success: false, message: `هذه المهمة مخصصة لـ ${task.grade} فقط` });
    }
    // تحقق عدم تسليم المهمة سابقاً (يسمح للادمن بتسليم المهمة أكثر من مرة)
    const existingResult = await TaskResult.findOne({ student: userId, task: taskId });
    if (existingResult && user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'لقد قمت بتسليم هذه المهمة من قبل' });
    }
    // التحقق من عدد الإجابات
    if (answers.length !== task.questions.length) {
      return res.status(400).json({ success: false, message: `يجب الإجابة على جميع الأسئلة (${task.questions.length} سؤال)` });
    }
    // حساب الوقت المستغرق
    let actualTimeSpent = 0;
    if (typeof timeSpent === 'number' && !isNaN(timeSpent)) {
      actualTimeSpent = timeSpent;
    } else if (startedAt) {
      const startTime = new Date(startedAt);
      const endTime = new Date();
      if (!isNaN(startTime.getTime())) {
        actualTimeSpent = Math.floor((endTime - startTime) / 1000);
      }
    }
    // التصحيح وتجهيز النتائج
    const processedAnswers = [];
    let totalEarnedPoints = 0;
    let correctAnswersCount = 0;
    function normalizeTF(val) {
      if (val === true || val === 'صح' || val?.toString().toLowerCase() === 'true') return 'صح';
      if (val === false || val === 'خطأ' || val?.toString().toLowerCase() === 'false') return 'خطأ';
      if (typeof val === 'boolean') return val ? 'صح' : 'خطأ';
      if (typeof val === 'string') {
        const trimmed = val.trim().toLowerCase();
        if (trimmed === 'صح' || trimmed === 'true' || trimmed === 'yes') return 'صح';
        if (trimmed === 'خطأ' || trimmed === 'false' || trimmed === 'no') return 'خطأ';
      }
      return val;
    }
    for (let i = 0; i < task.questions.length; i++) {
      const question = task.questions[i];
      const userAnswer = answers[i];
      let isCorrect = false;
      let pointsEarned = 0;
      if (question.type === 'صح وخطأ') {
        const normalizedUserAnswer = normalizeTF(userAnswer);
        const normalizedCorrectAnswer = normalizeTF(question.correctAnswer);
        isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
      } else if (question.type === 'اختر من متعدد') {
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
    const percentage = Math.round((correctAnswersCount / task.questions.length) * 100);
    // تقدير بسيط
    let gradeInfo = {};
    if (percentage >= 90) gradeInfo = { letter: 'A', description: 'ممتاز' };
    else if (percentage >= 80) gradeInfo = { letter: 'B', description: 'جيد جداً' };
    else if (percentage >= 70) gradeInfo = { letter: 'C', description: 'جيد' };
    else if (percentage >= 60) gradeInfo = { letter: 'D', description: 'مقبول' };
    else gradeInfo = { letter: 'F', description: 'راسب' };
    // حفظ النتيجة
    const taskResultData = {
      student: userId,
      task: taskId,
      answers: processedAnswers,
      score: {
        totalPoints: task.questions.reduce((sum, q) => sum + q.points, 0),
        earnedPoints: totalEarnedPoints,
        correctAnswers: correctAnswersCount,
        totalQuestions: task.questions.length,
        percentage
      },
      grade: gradeInfo,
      timeSpent: actualTimeSpent,
      completedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };
    if (startedAt && !isNaN(new Date(startedAt).getTime())) {
      taskResultData.startedAt = new Date(startedAt);
    }
    const taskResult = new TaskResult(taskResultData);
    await taskResult.save();
    // تجهيز تفاصيل الإجابات
    const detailedAnswers = task.questions.map((question, index) => {
      const userAnswer = processedAnswers[index];
      let correctAnswer;
      let selectedAnswerText;
      if (question.type === 'صح وخطأ') {
        correctAnswer = normalizeTF(question.correctAnswer);
        selectedAnswerText = normalizeTF(userAnswer.selectedAnswer);
      } else if (question.type === 'اختر من متعدد') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        const selectedOption = question.options.find(opt => opt._id.toString() === userAnswer.selectedAnswer);
        correctAnswer = correctOption ? correctOption.text : 'غير محدد';
        selectedAnswerText = selectedOption ? selectedOption.text : 'لم يتم الإجابة';
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
    res.status(200).json({
      success: true,
      message: 'تم تسليم المهمة وحساب النتيجة بنجاح',
      data: {
        result: {
          id: taskResult._id,
          task: {
            title: task.title,
            subject: task.subject,
            grade: task.grade
          },
          student: {
            name: user.name,
            grade: user.grade
          },
          score: taskResult.score,
          grade: taskResult.grade,
          timeSpent: {
            seconds: actualTimeSpent,
            minutes: Math.floor(actualTimeSpent / 60),
            display: `${Math.floor(actualTimeSpent / 60)}:${(actualTimeSpent % 60).toString().padStart(2, '0')}`
          },
          completedAt: taskResult.completedAt
        },
        answers: detailedAnswers,
        statistics: {
          totalQuestions: task.questions.length,
          correctAnswers: correctAnswersCount,
          incorrectAnswers: task.questions.length - correctAnswersCount,
          accuracyRate: percentage,
          pointsEarned: totalEarnedPoints,
          maxPoints: task.questions.reduce((sum, q) => sum + q.points, 0)
        }
      }
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تسليم المهمة', error: error.message });
  }
};
