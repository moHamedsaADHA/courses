import { Course } from "../../models/course.js";
import { User } from "../../models/user.js";

export const getCourses = async (req, res) => {
    // token payload
        const id = req.user?.userId || req.user?.instructorId || req.user?.id || null;

        if (!id) {
            return res.status(401).json({ message: "Missing user id in token payload" });
    }

        const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const courses = await Course.find();
    return res.json(courses);
};
