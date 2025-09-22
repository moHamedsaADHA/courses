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

taskResultSchema.index({ student: 1, task: 1 }, { unique: true });

export const TaskResult = mongoose.model('TaskResult', taskResultSchema);
