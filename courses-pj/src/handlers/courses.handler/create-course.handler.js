import { Course } from "../../models/course.js";


export const createCourseHandler = async (req, res) => {
  const instructorId = req.user?.userId || req.user?.instructorId || req.user?.id;

  console.log("Instructor ID:", instructorId);
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Forbidden: no role" });
  }

  const course = await Course.create({
    ...req.body,
    instructorId,
  });

  console.log(req.user);
  res.status(201).json(course);
};
