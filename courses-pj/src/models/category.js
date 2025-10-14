import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }  
  },
  { timestamps: true }
);

// إضافة فهارس لتحسين الأداء
categorySchema.index({ name: 1 }, { unique: true }); // فهرس فريد للاسم
categorySchema.index({ name: 'text' }); // فهرس نصي للبحث

export const Category = mongoose.model("Category", categorySchema);

