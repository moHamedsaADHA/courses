import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'تاريخ التسليم لا يمكن أن يكون في الماضي'
    }
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
taskSchema.index({ grade: 1, dueDate: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });
taskSchema.index({ subject: 1, grade: 1 });

// تحديث updatedAt عند التعديل
taskSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// تحقق من انتهاء صلاحية المهمة
taskSchema.methods.checkExpiry = function() {
  // يمكن إضافة منطق إضافي هنا عند الحاجة
  return Promise.resolve(this);
};

export const Task = mongoose.model('Task', taskSchema);