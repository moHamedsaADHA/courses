import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed, // يمكن أن يكون Boolean أو String (ObjectId للخيارات)
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    pointsEarned: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  score: {
    totalPoints: {
      type: Number,
      required: true
    },
    earnedPoints: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  },
  grade: {
    letter: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
      required: true
    },
    description: {
      type: String,
      enum: ['ممتاز مرتفع', 'ممتاز', 'جيد جداً مرتفع', 'جيد جداً', 'جيد مرتفع', 'جيد', 'مقبول مرتفع', 'مقبول', 'راسب'],
      required: true
    }
  },
  timeSpent: {
    type: Number, // بالثواني
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

// فهارس لتحسين الأداء
quizResultSchema.index({ student: 1, quiz: 1 }, { unique: true }); // طالب واحد لكل كويز
quizResultSchema.index({ student: 1, completedAt: -1 });
quizResultSchema.index({ quiz: 1, completedAt: -1 });
quizResultSchema.index({ 'score.percentage': -1 });

// حساب التقدير بناءً على النسبة المئوية
quizResultSchema.methods.calculateGrade = function(percentage) {
  let letter, description;
  
  if (percentage >= 95) {
    letter = 'A+';
    description = 'ممتاز مرتفع';
  } else if (percentage >= 90) {
    letter = 'A';
    description = 'ممتاز';
  } else if (percentage >= 85) {
    letter = 'B+';
    description = 'جيد جداً مرتفع';
  } else if (percentage >= 80) {
    letter = 'B';
    description = 'جيد جداً';
  } else if (percentage >= 75) {
    letter = 'C+';
    description = 'جيد مرتفع';
  } else if (percentage >= 70) {
    letter = 'C';
    description = 'جيد';
  } else if (percentage >= 65) {
    letter = 'D+';
    description = 'مقبول مرتفع';
  } else if (percentage >= 60) {
    letter = 'D';
    description = 'مقبول';
  } else {
    letter = 'F';
    description = 'راسب';
  }
  
  return { letter, description };
};

// إضافة معلومات إضافية قبل الحفظ
quizResultSchema.pre('save', function(next) {
  // حساب التقدير تلقائياً
  const gradeInfo = this.calculateGrade(this.score.percentage);
  this.grade.letter = gradeInfo.letter;
  this.grade.description = gradeInfo.description;
  
  next();
});

// احصائيات سريعة للطالب
quizResultSchema.statics.getStudentStats = async function(studentId) {
  const stats = await this.aggregate([
    { $match: { student: mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score.percentage' },
        bestScore: { $max: '$score.percentage' },
        worstScore: { $min: '$score.percentage' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);
  
  return stats[0] || {
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    totalTimeSpent: 0
  };
};

// إضافة فهارس لتحسين الأداء
quizResultSchema.index({ student: 1 }); // فهرس للطالب
quizResultSchema.index({ quiz: 1 }); // فهرس للكويز
quizResultSchema.index({ student: 1, quiz: 1 }, { unique: true }); // فهرس مركب فريد
quizResultSchema.index({ student: 1, createdAt: -1 }); // فهرس للطالب والتاريخ
quizResultSchema.index({ 'score.percentage': -1 }); // فهرس للدرجة
quizResultSchema.index({ createdAt: -1 }); // فهرس للتاريخ

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);