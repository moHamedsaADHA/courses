import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  grade: {
    type: String,
    required: true,
    enum: [
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ]
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    type: {
      type: String,
      required: true,
      enum: ['صح وخطأ', 'اختر من متعدد']
    },
    // للأسئلة من نوع اختر من متعدد
    options: [{
      text: {
        type: String,
        required: function() {
          return this.parent().type === 'اختر من متعدد';
        },
        trim: true,
        maxlength: 200
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    // للأسئلة من نوع صح وخطأ
    correctAnswer: {
      type: Boolean,
      required: function() {
        return this.type === 'صح وخطأ';
      }
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: 300
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    }
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // بالدقائق
    min: 5,
    max: 180,
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// فهارس لتحسين الأداء
quizSchema.index({ grade: 1, subject: 1 });
quizSchema.index({ createdBy: 1, createdAt: -1 });
quizSchema.index({ grade: 1, isActive: 1 });
quizSchema.index({ subject: 1, grade: 1 });

// تحديث updatedAt عند التعديل
quizSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  
  // حساب العدد الإجمالي للأسئلة والنقاط
  if (this.questions && this.questions.length > 0) {
    this.totalQuestions = this.questions.length;
    this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  }
  
  next();
});

// التحقق من صحة الأسئلة
quizSchema.methods.validateQuestions = function() {
  const errors = [];
  
  this.questions.forEach((question, index) => {
    if (question.type === 'اختر من متعدد') {
      if (!question.options || question.options.length < 2) {
        errors.push(`السؤال ${index + 1}: يجب أن يحتوي على خيارين على الأقل`);
      } else {
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
          errors.push(`السؤال ${index + 1}: يجب تحديد الإجابة الصحيحة`);
        }
        if (correctOptions.length > 1) {
          errors.push(`السؤال ${index + 1}: يجب تحديد إجابة صحيحة واحدة فقط`);
        }
      }
    }
    
    if (question.type === 'صح وخطأ') {
      if (typeof question.correctAnswer !== 'boolean') {
        errors.push(`السؤال ${index + 1}: يجب تحديد الإجابة الصحيحة (صح أو خطأ)`);
      }
    }
  });
  
  return errors;
};

// حساب النتيجة
quizSchema.methods.calculateScore = function(answers) {
  let score = 0;
  let correctAnswers = 0;
  
  this.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    let isCorrect = false;
    
    if (question.type === 'صح وخطأ') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'اختر من متعدد') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      isCorrect = userAnswer === correctOption._id.toString();
    }
    
    if (isCorrect) {
      score += question.points;
      correctAnswers++;
    }
  });
  
  return {
    score,
    correctAnswers,
    totalQuestions: this.totalQuestions,
    totalPoints: this.totalPoints,
    percentage: (correctAnswers / this.totalQuestions) * 100
  };
};

// إضافة فهارس لتحسين الأداء
quizSchema.index({ grade: 1 }); // فهرس للصف
quizSchema.index({ subject: 1 }); // فهرس للمادة
quizSchema.index({ createdBy: 1 }); // فهرس للمنشئ
quizSchema.index({ createdAt: -1 }); // فهرس للتاريخ
quizSchema.index({ grade: 1, subject: 1 }); // فهرس مركب للصف والمادة
quizSchema.index({ grade: 1, createdAt: -1 }); // فهرس مركب للصف والتاريخ
quizSchema.index({ isPublished: 1, grade: 1 }); // فهرس للحالة والصف

export const Quiz = mongoose.model('Quiz', quizSchema);