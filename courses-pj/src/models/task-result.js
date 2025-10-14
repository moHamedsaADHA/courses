import mongoose from 'mongoose';

const taskResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed, // Boolean أو String (ObjectId)
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
    totalPoints: { type: Number, required: true },
    earnedPoints: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true }
  },
  grade: {
    letter: { type: String },
    description: { type: String }
  },
  timeSpent: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

// إضافة فهارس لتحسين الأداء
taskResultSchema.index({ student: 1, task: 1 }, { unique: true }); // فهرس مركب فريد
taskResultSchema.index({ student: 1 }); // فهرس للطالب
taskResultSchema.index({ task: 1 }); // فهرس للمهمة
taskResultSchema.index({ student: 1, completedAt: -1 }); // فهرس للطالب والتاريخ
taskResultSchema.index({ 'score.percentage': -1 }); // فهرس للدرجة
taskResultSchema.index({ completedAt: -1 }); // فهرس للتاريخ

export const TaskResult = mongoose.model('TaskResult', taskResultSchema);
