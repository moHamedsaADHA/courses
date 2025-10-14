import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// إضافة فهارس لتحسين الأداء
courseSchema.index({ categoryId: 1 }); // فهرس للفئة
courseSchema.index({ userId: 1 }); // فهرس للمستخدم المنشئ
courseSchema.index({ title: 'text', description: 'text' }); // فهرس نصي للبحث
courseSchema.index({ price: 1 }); // فهرس للسعر
courseSchema.index({ createdAt: -1 }); // فهرس للتاريخ

export const Course = mongoose.model("Course", courseSchema);

