import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true,
    enum: [
   
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي",

    ]
  },
  unitTitle: { type: String, required: true, trim: true },
  lessonTitle: { type: String, required: true, trim: true },
  videoUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// فهارس لتحسين الاستعلامات حسب الصف والزمن
lessonSchema.index({ grade: 1, createdAt: -1 });
lessonSchema.index({ createdBy: 1, createdAt: -1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
