import mongoose from 'mongoose';

const educationalMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ]
  }
}, { timestamps: true });

// إضافة فهارس لتحسين الأداء
educationalMaterialSchema.index({ grade: 1 }); // فهرس للصف
educationalMaterialSchema.index({ createdAt: -1 }); // فهرس للتاريخ (الأحدث أولاً)
educationalMaterialSchema.index({ grade: 1, createdAt: -1 }); // فهرس مركب للصف والتاريخ

export const EducationalMaterial = mongoose.model('EducationalMaterial', educationalMaterialSchema);