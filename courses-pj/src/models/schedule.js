import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      'الأحد', 
      'الاثنين', 
      'الثلاثاء', 
      'الأربعاء', 
      'الخميس', 
      'الجمعة', 
      'السبت'
    ]
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  timeFrom: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  timeTo: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// فهارس لتحسين الأداء
scheduleSchema.index({ grade: 1, date: 1 });
scheduleSchema.index({ instructor: 1, date: 1 });
scheduleSchema.index({ day: 1, grade: 1 });

// تحقق من صحة التوقيت (من أصغر من إلى)
scheduleSchema.pre('save', function(next) {
  const timeFromMinutes = this.timeFrom.split(':').reduce((h, m) => h * 60 + +m);
  const timeToMinutes = this.timeTo.split(':').reduce((h, m) => h * 60 + +m);
  
  if (timeFromMinutes >= timeToMinutes) {
    return next(new Error('وقت البداية يجب أن يكون قبل وقت النهاية'));
  }
  next();
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);