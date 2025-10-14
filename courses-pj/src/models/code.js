import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], required: true },
  used: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// إضافة فهارس لتحسين الأداء
codeSchema.index({ code: 1 }, { unique: true }); // فهرس فريد للكود
codeSchema.index({ role: 1 }); // فهرس للدور
codeSchema.index({ used: 1 }); // فهرس لحالة الاستخدام
codeSchema.index({ role: 1, used: 1 }); // فهرس مركب للدور والاستخدام
codeSchema.index({ usedBy: 1 }); // فهرس للمستخدم

export const Code = mongoose.model('Code', codeSchema);
