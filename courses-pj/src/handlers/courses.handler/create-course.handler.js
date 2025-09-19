import { Course } from "../../models/course.js";


export const createCourseHandler = async (req, res) => {
  const instructorId = req.user?.userId || req.user?.instructorId || req.user?.id;

  console.log("Instructor ID:", instructorId);
  
  // التحقق من أن المستخدم instructor (أي instructor يقدر ينشئ كورس)
  if (!req.user || req.user.role !== 'instructor') {
    return res.status(403).json({ 
      message: "Forbidden: Only instructors can create courses" 
    });
  }

  const course = await Course.create({
    ...req.body,
    instructorId, // لا يزال نحفظ مين أنشأ الكورس للمرجعية
  });

  console.log("Course created by instructor:", req.user.email);
  res.status(201).json(course);
};
