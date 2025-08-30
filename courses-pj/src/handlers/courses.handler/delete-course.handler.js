import { Course } from "../../models/course.js";
export const deleteCourseHandler = async (req, res) => {
    const { id } = req.params;
    const deleteCourseHandler = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!deleteCourseHandler) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(deleteCourseHandler);

};
