import { Course } from "../../models/course.js";
export const updateCourseHandler = async (req, res) => {
    const { id } = req.params; 
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(updatedCourse);

};
