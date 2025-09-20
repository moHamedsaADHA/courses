import { Course } from "../../models/course.js";
import { User } from "../../models/user.js";

export const createCourseHandler = async (req, res) => {
  
    let id = req.user._id || req.user.userId;
    let user = await User.findById(id);
    const courses = await Course.find();
    res.json(courses);

};
