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
);

export const Course = mongoose.model("Course", courseSchema);

