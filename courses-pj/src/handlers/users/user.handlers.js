import { Course } from "../../models/course.js";
export const createCourseHandler = async (req, res) => {
  
    let id = req.user.id;
    let user = await user.findById(id);
    const courses = await Course.find();
    res.json(courses);

};
