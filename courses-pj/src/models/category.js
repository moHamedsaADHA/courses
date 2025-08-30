import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }  
  }
);
export const Category = mongoose.model("Category", courseSchema);

