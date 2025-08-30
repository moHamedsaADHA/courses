import { Course } from "../../models/course.js";
export const getAllCourses = async (req,res) => {
   
      const courses = await Course.find();
      res.json(courses);

  };
