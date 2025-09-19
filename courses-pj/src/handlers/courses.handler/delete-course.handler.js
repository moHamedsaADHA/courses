import { Course } from "../../models/course.js";

export const deleteCourseHandler = async (req, res) => {
    // التحقق من أن المستخدم instructor (أي instructor يقدر يحذف أي كورس)
    if (!req.user || req.user.role !== 'instructor') {
        return res.status(403).json({ 
            message: "Forbidden: Only instructors can delete courses" 
        });
    }

    const { id } = req.params;
    
    // حذف الكورس فعلياً (مش تعديل!)
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
        return res.status(404).json({ error: "Course not found" });
    }

    console.log(`Course deleted by instructor: ${req.user.email}`);
    res.status(200).json({ 
        message: "Course deleted successfully",
        deletedCourse 
    });
};
