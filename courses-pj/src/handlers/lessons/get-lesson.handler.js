import { Lesson } from '../../models/lesson.js';

export const getLessonHandler = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'لم يتم العثور على الحصة' });
    res.json({ lesson });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ message: 'خطأ في جلب الحصة', error: error.message });
  }
};
