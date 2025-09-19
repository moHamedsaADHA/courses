import { Course } from "../../models/course.js";

export const updateCourseHandler = async (req, res) => {
    // التحقق من أن المستخدم instructor (أي instructor يقدر يعدل أي كورس)
    if (!req.user || req.user.role !== 'instructor') {
        return res.status(403).json({ 
            message: "Forbidden: Only instructors can update courses" 
        });
    }

    const { id } = req.params; 
    
    // تحديث الكورس مع إضافة معلومات من عدّل
    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
            ...req.body,
            updatedAt: new Date(),
            lastModifiedBy: req.user.userId || req.user.instructorId || req.user.id
        },
        { new: true, runValidators: true } 
    );

    if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
    }

    console.log(`Course updated by instructor: ${req.user.email}`);
    res.status(200).json(updatedCourse);
};
