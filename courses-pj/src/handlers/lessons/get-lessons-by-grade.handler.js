import { Lesson } from '../../models/lesson.js';

export const getLessonsByGradeHandler = (fixedGrade) => async (req, res) => {
  try {
    const grade = fixedGrade || req.params.grade;
    if (!grade) {
      return res.status(400).json({ message: 'الصف مطلوب' });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [lessons, total] = await Promise.all([
      Lesson.find({ grade }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lesson.countDocuments({ grade })
    ]);

    res.json({
      grade,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      lessons
    });
  } catch (error) {
    console.error('Get lessons by grade error:', error);
    res.status(500).json({ message: 'خطأ في جلب الحصص حسب الصف', error: error.message });
  }
};
