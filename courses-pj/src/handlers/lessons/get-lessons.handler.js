import { Lesson } from '../../models/lesson.js';

export const getLessonsHandler = async (req, res) => {
  try {
    const { grade, unit, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (grade) query.grade = grade;
    if (unit) query.unitTitle = unit;
    if (search) {
      query.$or = [
        { lessonTitle: { $regex: search, $options: 'i' } },
        { unitTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [lessons, total] = await Promise.all([
      Lesson.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lesson.countDocuments(query)
    ]);

    res.json({
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ message: 'خطأ في جلب الحصص', error: error.message });
  }
};
